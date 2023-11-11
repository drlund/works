"use strict";

const BaseUseCase = use("App/Commons/Tarifas/useCases/BaseUseCase");
const moment = require("moment");

const PagamentoReservaRepository = use(
  "App/Commons/Tarifas/repositories/PagamentosRepository"
);
const OcorrenciaTarifaRepository = use(
  "App/Commons/Tarifas/repositories/OcorrenciaTarifaRepository"
);

class RegistrarPagamento extends BaseUseCase {
  constructor(
    pagamento,
    usuarioLogado,
    ReceivedPagamentoRepository = null,
    ReceivedOcorrenciaRepository = null,
    ReceivedAnexosRepository = null
  ) {
    super();

    this.pagamentoRepository =
      ReceivedPagamentoRepository === null
        ? new PagamentoReservaRepository()
        : new ReceivedPagamentoRepository();

    this.ocorrenciaRepository = ReceivedOcorrenciaRepository
      ? new ReceivedOcorrenciaRepository()
      : new OcorrenciaTarifaRepository();
      
    //Validar dados reserva

    this.pagamento = pagamento;
    this.usuarioLogado = usuarioLogado;

    this.isDadosValidados = false;
  }

  async validarDados() {
    const isPagamentoRegistrado =
      await this.pagamentoRepository.isPagamentoRegistrado(
        this.pagamento.idOcorrencia
      );

    if (!this.pagamento.anexos) {
      throw {
        message: "Deve ser incluído pelo menos um comprovante de pagamento.",
      };
    }

    if (!this.pagamento.dataPagamento) {
      throw { message: "A data de pagamento é obrigatória" };
    }

    const dataPagamento = moment(this.pagamento.dataPagamento);
    if (!dataPagamento.isValid()) {
      throw { message: "A data de pagamento é inválida" };
    }

    if (
      dataPagamento.format("YYYY-MM-DD") !== moment().format("YYYY-MM-DD") &&
      (!this.pagamento.observacoes || this.pagamento.observacoes === "")
    ) {
      throw {
        message:
          "Quando a data de pagamento não for a data atual, a observação é obrigatória ",
      };
    }

    if (isPagamentoRegistrado) {
      throw { message: "O pagamento para essa ocorrência já foi registrado." };
    }

    this.dadosValidados = true;
  }

  async run() {
    if (!this.isDadosValidados) {
      await this.validarDados();
    }

    await this.pagamentoRepository.registrarPagamento(
      { ...this.pagamento },
      this.usuarioLogado
    );
  }
}

module.exports = RegistrarPagamento;
