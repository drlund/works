"use strict";

const PagamentoReservaRepository = use(
  "App/Commons/Tarifas/repositories/PagamentosRepository"
);

const UsuarioRepository = use(
  "App/Commons/Tarifas/repositories/UsuarioRepository"
);

class ChecaPodeConfirmarPgto {
  constructor(
    idPagamento,
    dadosUsuario,
    ReceivedPagamentoRepository = null,
    ReceivedUsuarioRepository = null
  ) {
    this.idPagamento = idPagamento;
    this.dadosUsuario = dadosUsuario;
    this.pagamentoRepository =
      ReceivedPagamentoRepository !== null
        ? new ReceivedPagamentoRepository()
        : new PagamentoReservaRepository();
    this.usuarioRepository =
      ReceivedUsuarioRepository !== null
        ? new ReceivedUsuarioRepository()
        : new UsuarioRepository(dadosUsuario);
  }
  async run() {
    const prefixos =
      await this.usuarioRepository.getPrefixosAcessoConfirmarPgto();

    const pagamento = await this.pagamentoRepository.getOnePagamento(
      this.idPagamento
    );

    return prefixos.includes(pagamento.prefixoDepFunciPagamento);
  }
}

module.exports = ChecaPodeConfirmarPgto;
