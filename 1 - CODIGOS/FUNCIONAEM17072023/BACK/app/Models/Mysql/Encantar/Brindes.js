"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Brindes extends Model {
  static get connection() {
    return "encantar";
  }

  static get table() {
    return "app_encantar.brindes";
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(["createdAt", "updatedAt", "validade"]);
  }

  //formato de saida das datas
  static castDates(field, value) {
    if (field === "validade") {
      return value.format("DD/MM/YYYY");
    }

    return value.format("DD/MM/YYYY hh:mm");
  }

  estoques() {
    return this.hasMany(
      "App/Models/Mysql/Encantar/BrindesEstoque",
      "id",
      "idBrinde"
    );
  }

  imagens() {
    return this.belongsToMany(
      "App/Models/Mysql/Encantar/Imagens",
      "idBrinde",
      "idImagem",
      "id",
      "id"
    ).pivotTable("app_encantar.brindesImagens");
  }

  tags() {
    return this.belongsToMany(
      "App/Models/Mysql/Encantar/Tag",
      "idBrinde",
      "idTag",
      "id",
      "id"
    ).pivotTable("app_encantar.brindesTag");
  }

  static get createdAtColumn() {
    return "createdAt";
  }

  static get updatedAtColumn() {
    return "updatedAt";
  }
}

module.exports = Brindes;
