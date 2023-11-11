"use strict";

const path = require("path");

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/

const providers = [
  "@adonisjs/framework/providers/AppProvider",
  //desativando o modulo padrao de autenticacao do adonis
  // '@adonisjs/auth/providers/AuthProvider',
  "@adonisjs/bodyparser/providers/BodyParserProvider",
  "@adonisjs/cors/providers/CorsProvider",
  "@adonisjs/lucid/providers/LucidProvider",
  "@adonisjs/session/providers/SessionProvider",
  "@adonisjs/validator/providers/ValidatorProvider",
  "@adonisjs/drive/providers/DriveProvider",
  "adonis-bumblebee/providers/BumblebeeProvider",
  "@adonisjs/redis/providers/RedisProvider",
  path.join(__dirname, "..", "providers", "LogMongoDBProvider"),
];

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
const aceProviders = [
  "@adonisjs/lucid/providers/MigrationsProvider",
  "@adonisjs/vow/providers/VowProvider",
  "adonis-bumblebee/providers/CommandsProvider",
];

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/

const aliases = {
  exception: "App/Exceptions/Handler",
  SendMail: "App/Commons/SendMail",
  JsonToCsv: "App/Commons/JsonToCsv",
  StringUtils: "App/Commons/StringUtils",
  DateUtils: "App/Commons/DateUtils",
  Constants: "App/Commons/Constants",
  Regex: "App/Commons/Regex",
};

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
const commands = [
  "App/Commands/mtn/AtualizaPrazosEsclarecimento",
  "App/Commands/mtn/AtualizarPrazosRecurso",
  "App/Commands/mtn/AtualizarPrazosAcoes",
  "App/Commands/mtn/AtualizaPrazosQuestionario",
  "App/Commands/mtn/RenotificarAusente",
  "App/Commands/mtn/ValidarResposta",
  "App/Commands/encantar/NotificarFluxoAprovacao",
  "App/Commands/encantar/NotificarResponsaveisBrinde",
  "App/Commands/ordemserv/RotinaVerificacaoNoturna",
  "App/Commands/desigint/EnviarEmailDeAcordo",
  "App/Commands/desigint/CancelarDeAcordoVencido",
  "App/Commands/DispararEmailsFilaGlobal",
  "App/Commands/RemoverAcessos"
];

module.exports = { providers, aceProviders, aliases, commands };
