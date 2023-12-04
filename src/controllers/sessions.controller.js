import jwt from "jsonwebtoken";
import config from "../config/config.js";
import UserDto from "../dto/userDto.js";

const register = async (req, res) => {
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

export default {
  register,
  login,
  logout,
  current,
  githubcallback,
  googlecallback,
};
