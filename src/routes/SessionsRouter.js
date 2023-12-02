import passportCall from "../middlewares/passportCall.js";
import BaseRouter from "./BaseRouter.js";
import sessionsController from "../controllers/sessions.controller.js";

class SessionsRouter extends BaseRouter {
  init() {
    this.post(
      "/register",
      ["PUBLIC"],
      passportCall("register", { strategyType: "LOCALS" }),
      sessionsController.register
    );

    this.post(
      "/login",
      ["NO_AUTH"],
      passportCall("login", { strategyType: "LOCALS" }),
      sessionsController.login
    );

    this.get("/logout", ["AUTH"], sessionsController.logout);

    this.get("/current", ["AUTH"], sessionsController.current);
  }
}

const sessionsRouter = new SessionsRouter();

export default sessionsRouter.getRouter();
