import { usersService } from "../services/index.js";
import myErrorHandler from "../helpers/myErrorHandler.js";

const getUsers = async (req, res, next) => {
  try {
    const users = await usersService.getUsers();
    return res.send({ status: "success", payload: users });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};
const getUserBy = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await usersService.getUserBy({ _id: uid });
    if (!user)
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    return res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};
const createUser = async (req, res, next) => {
  try {
    const result = await usersService.createUser();
    req.logger.info("User created successfully", result._id);
    return res.send({ status: "success", payload: result._id });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await usersService.getUserBy({ _id: uid });
    if (!user)
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    const result = await usersService.updateUser(uid, req.body);
    req.logger.info("User updated successfully", { uid });
    return res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await usersService.getUserBy({ _id: uid });
    if (!user)
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    await usersService.deleteUser(uid);
    req.logger.info("User deleted successfully", { uid });
    return res.send({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    req.logger.error(error);
    myErrorHandler(error, next);
  }
};

export default {
  getUsers,
  getUserBy,
  createUser,
  updateUser,
  deleteUser,
};
