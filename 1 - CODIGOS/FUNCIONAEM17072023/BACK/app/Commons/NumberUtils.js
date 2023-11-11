"use strict"

function round(numero, casas = 1) {
  Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
  };

  return Number(numero).round(casas);
}

module.exports = {
  round
};
