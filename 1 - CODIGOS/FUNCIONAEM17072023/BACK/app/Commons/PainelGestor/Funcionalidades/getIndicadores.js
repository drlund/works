const exception = use('App/Exceptions/Handler');

const INDICADORES = use('App/Commons/PainelGestor/Mock/indicadores.json');

function getIndicadores () {
  // receber a informação do tipo do prefixo funcionário

  // solicitar os indicadores, filtrando os indicadores que o prefixo do funcionário pode acessar
  const indicadores = INDICADORES;

  // retornar os dados de cada indicador como array
  return indicadores;
}

module.exports = getIndicadores;