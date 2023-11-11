"use strict";

const { Command } = require("@adonisjs/ace");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const respondidaModel = use("App/Models/Postgres/MtnRespondidas");
const Database = use('Database');
const md5 = require("md5");

class ValidarResposta extends Command {
  static get signature() {
    return "mtn:validarResposta {idForm: Id do formulario}";
  }

  static get description() {
    return "Tell something helpful about this command";
  }

  async handle(args, options) {
    this.info(`Validando idForm: ${args.idForm}`);
    const respondidos = await respondidaModel
      .query()
      .where("id_form", args.idForm)
      .fetch();
    for (const respondido of respondidos.toJSON()) {
      const testeHash = md5(
        respondido.id_resposta +
          respondido.id_pergunta +
          respondido.resposta +
          respondido.id_form
      );

      if(respondido.hash === testeHash){
        this.info(`IdPergunta ${respondido.id_pergunta} | IdResposta ${respondido.id_resposta} validado `)
      }else{
        this.error(`IdPergunta ${respondido.id_pergunta} | IdResposta ${respondido.id_resposta} com erro `);
      }
    }

    Database.close();
    process.exit(0);
  }

}

module.exports = ValidarResposta;
