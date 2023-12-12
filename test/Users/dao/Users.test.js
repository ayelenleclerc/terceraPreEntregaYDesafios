import mongoose from "mongoose";
import UsersDao from "../../../src/dao/mongo/UsersDao.js";
import { strict as assert } from "assert";

mongoose.connect(
  "mongodb+srv://Ayelenleclerc:yuskia13@backend.xrrgkdz.mongodb.net/ecommerce?retryWrites=true&w=majority"
);

describe("test unitarios para DAO de usuarios", function () {
  this.timeout(10000);
  before(function () {
    this.usersDao = new UsersDao();
  });
  it("El DAO debe poder devolver a los usuarios en formato de arreglo", async function () {
    const result = await this.usersDao.getUsers();
    assert.equal(Array.isArray(result), true);
  });

  it("El DAO debe poder devolver a un usuario en formato de objeto", async function () {
    const result = await this.usersDao.getUserBy({
      email: "ayelenleclerc@gmail.com",
    });
    assert.equal(typeof result, "object");
  });
  it("El DAO debe poder crear un usuario", async function () {
    const mockUser = {
      firstName: "Leticia",
      lastName: "Galiñanes",
      email: "letigali+1@gmail.com",
      password: "123",
    };
    const result = await this.usersDao.createUser(mockUser);
    console.log(`El Id del usuario creado es: ${result._id}`);
    assert.ok(result._id);
  });
});
