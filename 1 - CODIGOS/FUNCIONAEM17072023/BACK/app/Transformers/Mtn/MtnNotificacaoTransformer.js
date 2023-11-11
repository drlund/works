"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const moment = use("App/Commons/MomentZone");
const { getDiasTrabalhados } = use("App/Commons/DateUtils");
/**
 * NotificacaoTransformer class
 *
 * @class NotificacaoTransformer
 * @constructor
 */

const prepareDate = (paramDate) => {
  if (paramDate === null || paramDate === "") {
    return 0;
  }

  let data = paramDate.substr(0, 10);
};


class NotificacaoTransformer extends BumblebeeTransformer {
  async transformListaNotificacoes(model) {
    return {
      id: model.id,
      email: model.email,
      sucesso: model.sucesso,
      tipo: model.tipo,
      criadoEm: model.created_at,
      filaEnvio: model.fila_envio,
      nrMtn: model.envolvido.mtn.nr_mtn,
      idMtn: model.envolvido.mtn.id,
      envolvido: {
        matricula: model.envolvido.matricula,
        nome: model.envolvido.nome_funci,
      },
    };
  }

  /**
   * This method is used to transform the data.
   */
  async transform(model) {
    //Caso em que é um esclarecimento
    if (model.matricula_solicitante) {
      const prazoTotal = model.prorrogado ? 10 : 5;
      return {
        titulo: model.txt_pedido,
        id: model.envolvido.id_mtn,
        solicitante: "Super ADM",
        dataNotificacao: model.created_at,
        tipo: "esclarecimento",
        tipoDisplay: "Pedido de Esclarecimento",
        prazo: prazoTotal - model.qtd_dias_trabalhados,
      };

      //Caso em que é um questionario
    } else if (model.id_resposta) {
      let prazo = 0;
      if (model.ts_envio) {
        let arrayData = model.ts_envio.substr(0, 10).split("/");
        let dataCriacao = moment(
          `${arrayData[2]}-${arrayData[1]}-${arrayData[0]} 00:00`
        );
        prazo = dataCriacao.diff(moment(), "days");
      }

      //TODO Migrar o prazo para dias trabalhados
      return {
        id: model.id_resposta,
        titulo: model.form.titulo,
        solicitante: "Sistema",
        dataNotificacao: model.ts_envio ? model.ts_envio : "Não disponível",
        tipo: "questionario",
        tipoDisplay: "Questionário",
        prazo,
      };
    } else if (model.id_envolvido) {
      const prazoTotal = model.prorrogado ? 10 : 5;
      return {
        titulo: "Recurso",
        id: model.envolvido.id_mtn,
        solicitante: "Sistema",
        dataNotificacao: model.created_at,
        tipo: "recurso",
        tipoDisplay: "Recurso",
        prazo: prazoTotal - model.qtd_dias_trabalhados,
      };
    }
  }
}

module.exports = NotificacaoTransformer;
