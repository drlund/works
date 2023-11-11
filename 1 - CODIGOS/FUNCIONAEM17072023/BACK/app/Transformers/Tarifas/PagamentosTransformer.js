"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const { fromDB } = use("App/Commons/MoedaUtils");

/**
 * OcorrenciasTransformer class
 *
 * @class OcorrenciasTransformer
 * @constructor
 */

class PagamentosTransformer extends BumblebeeTransformer {
  transformPendentesConfirmacaoPgto(model) {
    const { dadosCliente } = model.ocorrencia;
    return {
      idOcorrencia: model.ocorrencia.id,
      matriculaFunciPagamento: model.matriculaFunciPagamento,
      nomeFunciPagamento: model.nomeFunciPagamento,
      nomeDepFunciPagamento: model.nomeDepFunciPagamento,
      prefixoDepFunciPagamento: model.prefixoDepFunciPagamento,
      dataRegistroPgto: model.createdAt,
      valor: model.ocorrencia.vlrAtual,
      dadosCliente: {
        mci: dadosCliente.mci ? dadosCliente.mci : "Não disponível",
        cpfCnpj: dadosCliente.cpf_cnpj
          ? dadosCliente.cpf_cnpj
          : "Não disponível",
        nome: dadosCliente.nome ? dadosCliente.nome : "Nâo disponível",
      },
    };
  }

  transform(model) {
    return model;
  }
}

module.exports = PagamentosTransformer;
