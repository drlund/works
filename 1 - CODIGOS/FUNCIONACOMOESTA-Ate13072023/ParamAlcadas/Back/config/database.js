"use strict";

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use("Env");

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the default connection settings to be used while
  | interacting with SQL databases.
  |
  */
  connection: Env.get("DB_CONNECTION", "dipes"),

  /*
  |--------------------------------------------------------------------------
  | MySQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for MySQL database.
  |
  | npm i --save mysql
  |
  */
  dipes: require("./databases/Dipes"),
  dipesSas: require("./databases/DipesSas"),
  mysqlGestores: require("./databases/Gestores"),
  mysqlOrdemServico: require("./databases/OrdemServ"),
  mysqlBaseINC: require("./databases/INC"),
  mysqlCtrlDisciplinar: require("./databases/CtrlDisciplinar"),
  coban: require("./databases/Coban"),
  superadm: require("./databases/Superadm"),
  mestreSas: require("./databases/MestreSas"),
  feriados: require("./databases/Feriados"),
  designacao: require("./databases/Designacao"),
  patrocinios: require("./databases/Patrocinios"),
  acessos: require("./databases/Acessos"),
  encantar: require("./databases/Encantar"),
  tarifas: require("./databases/Tarifas"),
  appAniversariantes: require("./databases/AppAniversariantes"),
  projetos: require("./databases/Projetos"),
  logs: require("./databases/Logs"),
  horasExtras: require("./databases/HorasExtras"),
  baseHorasExtras: require("./databases/BaseHorasExtras"),
  chavesApi: require("./databases/ChavesApi"),
  filaEmails: require("./databases/FilaEmails"),
  procuracao: require("./databases/Procuracao"),
  ambiencia: require("./databases/Ambiencia"),
  painelGestor: require("./databases/PainelGestor"),
  plataforma: require("./databases/Plataforma"),
  movimentacoes: require("./databases/Movimentacoes"),
  carrossel: require("./databases/Carrossel"),
  flexCriterios: require("./databases/FlexCriterios"),
  podcasts: require("./databases/Podcasts"),

  /*
  |--------------------------------------------------------------------------
  | PostgreSQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for PostgreSQL database.
  |
  | npm i --save pg
  |
  */
  pgMtn: require("./databases/Mtn"),
  pgBacenProcedentes: require("./databases/BacenProcedentes"),

  /*
  |--------------------------------------------------------------------------
  | MongoDB
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for MongoDB database.
  |
  */
  mongodb: require("./databases/MongoDB"),
};
