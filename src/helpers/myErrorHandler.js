import fs from "fs";
import __dirname from "../utils.js";
import errorCodes from "../dictionaries/errorCodes.js";
import ErrorsDictionary from "../dictionaries/errors.js";

class MyCustomError {
  constructor(path) {
    this.path = "../helpers/errors.json";
  }

  addError(error) {
    const newError = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };

    if (fs.existsSync(this.path)) {
      const errors = JSON.parse(fs.readFileSync(this.path));
      errors.push(newError);
      fs.writeFileSync(this.path, JSON.stringify(errors));
    } else {
      fs.writeFileSync(this.path, JSON.stringify([newError]));
    }
  }
}

const myErrorHandler = (error, next) => {
  const customError = new Error();
  const knownError = ErrorsDictionary[error.name];

  if (knownError) {
    customError.name = knownError;
    customError.message = error.message;
    customError.code = errorCodes[knownError];
    next(customError);
  } else {
    const customErrorInstance = new MyCustomError("../src/helpers/errors.json");
    customErrorInstance.addError(error);
    next(error);
  }
};

export default myErrorHandler;
