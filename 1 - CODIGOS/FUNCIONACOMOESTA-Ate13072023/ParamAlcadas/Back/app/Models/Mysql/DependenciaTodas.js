"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Dependencia extends Model {
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

  // getNomePrefixo({getNomePrefixo}){
  //   return nome;
  // }

  getDiretoria({ cd_diretor_juris }) {
    return cd_diretor_juris;
  }

  getSuper({ cd_super_juris }) {
    return cd_super_juris;
  }

  getGerev({ cd_gerev_juris }) {
    return cd_gerev_juris;
  }

  static get visible() {
    return [
      "prefixo",
      "nome",
      "cd_subord",
      "tip_dep",
      "uor_dependencia",
      "cd_gerev_juris",
      "cd_super_juris",
      "cd_diretor_juris",
      "nomePrefixo",
      "email",
      "diretoria",
      "super",
      "gerev",
    ];
  }
}

module.exports = Dependencia;
