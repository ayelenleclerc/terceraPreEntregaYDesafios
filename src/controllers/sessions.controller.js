import jwt from "jsonwebtoken";
import config from "../config/config.js";
import UserDto from "../dto/userDto.js";
import MailerService from "../services/MailerService.js";
import DMailTemplates from "../constants//DMailTemplates.js";
import { usersService } from "../services/index.js";
import authService from "../services/authService.js";
import myErrorHandler from "../helpers/myErrorHandler.js";

const register = async (req, res, next) => {
  try {
    try {
      const mailerService = new MailerService();
      const result = await mailerService.sendMail(
        [req.user.email],
        DMailTemplates.WELCOME,
        {
          user: req.user,
        }
      );
    } catch (error) {
      console.log(`Falló el envío de correo para ${req.user.email}`, error);
    }
    res.clearCookie("cart");
    return res.sendSuccess("Registered");
  } catch (error) {
    myErrorHandler(error, next);
  }
};

const login = async (req, res, next) => {
  try {
    const tokenizedUser = UserDto.getTokenDTOFrom(req.user);
    const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
      expiresIn: "1d",
    });
    res.cookie(config.jwt.COOKIE, token);
    res.clearCookie("cart");
    return res.sendSuccess("Logged In");
  } catch (error) {
    myErrorHandler(error, next);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie(config.jwt.COOKIE);
    return res.sendSuccess("Logged Out");
  } catch (error) {
    myErrorHandler(error, next);
  }
};

const current = async (req, res, next) => {
  try {
    return res.sendSuccessWithPayload(req.user);
  } catch (error) {
    myErrorHandler(error, next);
  }
};

const githubcallback = async (req, res, next) => {
  try {
    const { firstName, lastName, _id, role, cart, email } = req.user;
    const tokenizedUser = UserDto.getTokenDTOFrom(req.user);
    const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
      expiresIn: "1d",
    });

    res.cookie(config.jwt.COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 86400000,
    });

    res.clearCookie("cart");
    try {
      const mailerService = new MailerService();
      const result = await mailerService.sendMail(
        [req.user.email],
        DMailTemplates.WELCOME,
        {
          user: req.user,
        }
      );
    } catch (error) {
      console.log(`Falló el envío de correo para ${req.user.email}`, error);
    }
    return res.redirect("/profile");
  } catch (error) {
    myErrorHandler(error, next);
  }
};

const googlecallback = async (req, res, next) => {
  try {
    const { firstName, lastName, _id, role, cart, email } = req.user;
    const tokenizedUser = UserDto.getTokenDTOFrom(req.user);
    const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
      expiresIn: "1d",
    });
    res.cookie(config.jwt.COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 86400000,
    });
    res.clearCookie("cart");
    try {
      const mailerService = new MailerService();
      const result = await mailerService.sendMail(
        [req.user.email],
        DMailTemplates.WELCOME,
        {
          user: req.user,
        }
      );
    } catch (error) {
      console.log(`Falló el envío de correo para ${req.user.email}`, error);
    }
    return res.redirect("/profile");
  } catch (error) {
    myErrorHandler(error, next);
  }
};

const passwordRestoreRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await usersService.getUserBy({ email });
    if (!user) return res.sendBadRequest("User doesn't exist ");
    const token = jwt.sign({ email }, config.jwt.SECRET, {
      expiresIn: "1d",
    });
    const mailerService = new MailerService();
    const result = await mailerService.sendMail(
      [email],
      DMailTemplates.RESTORE_PWD,
      { token }
    );
    res.sendSuccess("Email sent");
  } catch (error) {
    myErrorHandler(error, next);
  }
};

const passwordRestore = async (req, res, next) => {
  try {
    const { newPassword, token } = req.body;
    if (!newPassword || !token) return res.sendBadRequest("Incomplete values");
    try {
      //El token es válido?
      const { email } = jwt.verify(token, config.jwt.SECRET);
      //El usuario sí está en la base?
      const user = await usersService.getUserBy({ email });
      if (!user) return res.sendBadRequest("User doesn't exist");
      //¿No será la misma contraseña que ya tiene?
      const isSamePassword = await authService.validatePassword(
        newPassword,
        user.password
      );
      if (isSamePassword)
        return res.sendBadRequest(
          "New Password Cannot be equal to Old Password"
        );
      //Hashear mi nuevo password
      const hashNewPassword = await authService.createHash(newPassword);
      await usersService.updateUser(user._id, { password: hashNewPassword });
      res.sendSuccess();
    } catch (error) {
      console.log(error);
      res.sendBadRequest("Invalid token");
    }
  } catch (error) {
    myErrorHandler(error, next);
  }
};

export default {
  register,
  login,
  logout,
  current,
  githubcallback,
  googlecallback,
  passwordRestoreRequest,
  passwordRestore,
};
