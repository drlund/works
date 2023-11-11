"use strict";

const OcorrenciaTarifaRepository = use(
  "App/Commons/Tarifas/repositories/OcorrenciaTarifaRepository"
);
const UsuarioRepository = use(
  "App/Commons/Tarifas/repositories/UsuarioRepository"
);

const PagamentoReservaRepository = use(
  "App/Commons/Tarifas/repositories/PagamentosRepository"
);
const { ESPECIE } = use("App/Commons/Tarifas/constants");

class PodePagarEspecie {
  constructor(
    idOcorrencia,
    dadosUsuario,
    ReceivedOcorrenciaTarifaRepository = null,
    ReceivedUsuarioRepository = null,
    ReceivedPagamentoRepository = null
  ) {
    this.idOcorrencia = idOcorrencia;
    this.dadosUsuario = dadosUsuario;

    this.usuarioRepository = ReceivedUsuarioRepository
      ? new ReceivedUsuarioRepository()
      : new UsuarioRepository(dadosUsuario);

    this.ocorrenciaRepository = ReceivedOcorrenciaTarifaRepository
      ? new ReceivedOcorrenciaTarifaRepository()
      : new OcorrenciaTarifaRepository();

    this.pagamentoRepository = ReceivedPagamentoRepository
      ? new ReceivedPagamentoRepository()
      : new PagamentoReservaRepository();
  }

  async run() {
    const ocorrencia = await this.ocorrenciaRepository.getOneOcorrencia(
      this.idOcorrencia
    );

    if (!ocorrencia) {
      return false;
    }

    if (!ocorrencia.isOcorrenciaReservada) {
      return false;
    }

    const reserva = ocorrencia.reservas[0];
    if (reserva.tipoPagamento !== ESPECIE) {
      return false;
    }

    const prefixosComAcessoParaPagamento =
      await this.pagamentoRepository.getPrefixosComAcessoParaPagamento(
        this.dadosUsuario.prefixo
      );
    if (
      prefixosComAcessoParaPagamento.length === 0 ||
      !prefixosComAcessoParaPagamento.includes(reserva.prefixoDepFunciReserva)
    ) {
      return false;
    }

    return true;
  }
}

module.exports = PodePagarEspecie;
