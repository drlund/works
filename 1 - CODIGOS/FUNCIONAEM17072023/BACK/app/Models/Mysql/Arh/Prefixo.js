"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Prefixo extends Model {
  static get computed() {
    return ["diretoria", "super", "gerev"];
  }

  static get connection() {
    return "dipes";
  }

  static get table() {
    return "mst606";
  }

  static get primaryKey() {
    return "prefixo";
  }

  static get incrementing() {
    return false;
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  getDiretoria({ cd_diretor_juris }) {
    return cd_diretor_juris;
  }

  getSuper({ cd_super_juris }) {
    return cd_super_juris;
  }

  getGerev({ cd_gerev_juris }) {
    return cd_gerev_juris;
  }

  dadosDiretoria() {
    return this.hasOne(
      "App/Models/Mysql/Arh/Prefixo",
      "cd_diretor_juris",
      "prefixo"
    );
  }
  //ALTERAR AQUI
  dadosSuper() {
    return this.hasOne(
      "App/Models/Mysql/Arh/Prefixo",
      "cd_super_juris",
      "prefixo"
    );
  }

  dadosGerev() {
    return this.hasOne(
      "App/Models/Mysql/Arh/Prefixo",
      "cd_gerev_juris",
      "prefixo"
    );
  }

  dotacao() {
    return this.hasMany(
      "App/Models/Mysql/Arh/Dotacao",
      "prefixo",
      "cod_dependencia"
    );
  }

  uor500g() {
    return this.hasOne(
      "App/Models/Mysql/Arh/Uors500g",
      "uor_dependencia",
      "CodigoUOR"
    );
  }

  static boot() {
    super.boot();
    this.addTrait("GetSb00");
  }
}

module.exports = Prefixo;
