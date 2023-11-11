"use strict"
const _ = require('lodash');

class TiposHistorico {
  transformOptionsInstancias(tiposHistoricos) {
    return tiposHistoricos
      .filter((elem) => !_.isNil(elem.local))
      .map((elem) => ({ id: elem.id, local: elem.local }));
  }
}

module.exports = TiposHistorico;
