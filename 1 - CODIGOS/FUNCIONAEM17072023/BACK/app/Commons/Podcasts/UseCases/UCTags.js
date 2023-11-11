"use strict";
const { AbstractUserCase } = require('../../AbstractUserCase');

class UCTags extends AbstractUserCase {
  constructor({ repository }) {
    super({ repository });
    this._config({ usePayload: false, useChecks: false });
  }

  async _action() {
    const listaTags = await this.repository.getTags();

    if (!listaTags || (Array.isArray(listaTags && listaTags.length === 0))) {
      this._throwExpectedError('Nenhuma tag encontrada', 404);
    }

    return listaTags;
  }
}
module.exports = UCTags;
