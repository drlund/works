"use strict";

/** @type {import('@adonisjs/framework/src/Server')} */
const Server = use("Server");

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
  "Adonis/Middleware/BodyParser",
  "App/Middleware/Commons/ConvertEmptyStringsToNull",
  "Adonis/Middleware/Session",
  "App/Middleware/Commons/AllParams",
];

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('auth')
|
*/
/**
 * ================ ATENÇÃO !!! ==========================
 *  - Incluir o arquivo com as entradas em um arquivo separado por ferramenta.
 *  - Verificar se as suas entradas não conflitam com os nomes das entradas das ferramentas já inclusas,
 *    pois o Adonis usa a primeira referencia ao nome do middleware encontrada.
 *  - É aconselhável terminar o nome do middleware com um sufixo que represente a sua ferramenta, ex:
 *    isUserDemandas ou podeAcessarElogios
 * ================ ATENÇÃO !!! ==========================
 */
const namedMiddleware = {
  //desabilitando middlewares padroes do adonis
  // auth: 'Adonis/Middleware/Auth',
  // guest: 'Adonis/Middleware/AllowGuestOnly',

  //Commons - Middlewares genericos comuns a todas as aplicacoes
  ...require("./NamedMiddlewares/Commons"),

  //Acessos
  ...require("./NamedMiddlewares/Acessos"),

  //Elogios
  ...require("./NamedMiddlewares/Elogios"),

  //Demandas
  ...require("./NamedMiddlewares/Demandas"),

  //CtrlDisciplinar
  ...require("./NamedMiddlewares/CtrlDisciplinar"),

  //MTN
  ...require("./NamedMiddlewares/Mtn"),

  //OrdemServ
  ...require("./NamedMiddlewares/OrdemServ"),

  //Bacen Procedentes
  ...require("./NamedMiddlewares/BacenProcedentes"),

  //Patrocínios
  ...require("./NamedMiddlewares/Patrocinios"),

  //Autoridades Secex
  ...require("./NamedMiddlewares/AutoridadesSecex"),

  //Encantar
  ...require("./NamedMiddlewares/Encantar"),

  //Tarifas
  ...require("./NamedMiddlewares/Tarifas"),

  //Procuracoes
  ...require("./NamedMiddlewares/Procuracoes"),
};

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server level middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = ["Adonis/Middleware/Static", "Adonis/Middleware/Cors"];

Server.registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .use(serverMiddleware);
