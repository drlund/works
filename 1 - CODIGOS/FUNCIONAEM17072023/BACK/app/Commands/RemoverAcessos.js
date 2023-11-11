"use strict";

const { Command } = use("@adonisjs/ace");
const moment = use("moment");
const Database = use("Database");
const Logger = use("Logger");

const concessoesAcessosModel = use("App/Models/Mongo/ConcessoesAcessos");

const { REGEX_ACESSO, ESTADOS, MENSAGENS_LOG } = use("App/Commons/Acesso/Constants");
const { DATABASE_DATETIME_OUTPUT } = use("App/Commons/Designacao/Constants");
const { replaceVariable } = use("App/Commons/StringUtils");

const getListaRemocaoAutomatica = use("App/Commons/Acesso/getListaRemocaoAutomatica");


/**
 * Escreve uma mensagem no arquivo de transporte de saida definido.
 *
 * @param {*} message - texto da mensagem
 */
function LogInfoMessage(message = "") {
  const type = "info";
  const timestamp = moment().format("HH:mm:ss");
  Logger.level = type;
  Logger
    .transport("gestaoAcessos")
    .info(`{${type}; ${timestamp}; ${message}}`);
}

class RemoverAcessos extends Command {
  static get signature() {
    return "acessos:removerAcessos";
  }

  static get description() {
    return "Remove acessos fora do padrão e inativa acessos conforme filtros";
  }
  async handle(args, options) {
    /**
     * Localizar no mongo os documentos que:
     * * seja do tipo 'matrícula', baseado em regex,
     * * retorne data de validade menor que a data atual
     */

    // PRESCRITO: `{1} :: Acesso invalidado automaticamente por alcançar data de validade.`,
    const docsPrescritos = await concessoesAcessosModel
      .find(
        {
          "validade": { $lt: moment().startOf().toISOString() },
          "ativo": ESTADOS.ATIVO
        }
      );

    await concessoesAcessosModel
      .updateMany(
        {
          "validade": { $lt: moment().startOf().toISOString() },
          "ativo": ESTADOS.ATIVO
        },
        {
          $set: {
            ativo: ESTADOS.INATIVO
          },
          $push: {
            log: replaceVariable(MENSAGENS_LOG.PRESCRITO, [moment().format(DATABASE_DATETIME_OUTPUT)])
          }
        },
        {
          new: true,
          returnDocument: 'after'
        }
      );

    // Remover registros fora do padrão estabelecido.
    const foraDoPadrao = await concessoesAcessosModel.find({ 'identificador': { $nin: [...Object.values(REGEX_ACESSO)] } });
    await concessoesAcessosModel.deleteMany({ '_id': { $in: foraDoPadrao } });

    // ALT_PREFIXO: `{1} :: Acesso invalidado automaticamente por alteração de prefixo do funcionário.`,
    // N_LOCALIZADO: `{1} :: Acesso revogado automaticamente por: funcionário não localizado nas bases (FOT01)`

    const matriculas = await concessoesAcessosModel
      .find({ "identificador": { $regex: REGEX_ACESSO.MATRICULAS }, "ativo": ESTADOS.ATIVO });

    const [idsArh, idsMst] = await getListaRemocaoAutomatica(matriculas);

    const matriculasInvalidadas = await concessoesAcessosModel.find({ '_id': { $in: idsArh } });
    await concessoesAcessosModel.deleteMany({ '_id': { $in: idsArh } });

    const funcionariosMovimentados = await concessoesAcessosModel.find({ "_id": { $in: idsMst } });
    await concessoesAcessosModel
      .updateMany(
        {
          "_id": {
            $in: idsMst
          }
        },
        {
          $set: {
            ativo: ESTADOS.INATIVO
          },
          $push: {
            log: replaceVariable(MENSAGENS_LOG.ALT_PREFIXO, [moment().format(DATABASE_DATETIME_OUTPUT)])
          }
        },
        {
          new: true,
          returnDocument: 'after'
        }
      )

    LogInfoMessage(`Identificadores fora do padrão: ${foraDoPadrao.map((item) => item.identificador).toString()}`);
    LogInfoMessage(`Acessos Prescritos: ${docsPrescritos.map((item) => item.identificador).toString()}`);
    LogInfoMessage(`Matrículas Invalidadas: ${matriculasInvalidadas.map((item) => item.identificador).toString()}`);
    LogInfoMessage(`Funcionários Movimentados: ${funcionariosMovimentados.map((item) => item.identificador).toString()}`);

    Database.close();
    process.exit();
    return;
  }
}

module.exports = RemoverAcessos;
