/**
 * @param {import('..').Pesquisa} outorgado
 * @returns {outorgado is import('..').PesquisaError}
 */
export function isFunciError(outorgado) {
  return Boolean( /** @type {import('..').PesquisaError} */(outorgado).error);
}
