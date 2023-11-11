"use strict";
const { AbstractUserCase } = require('../../AbstractUserCase');

class UCLikesEpisodio extends AbstractUserCase {
  constructor({ repository }) {
    super({repository});
    this._config({usePayload: false, useChecks: false})
  }

  async _action() {
    const likesEpisodios = await this.repository.getLikesEpisodios()
    return likesEpisodios
  }
}

module.exports = UCLikesEpisodio;