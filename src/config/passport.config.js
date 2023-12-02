import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

import { usersService, cartsService } from "../services/index.js";
import authService from "../services/authService.js";
import config from "./config.js";

const initializePassportStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email", session: false },
      async (req, email, password, done) => {
        try {
          const { firstName, lastName } = req.body;
          if (!firstName || !lastName)
            return done(null, false, { message: "Incomplete values" });

          const exists = await usersService.getUserBy({ email });
          if (exists)
            return done(null, false, { message: "User already exists" });

          const hashedPassword = await authService.createHash(password);

          const newUser = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
          };

          let cart;
          if (req.cookies["cart"]) {
            cart = req.cookies["cart"];
          } else {
            const cartResult = await cartsService.createCart();
            cart = cartResult.id;
          }
          newUser.cart = cart;

          const result = await usersService.createUser(newUser);
          return done(null, result);
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", session: false },
      async (email, password, done) => {
        try {
          if (
            email === config.app.ADMIN_EMAIL &&
            password === config.app.ADMIN_PASSWORD
          ) {
            const adminUser = {
              role: "admin",
              id: "0",
              firstName: "admin",
            };
            return done(null, adminUser);
          }

          const user = await usersService.getUserBy({ email });
          if (!user)
            return done(null, false, { message: "Invalid Credentials" });

          const isValidPassword = await authService.validatePassword(
            password,
            user.password
          );
          if (!isValidPassword)
            return done(null, false, { message: "Invalid Credentials" });
          return done(null, user);
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          authService.extractAuthToken,
        ]),
        secretOrKey: "jwtSecret",
      },
      async (payload, done) => {
        return done(null, payload);
      }
    )
  );
};

export default initializePassportStrategies;
