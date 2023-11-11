"use strict"

class Analise {
  transformGetResultadoAnalise(analise) {
    return {
      analise: JSON.parse(analise.analise),
      negativas: JSON.parse(analise.negativas)
    };
  }
}

module.exports = Analise;
