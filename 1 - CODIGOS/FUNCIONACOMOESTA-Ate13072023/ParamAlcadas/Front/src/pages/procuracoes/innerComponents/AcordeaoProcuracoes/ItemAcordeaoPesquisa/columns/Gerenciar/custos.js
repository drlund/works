// TODO: extrair este custo default para algum lugar
// onde eles possam customizar os valores
// hoje, esse custo, para as procurações vindas de
// subsidiarias, variam entre as procurações
// havendo um valor padrão para qualquer outra procuração


const subsidiarias = {
  BB: 'BB',
  Cartoes: 'Cartões',
  Consorcio: 'Consórcio',
};

/**
 * Por hora seria alterado aqui o id da subsidiaria / subsidiaria
 * @type {Record<number, string>}
 */
const idSubsidiariaTable = {
  1: subsidiarias.BB,
  2: subsidiarias.Consorcio,
  3: subsidiarias.Cartoes,
};


export function getCustoManifesto(/** @type {number} */ idSubsidiaria) {
  const custoBB = 18.54;
  const custoCartoes = 10.50;
  const custoConsorcio = 13.18;

  const custoDefault = 10.50;

  return {
    [subsidiarias.BB]: custoBB,
    [subsidiarias.Cartoes]: custoCartoes,
    [subsidiarias.Consorcio]: custoConsorcio,
  }[idSubsidiariaTable[Number(idSubsidiaria)]] ?? custoDefault;
}

export function getCustoCopia(/** @type {number|null} */ idSubsidiaria) {
  const custoBB = 16.23;
  const custoCartoes = 5.41;
  const custoConsorcio = 10.82;

  const custoDefault = 5.41;

  return {
    [subsidiarias.BB]: custoBB,
    [subsidiarias.Cartoes]: custoCartoes,
    [subsidiarias.Consorcio]: custoConsorcio,
  }[idSubsidiariaTable[Number(idSubsidiaria)]] ?? custoDefault;
}

/**
 * Retorna o id de subsidiaria apenas em procuração explodida.
 */
export function extractIdSubsidiaria(/** @type {Procuracoes.Procuracao} */ procuracaoOutorgado, /** @type {number} */ procuracaoId) {
  if (procuracaoOutorgado.procuracaoAgregada) {
    return null;
  }
  return procuracaoOutorgado.subsidiarias.find((s) => s.procuracaoId === procuracaoId)?.id;
}
