"use strict";
const ReservaRepository = use(
  "App/Commons/Tarifas/repositories/ReservaRepository"
);
const OcorrenciaTarifaRepository = use(
  "App/Commons/Tarifas/repositories/OcorrenciaTarifaRepository"
);
const BaseUseCase = use("App/Commons/Tarifas/useCases/BaseUseCase");
const types = require("../Types.js");

const { ESPECIE, CONTA_CORRENTE } = use("App/Commons/Tarifas/constants");
const tiposPagamento = [ESPECIE, CONTA_CORRENTE];
const CAMPOS_OBRIGATORIOS_CONTA_CORRENTE = ["agencia", "conta", "nrBanco"];

class ReservarOcorrencia extends BaseUseCase {
  constructor(
    reserva,
    usuarioLogado,
    ReceivedReservaRepository = null,
    ReceivedOcorrenciaRepository = null
  ) {
    super();
    this.reservaRepository =
      ReceivedReservaRepository === null
        ? new ReservaRepository(reserva, usuarioLogado)
        : new ReceivedReservaRepository(reserva, usuarioLogado);

    this.ocorrenciaRepository =
      ReceivedOcorrenciaRepository === null
        ? new OcorrenciaTarifaRepository()
        : new ReceivedOcorrenciaRepository();

    this.reserva = reserva;
    this.usuarioLogado = usuarioLogado;
    this.isDadosValidados = false;
  }

  async run() {
    if (!this.isDadosValidados) {
      await this.validarDadosReserva();
    }

    await this.reservaRepository.salvarReserva(
      { ...this.reserva, ativa: true },
      this.usuarioLogado
    );
  }

  async validarDadosReserva() {
    if (!this.reserva) {
      throw { message: "Dados da reserva não informados" };
    }

    if (
      !this.reserva.contatos ||
      !Array.isArray(this.reserva.contatos) ||
      this.reserva.contatos.length === 0
    ) {
      throw { message: "Contatos não informados" };
    }

    if (!this.reserva.idOcorrencia || !parseInt(this.reserva.idOcorrencia)) {
      throw {
        message: "Id da ocorrência não informado ou no formato inválido",
      };
    }

    if (!tiposPagamento.includes(this.reserva.dadosPagamento.tipoPagamento)) {
      throw {
        message: `Tipo de pagamento ${this.reserva.tipoPagamento} inválido`,
      };
    }

    const existeOcorrencia = await this._existeOcorrencia();
    if (!existeOcorrencia) {
      throw {
        message: `Ocorrência ${this.reserva.idOcorrencia} não encontrada`,
      };
    }

    const isOcorrenciaJaReservada = await this._isOcorrenciaReservada(
      this.reserva.idOcorrencia
    );
    if (isOcorrenciaJaReservada) {
      throw { message: `Ocorrência ${this.reserva.idOcorrencia} já reservada` };
    }

    if (this.reserva.dadosPagamento.tipoPagamento === CONTA_CORRENTE) {
      const camposObrigatoriosPagamento = CAMPOS_OBRIGATORIOS_CONTA_CORRENTE;
      for (const campo of camposObrigatoriosPagamento) {
        if (!this.reserva.dadosPagamento[campo]) {
          throw {
            message: `Campo ${camposObrigatoriosPagamento} é obrigatório!`,
          };
        }
      }
    }

    this.dadosValidados = true;
  }

  async _isOcorrenciaReservada() {
    const reservaAtiva = await this.reservaRepository.getReservaAtiva(
      this.reserva.idOcorrencia
    );

    return reservaAtiva ? true : false;
  }

  async _existeOcorrencia() {
    const existeOcorrencia = await this.ocorrenciaRepository.existeOcorrencia(
      this.reserva.idOcorrencia
    );

    return existeOcorrencia;
  }
}

module.exports = ReservarOcorrencia;
