"use strict";

const { Command } = require("@adonisjs/ace");

/** @type {typeof import("../Commons/Emails/ColetorGlobal")} */
const ColetorGlobal = use("App/Commons/Emails/ColetorGlobal");
/** @type {typeof import("../Commons/Emails/DisparadorEmails")} */
const DisparadorEmails = use("App/Commons/Emails/DisparadorEmails");
const Database = use("Database");

class DispararEmailsFilaGlobal extends Command {
  
  static get signature() {
    return "emails:disparar-fila-global";
  }

  static get description() {
    return "Envia os emails na fila global";
  }

  async handle(args, options) {

    const coletorGlobal = new ColetorGlobal();
    await coletorGlobal.run();      
    const disparadorEmails = new DisparadorEmails(coletorGlobal);
    await disparadorEmails.dispararEmails();
    Database.close();
    process.exit();
  }
}

module.exports = DispararEmailsFilaGlobal;
