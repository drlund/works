"use strict";

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use("Env");
const moment = use("App/Commons/MomentZoneBR");

//const loggerDriver = process.env.NODE_ENV === 'production' ? 'logmongodb' : 'file'
const loggerDriver = "file";
const mongodbURI = Env.get("MONGODB_URL_HOST");

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Application Name
  |--------------------------------------------------------------------------
  |
  | This value is the name of your application and can used when you
  | need to place the application's name in a email, view or
  | other location.
  |
  */

  name: Env.get("APP_NAME", "AdonisJs"),

  /*
  |--------------------------------------------------------------------------
  | App Key
  |--------------------------------------------------------------------------
  |
  | App key is a randomly generated 16 or 32 characters long string required
  | to encrypt cookies, sessions and other sensitive data.
  |
  */
  appKey: Env.getOrFail("APP_KEY"),

  http: {
    /*
    |--------------------------------------------------------------------------
    | Allow Method Spoofing
    |--------------------------------------------------------------------------
    |
    | Method spoofing allows to make requests by spoofing the http verb.
    | Which means you can make a GET request but instruct the server to
    | treat as a POST or PUT request. If you want this feature, set the
    | below value to true.
    |
    */
    allowMethodSpoofing: true,

    /*
    |--------------------------------------------------------------------------
    | Trust Proxy
    |--------------------------------------------------------------------------
    |
    | Trust proxy defines whether X-Forwarded-* headers should be trusted or not.
    | When your application is behind a proxy server like nginx, these values
    | are set automatically and should be trusted. Apart from setting it
    | to true or false Adonis supports handful or ways to allow proxy
    | values. Read documentation for that.
    |
    */
    trustProxy: false,

    /*
    |--------------------------------------------------------------------------
    | Subdomains
    |--------------------------------------------------------------------------
    |
    | Offset to be used for returning subdomains for a given request.For
    | majority of applications it will be 2, until you have nested
    | sudomains.
    | cheatsheet.adonisjs.com      - offset - 2
    | virk.cheatsheet.adonisjs.com - offset - 3
    |
    */
    subdomainOffset: 2,

    /*
    |--------------------------------------------------------------------------
    | JSONP Callback
    |--------------------------------------------------------------------------
    |
    | Default jsonp callback to be used when callback query string is missing
    | in request url.
    |
    */
    jsonpCallback: "callback",

    /*
    |--------------------------------------------------------------------------
    | Etag
    |--------------------------------------------------------------------------
    |
    | Set etag on all HTTP response. In order to disable for selected routes,
    | you can call the `response.send` with an options object as follows.
    |
    | response.send('Hello', { ignoreEtag: true })
    |
    */
    etag: false,
  },

  views: {
    /*
    |--------------------------------------------------------------------------
    | Cache Views
    |--------------------------------------------------------------------------
    |
    | Define whether or not to cache the compiled view. Set it to true in
    | production to optimize view loading time.
    |
    */
    cache: Env.get("CACHE_VIEWS", true),
  },

  static: {
    /*
    |--------------------------------------------------------------------------
    | Dot Files
    |--------------------------------------------------------------------------
    |
    | Define how to treat dot files when trying to server static resources.
    | By default it is set to ignore, which will pretend that dotfiles
    | does not exists.
    |
    | Can be one of the following
    | ignore, deny, allow
    |
    */
    dotfiles: "ignore",

    /*
    |--------------------------------------------------------------------------
    | ETag
    |--------------------------------------------------------------------------
    |
    | Enable or disable etag generation
    |
    */
    etag: true,

    /*
    |--------------------------------------------------------------------------
    | Extensions
    |--------------------------------------------------------------------------
    |
    | Set file extension fallbacks. When set, if a file is not found, the given
    | extensions will be added to the file name and search for. The first
    | that exists will be served. Example: ['html', 'htm'].
    |
    */
    extensions: false,
  },

  locales: {
    /*
    |--------------------------------------------------------------------------
    | Loader
    |--------------------------------------------------------------------------
    |
    | The loader to be used for fetching and updating locales. Below is the
    | list of available options.
    |
    | file, database
    |
    */
    loader: "file",

    /*
    |--------------------------------------------------------------------------
    | Default Locale
    |--------------------------------------------------------------------------
    |
    | Default locale to be used by Antl provider. You can always switch drivers
    | in runtime or use the official Antl middleware to detect the driver
    | based on HTTP headers/query string.
    |
    */
    locale: "en",
  },

  logger: {
    /*
    |--------------------------------------------------------------------------
    | Transport
    |--------------------------------------------------------------------------
    |
    | Transport to be used for logging messages. You can have multiple
    | transports using same driver.
    |
    | Available drivers are: `file` and `console`.pE
    |
    */
    transport: "console",

    console: {
      driver: loggerDriver,
      //a collection sera criada automaticamente no mongodb - database: adonis-logs
      collection: "errors",
      uri: mongodbURI,
      name: "console",
      level: "info",
    },

    file: {
      driver: loggerDriver,
      uri: mongodbURI,
      //a collection sera criada automaticamente no mongodb - database: adonis-logs
      collection: "errors",
      name: "file",
      filename: `adonis-${moment().format("DD-MM-YYYY")}.json`,
      level: "error",
    },

    http_errors: {
      driver: loggerDriver,
      uri: mongodbURI,
      //a collection sera criada automaticamente no mongodb - database: adonis-logs
      collection: "http_errors",
      name: "http_errors",
      filename: `http_errors-${moment().format("DD-MM-YYYY")}.log`,
      level: "error",
    },

    validation_errors: {
      driver: loggerDriver,
      uri: mongodbURI,
      //a collection sera criada automaticamente no mongodb - database: adonis-logs
      collection: "validation_errors",
      name: "validation_errors",
      filename: `validation_errors.json`,
      level: "error",
    },

    mail_errors: {
      driver: loggerDriver,
      uri: mongodbURI,
      //a collection sera criada automaticamente no mongodb - database: adonis-logs
      collection: "mail_errors",
      name: "mail_errors",
      filename: `mail_errors-${moment().format("DD-MM-YYYY")}.json`,
      level: "error",
    },

    // =============== Comandos ===============

    // =============== MTN ===============

    mtnRenotificacoes: {
      //execucao a partir de comando ACE, escreve direto no arquivo
      driver: "file",
      name: "mtn-renotificacoes",
      filename: `mtn/mtn-renotificacoes-${moment().format("DD-MM-YYYY")}.json`,
      level: "info",
    },

    mtnPrazos: {
      //execucao a partir de comando ACE, escreve direto no arquivo
      driver: "file",
      name: "mtn-prazos",
      filename: `mtn/mtn-prazos-${moment().format("DD-MM-YYYY")}.json`,
      level: "info",
    },

    questionarios: {
      //execucao a partir de comando ACE, escreve direto no arquivo
      driver: "file",
      name: "mtn-questionarios",
      filename: `mtn/mtn-questionarios-${moment().format("DD-MM-YYYY")}.json`,
      level: "info",
    },

    timelineVazia: {
      //execucao a partir de comando ACE, escreve direto no arquivo
      driver: "file",
      name: "mtn-timeline-vazia",
      filename: `mtn/timelineVazia-${moment().format("DD-MM-YYYY")}.json`,
      level: "info",
    },

    // =============== Ordens de Serviço ===============
    osRotinaNoturna: {
      //execucao a partir de comando ACE, escreve direto no arquivo
      driver: "file",
      name: "ordemserv-rotina-noturna",
      filename: `os-rotina-noturna-${moment().format("DD-MM-YYYY")}.json`,
      level: "info",
    },

    osRotinaNoturaParallel: {
      //execucao a partir de comando ACE, escreve direto no arquivo
      driver: "file",
      name: "ordemserv-rotina-noturna-parallel",
      filename: `os-rotina-noturna-parallel-${moment().format(
        "DD-MM-YYYY"
      )}.json`,
      level: "info",
    },

    // =============== Outros Logs ===============
    dateUtils: {
      //execucao a partir de comando ACE, escreve direto no arquivo
      driver: "file",
      name: "date-utils",
      filename: `date-utils-${moment().format("DD-MM-YYYY")}.json`,
      level: "info",
    },

    // =============== Gestão de Acessos ===============
    gestaoAcessos: {
      //execucao a partir de comando ACE, escreve direto no arquivo
      driver: "file",
      name: "gestao-acessos",
      filename: `gestao-acessos-${moment().format("DD-MM-YYYY")}.json`,
      level: "info",
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Generic Cookie Options
  |--------------------------------------------------------------------------
  |
  | The following cookie options are generic settings used by AdonisJs to create
  | cookies. However, some parts of the application like `sessions` can have
  | separate settings for cookies inside `config/session.js`.
  |
  */
  cookie: {
    httpOnly: true,
    sameSite: false,
    path: "/",
    maxAge: 7200,
  },
};
