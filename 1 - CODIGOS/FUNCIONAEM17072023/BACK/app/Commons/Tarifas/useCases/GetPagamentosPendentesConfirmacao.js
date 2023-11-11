"use strict";

const ReservaRepository = use(
  "App/Commons/Tarifas/repositories/ReservaRepository"
);

const PagamentosRepository = use(
  "App/Commons/Tarifas/repositories/PagamentosRepository"
);

const UsuarioRepository = use(
  "App/Commons/Tarifas/repositories/UsuarioRepository"
);

class GetPagamentosPendentesConfirmacao {
  constructor(
    dadosUsuario,
    ReceivedReservaRepository = null,
    ReceivedUsuarioRepository = null,
    ReceivedPagamentoRepository = null
  ) {
    this.dadosUsuario = dadosUsuario;

    this.reservaRepository =
      ReceivedReservaRepository !== null
        ? new ReceivedReservaRepository()
        : new ReservaRepository();

    this.pagamentoRepository =
      ReceivedPagamentoRepository !== null
        ? new ReceivedPagamentoRepository()
        : new PagamentosRepository();

    this.usuarioRepository =
      ReceivedUsuarioRepository !== null
        ? new ReceivedUsuarioRepository()
        : new UsuarioRepository(dadosUsuario);
  }

  async run() {
    const prefixos =
      await this.usuarioRepository.getPrefixosAcessoConfirmarPgto();
    const pagamentos =
      await this.pagamentoRepository.getPagamentosPendentesConfirmacao(
        prefixos
      );

    return pagamentos;
  }
}

module.exports = GetPagamentosPendentesConfirmacao;
