"use strict";

class BaseUseCase {
  run() {
    throw { message: "O método run deve estar definido" };
  }

  _validateData() {
    throw { message: "O método _validateData deve estar definido" };
  }
}

module.exports = BaseUseCase;
