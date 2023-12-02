import BaseRouter from "./BaseRouter.js";
import viewsController from "../controllers/views.controller.js";
class ViewsRouter extends BaseRouter {
  init() {
    this.get("/register", ["NO_AUTH"], viewsController.register);

    this.get("/login", ["NO_AUTH"], viewsController.login);

    this.get("/profile", ["AUTH"], viewsController.profile);

    this.get("/", ["PUBLIC"], viewsController.home);

    this.get("/products", ["PUBLIC"], viewsController.products);

    this.get(
      "/realTimeProducts",
      ["ADMIN", "PREMIUM"],
      viewsController.realTimeProducts
    );

    this.get("/chat", ["PUBLIC"], viewsController.chat);

    this.get("/cart", ["AUTH"], viewsController.cart);

    this.get("/purchase", ["AUTH"], viewsController.purchase);
  }
}

const viewsRouter = new ViewsRouter();

export default viewsRouter.getRouter();
