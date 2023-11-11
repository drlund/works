"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class MtnLogger extends Model {
  
  static get connection() {
    return "logs";
  }
  
  static get table () {
    return 'logger_mtn'
  }

  static get createdAtColumn() {
    return 'createdAt';
  }

  static get updatedAtColumn() {
    return 'updatedAt';
  }

}

module.exports = MtnLogger;
