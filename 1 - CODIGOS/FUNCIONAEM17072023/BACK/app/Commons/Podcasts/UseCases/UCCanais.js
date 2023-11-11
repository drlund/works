"use strict";
const { AbstractUserCase } = require('../../AbstractUserCase');

class UCCanais extends AbstractUserCase {
  constructor({ repository }) {
    super({ repository });
    this._config({ useChecks: false, usePayload: false });
  }

  async _action() {
    const listaCanais = await this.repository.getCanais();

    if (!listaCanais || (Array.isArray(listaCanais) && listaCanais.length === 0)) {
      this._throwExpectedError("Nenhum canal encontrado", 404);
    }
    const listaCanalComTotais = listaCanais.map((canal) => {
      return Promise.all([
        this.repository.countEpisodiosCanal(canal.id),
        this.repository.countSeguidoresCanal(canal.id)
      ]).then(([episodios, seguidores]) => {
        canal.totalEpisodios = episodios;
        canal.totalSeguidores = seguidores;

        return canal;
      });
    });
    return Promise.all(listaCanalComTotais);

  }
}
module.exports = UCCanais;
