import cloneDeep from 'lodash.clonedeep';

/**
 * @param {Procuracoes.Poderes} props
 */
export function extractOutorgante({ outorgantes, outorganteSelecionado }) {
  /** @type {Procuracoes.Outorgante} */
  const outorgante = cloneDeep(outorgantes.find(
    (o) => o.idProcuracao === outorganteSelecionado.idProcuracao
      && o.idProxy === outorganteSelecionado.idProxy
  ));

  // filtra as subsidiarias que foram selecionadas
  const subsidiarias = outorgante.procuracao[0].subsidiarias
    .filter((s) => outorganteSelecionado.subsidiariasSelected.includes(s.id));

  const procuracao = {
    // pega primeira procuracao, que é do outorgante
    ...outorgante.procuracao[0],
    subsidiarias,
  };

  return {
    ...outorgante,
    procuracao,
    subsidiarias,
  };
}
