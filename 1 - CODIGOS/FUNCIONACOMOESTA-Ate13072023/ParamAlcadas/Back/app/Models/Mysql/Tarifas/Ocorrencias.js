"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Tarifa extends Model {
  static get connection() {
    return "tarifas";
  }

  static get table() {
    return "publicoAlvo";
  }

  reservas() {
    return this.hasMany(
      "App/Models/Mysql/Tarifas/Reservas",
      "id",
      "idPublicoAlvo "
    );
  }

  contatos() {
    return this.hasMany(
      "App/Models/Mysql/Tarifas/ReservasContato",
      "id",
      "idPublicoAlvo "
    );
  }

  dadosCliente() {
    return this.hasOne(
      "App/Models/Mysql/Tarifas/DadosComplementaresCliente",
      "mci",
      "mci"
    );
  }

  linhaTempo() {
    return this.hasMany(
      "App/Models/Mysql/Tarifas/LinhaTempo",
      "id",
      "idPublicoAlvo"
    );
  }

  status() {
    return this.hasOne(
      "App/Models/Mysql/Tarifas/OcorrenciaStatus",
      "id",
      "idPublicoAlvo"
    );
  }

  pagamentos() {
    return this.hasMany(
      "App/Models/Mysql/Tarifas/Pagamentos",
      "id",
      "idPublicoAlvo"
    );
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = Tarifa;
