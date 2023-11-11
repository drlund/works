"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class MinutasTemplate extends Model {
  static get connection() {
    return "procuracao";
  }

  static get table() {
    return "minutas_template_derivado";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat([
      "createdAt",
    ]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm");
  }

  templateBase() {
    return this.hasOne(
      "App/Models/Mysql/Procuracao/MinutasTemplate",
      "idTemplateBase",
      "idTemplate"
    );
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = MinutasTemplate;
