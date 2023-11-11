'use strict'

const _ = require('lodash');

const exception = use('App/Exceptions/Handler');

// CASO DE USO GUARDA CENTRALIZADA
function GuardaCentralizada(indicadores, dadosIndicadores) {
  const [guarda] = indicadores.filter(item => item.id === 7);
  const [dadoGuarda] = dadosIndicadores.filter(item => item.idIndicador === 7);

  const formuls = guarda.formula;
  const flags = guarda.flags;
  const variaveis = dadoGuarda.variaveis;

  const formulas = [];

  formuls.forEach(formula => {
    formulas.push({
      [formula]: eval(formula)
    })
  })

  const bandeiras = [];

  _.map(flags, (valor, chave, cor) => {
    bandeiras.push({
      [chave]: eval(valor)
    })
    return cor;
  })

  const bandeira = bandeiras.filter(band => {
    const [valor] = Object.values(band);
    return valor;
  }).map(band => {
    const [chave] = Object.keys(band);
    return chave;
  });

  const dadosRetorno = { formulas, bandeira, variaveis };

  return dadosRetorno;
}

function prefixoAcesso() {

}

module.exports = {
  GuardaCentralizada,
  prefixoAcesso
};