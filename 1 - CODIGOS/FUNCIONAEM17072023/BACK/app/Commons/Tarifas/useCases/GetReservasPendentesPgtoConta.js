"use strict";

const BaseUseCase = use("App/Commons/Tarifas/useCases/BaseUseCase");

const ReservaRepository = use(
  "App/Commons/Tarifas/repositories/ReservaRepository"
);

const PagamentosRepository = use(
  "App/Commons/Tarifas/repositories/PagamentosRepository"
);

const UsuarioRepository = use(
  "App/Commons/Tarifas/repositories/UsuarioRepository"
);

class GetReservasPendentesPgtoConta extends BaseUseCase {
  constructor(
    usuarioLogado,
    ReceivedReservasRepository = null,
    ReceivedPagamentoRepository = null,
    ReceivedUsuarioRepository = null
  ) {
    super();

    this.usuarioLogado = usuarioLogado;

    this.reservasRepository = ReceivedReservasRepository
      ? new ReceivedReservasRepository()
      : new ReservaRepository();

    this.pagamentosRepository = ReceivedPagamentoRepository
      ? new ReceivedPagamentoRepository()
      : new PagamentosRepository();

    this.usuarioRepository = ReceivedUsuarioRepository
      ? new ReceivedUsuarioRepository()
      : new UsuarioRepository(usuarioLogado);

    this.validados = false;
  }

  async validar() {
    const podePagarEmConta =
      await this.usuarioRepository.possuiPermissaoPgtoConta();

    if (!podePagarEmConta) {
      throw { message: "Usuário sem acesso a registrar pagamento em conta corrente." };
    }

    this.podePagarConta = true;
  }

  async run() {
    if (!this.validados) {
      await this.validar();
    }
    const reservas = await this.reservasRepository.pendentesPagamentoConta();
    return reservas;
  }
}

module.exports = GetReservasPendentesPgtoConta;
