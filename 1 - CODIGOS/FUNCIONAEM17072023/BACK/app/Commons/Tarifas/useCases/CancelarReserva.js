"use strict";

const ReservaRepository = use(
  "App/Commons/Tarifas/repositories/ReservaRepository"
);

class CancelarReserva {
  constructor(
    idReserva,
    dadosUsuario,
    observacao,
    ReceivedReservaRepository = null
  ) {
    this.idReserva = idReserva;
    this.dadosUsuario = dadosUsuario;
    this.observacao = observacao;

    this.reservaRepository =
      ReceivedReservaRepository === null
        ? new ReservaRepository()
        : new ReceivedReservaRepository();
  }

  async run() {
    await this.reservaRepository.cancelarReserva(
      this.idReserva,
      this.observacao,
      this.dadosUsuario
    );
  }
}

module.exports = CancelarReserva;
