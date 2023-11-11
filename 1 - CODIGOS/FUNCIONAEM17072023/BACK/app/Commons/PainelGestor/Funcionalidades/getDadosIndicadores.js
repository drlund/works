const exception = use('App/Exceptions/Handler');

const INDICADORES = use('App/Commons/PainelGestor/Mock/indicadores.json');
const PRIORIZADOS = use('App/Commons/PainelGestor/Mock/priorizados.json');
const DADOSINDICADORES = use('App/Commons/PainelGestor/Mock/dadosIndicadores.json');

function getDadosIndicadores () {
  // consulta o getIndicadores
  const indicadores = INDICADORES;

  // consulta o getPriorizados
  const priorizados = PRIORIZADOS.map(item => item.idIndicador);

  // solicitar os dados mais recentes dos indicadores
  const dadosIndicadores = DADOSINDICADORES;

  // mapear os indicadores para seu caso de uso automaticamente
  const indicatorData = indicadores.map(item => {
    item.priorizado = priorizados.includes(item.id);
    item.dados = dadosIndicadores.filter(itemDado => itemDado.idIndicador === item.id);

    return item;
  });

  // retornar os dados de cada indicador como array
  return indicatorData;
}

module.exports = getDadosIndicadores;