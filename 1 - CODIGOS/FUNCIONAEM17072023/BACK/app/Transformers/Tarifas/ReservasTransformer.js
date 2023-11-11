"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const { fromDB } = use("App/Commons/MoedaUtils");

/**
 * OcorrenciasTransformer class
 *
 * @class OcorrenciasTransformer
 * @constructor
 */

class ReservasTransformer extends BumblebeeTransformer {
  transformPendentesEspecie(model) {
    const ocorrencia = model.ocorrencia;

    return {
      id: ocorrencia.id,
      mci: ocorrencia.mci,
      cpf_cnpj: ocorrencia.cpf_cnpj,
      nomeCliente: ocorrencia.dadosCliente
        ? ocorrencia.dadosCliente.nome
        : "Não disponível",
      valor: `R$ ${fromDB(ocorrencia.vlrAtual)}`,
      dataReserva: model.createdAt,
      funciReserva: `${model.matriculaFunciReserva} - ${model.nomeFunciReserva}`,
    };
  }

  transformFinalizadas(model) {
    const ocorrencia = model.ocorrencia;
    return {
      id: ocorrencia.id,
      mci: ocorrencia.mci,
      cpf_cnpj: ocorrencia.cpf_cnpj,
      nomeCliente: ocorrencia.dadosCliente
        ? ocorrencia.dadosCliente.nome
        : "Não disponível",
      valor: `R$ ${fromDB(ocorrencia.vlrAtual)}`,
      finalizadoEm: model.createdAt,
      funciReserva: `${model.matriculaFunciReserva} - ${model.nomeFunciReserva}`,
    };
  }

  transform(model) {
    return model;
  }
}

module.exports = ReservasTransformer;
