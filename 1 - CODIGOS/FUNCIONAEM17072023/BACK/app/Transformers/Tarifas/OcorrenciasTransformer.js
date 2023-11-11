"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const { fromDB } = use("App/Commons/MoedaUtils");
const LinhaTempoTransformer = use(
  "App/Transformers/Tarifas/LinhaTempoTransformer"
);

class OcorrenciasTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return ["linhaTempo"];
  }

  includeLinhaTempo(model) {
    return this.collection(model.linhaTempo, LinhaTempoTransformer);
  }

  transformOneOcorrencia(model) {
    return {
      id: model.id,
      mci: model.mci,
      cpf_cnpj: model.cpf_cnpj,
      nomeCliente: model.dadosCliente
        ? model.dadosCliente.nome
        : "Não disponível",
      vlrDebito: `R$ ${fromDB(model.vlrDebito)}`,
      vlrAtual: `R$ ${fromDB(model.vlrAtual)}`,
      dadosCliente: model.dadosCliente,
      pagamento:
        model.pagamentos &&
        Array.isArray(model.pagamentos) &&
        model.pagamentos.length > 0
          ? model.pagamentos[0]
          : null,
      reserva:
        model.reservas &&
        Array.isArray(model.reservas) &&
        model.reservas.length > 0
          ? model.reservas[0]
          : null,
    };
  }

  transform(model) {
    return {
      id: model.id,
      mci: model.mci,
      status:
        (model.status === null || !model.status) ? "Pendente Reserva" : model.status.status.nome,
      nomeCliente: model.dadosCliente
        ? model.dadosCliente.nome
        : "Não disponível",
      vlrDebito: `R$ ${fromDB(model.vlrDebito)}`,
      vlrAtual: `R$ ${fromDB(model.vlrAtual)}`,
    };
  }
}

module.exports = OcorrenciasTransformer;
