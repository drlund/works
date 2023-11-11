"use strict";
const ReservaRepository = use(
  "App/Commons/Tarifas/repositories/ReservaRepository"
);

const UsuarioRepository = use(
  "App/Commons/Tarifas/repositories/UsuarioRepository"
);

class GetReservasFinalizadas {
  constructor(
    dadosUsuario,
    ReceivedReservasRepository = null,
    ReceivedUsuarioRepository = null
  ) {
    this.dadosUsuario = dadosUsuario;
    this.reservasRepository = ReceivedReservasRepository
      ? new ReceivedReservasRepository()
      : new ReservaRepository();

    this.usuarioRepository =
      ReceivedUsuarioRepository !== null
        ? new ReceivedUsuarioRepository()
        : new UsuarioRepository(dadosUsuario);
  }

  async run() {
    const prefixos =
      await this.usuarioRepository.getPrefixosAcessoConfirmarPgto();
    const permissao = await this.usuarioRepository.possuiPermissaoPgtoConta();
    const isAdmin = await this.usuarioRepository.isAdminTarifas();
    const reservas = await this.reservasRepository.getReservasFinalizadas(
      prefixos,
      permissao,
      isAdmin
    );

    return reservas;
  }
}

module.exports = GetReservasFinalizadas;
