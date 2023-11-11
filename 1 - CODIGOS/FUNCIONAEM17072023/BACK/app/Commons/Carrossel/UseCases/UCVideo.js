"use strict";

const { AbstractUserCase } = require('../../AbstractUserCase');

class UCVideo extends AbstractUserCase {
  constructor({ repository }) {
    super({ repository });
    this._config({ usePayload: false, useChecks: false });
  }

  async _action() {
    const video = await this.repository.getVideo();

    if (video) {
      return video;
    }

    const videoFallback = await this.repository.getVideoFallback();

    if (!videoFallback) {
      return this._throwExpectedError('Não existem videos', 404);
    }

    return videoFallback;
  }
}
module.exports = UCVideo;


