"use strict";

class MockingRepositoryReserva {
  salvarOcorrencia(reserva, usuarioLogado) {
    return new Promise((resolve, reject) => resolve());
  }
}

module.exports = MockingRepositoryReserva;
