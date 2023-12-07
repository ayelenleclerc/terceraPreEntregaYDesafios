import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";

import productsRouter from "./routes/ProductsRouter.js";
import cartsRouter from "./routes/CartRouter.js";
import viewsRouter from "./routes/ViewsRouter.js";
import SessionsRouter from "./routes/SessionsRouter.js";
import chatRouter from "./routes/ChatRoutes.js";

import __dirname from "./utils.js";
import config from "./config/config.js";
import initializePassportStrategies from "./config/passport.config.js";
import registerChatHandler from "./listeners/chat.listener.js";

const app = express();

const PORT = process.env.PORT || 8081;

const connection = mongoose.connect(config.mongo.URL);
console.log("Base de datos conectada");

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassportStrategies();

//rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", SessionsRouter);
app.use("/api/chat", chatRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Cliente conectado con id: ", socket.id);
  registerChatHandler(io, socket);

  socket.on("disconnect", () => {
    console.log(`Usuario con ID : ${socket.id} esta desconectado `);
  });
});
