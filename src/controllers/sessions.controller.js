import jwt from "jsonwebtoken";
import config from "../config/config.js";
import UserDto from "../dto/userDto.js";
import MailerService from "../services/MailerService.js";

const register = async (req, res) => {
  try {
    const mailInfo = {
      from: "Distribuidora <ayelenleclerc@gmail.com>",
      to: req.user.email,
      subject: "Bienvenid@ a la Distribuidora",
      html: `
    <div>
      <h1>Bienvenid@ a la Distribuidora</h1>
      <h3>¡Hola, ${req.user.firstName}!</h3>
      <p>Gracias por registrarte, desde ahora puedes comprar en la distribuidora, chatear con otros clientes y mucho más.</p>
      <br>
      <p>Saludos cordiales</p>
      <p>Distribuidora</p>
 
      </div>
    `,
    };
    const mailerService = new MailerService();
    const result = await mailerService.sendMail(mailInfo);
  } catch (error) {
    console.log(`Falló el envío de correo para ${req.user.email}`);
  }
  res.clearCookie("cart");
  return res.sendSuccess("Registered");
};

const login = async (req, res) => {
  const tokenizedUser = UserDto.getTokenDTOFrom(req.user);
  const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
    expiresIn: "1d",
  });
  res.cookie(config.jwt.COOKIE, token);
  res.clearCookie("cart");
  return res.sendSuccess("Logged In");
};

const logout = async (req, res) => {
  res.clearCookie(config.jwt.COOKIE);
  return res.sendSuccess("Logged Out");
};

const current = async (req, res) => {
  return res.sendSuccessWithPayload(req.user);
};

const githubcallback = async (req, res) => {
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

    return res.redirect("/profile");
  } catch (error) {
    console.error("Error in GitHub callback:", error);
    return res.sendError("An error occurred during login");
  }
};

const googlecallback = async (req, res) => {
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
    return res.redirect("/profile");
  } catch (error) {
    console.error("Error in Google callback:", error);
    return res.sendError("An error occurred during login");
  }
};

const passwordRestoreRequest = async (req, res) => {
  const { email } = req.body;
  const user = await usersService.getUserBy({ email });
  if (!user) return res.sendBadRequest("User doesn't exist ");
  const token = jwt.sign({ email }, config.jwt.SECRET, {
    expiresIn: "1d",
  });
  const mailerService = new MailerService();
  const result = await mailerService.sendMail(
    [email],
    DMailTemplates.PWD_RESTORE,
    { token }
  );
  res.sendSuccess("Email sent");
};

const passwordRestore = async (req, res) => {
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
      return res.sendBadRequest("New Password Cannot be equal to Old Password");
    //Hashear mi nuevo password
    const hashNewPassword = await authService.createHash(newPassword);
    await usersService.updateUser(user._id, { password: hashNewPassword });
    res.sendSuccess();
  } catch (error) {
    console.log(error);
    res.sendBadRequest("Invalid token");
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
