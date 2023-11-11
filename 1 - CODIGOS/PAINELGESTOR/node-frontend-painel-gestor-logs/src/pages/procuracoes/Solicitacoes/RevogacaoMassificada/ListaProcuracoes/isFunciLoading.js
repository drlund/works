/**
 * @param {import('..').Pesquisa} outorgado
 * @returns {outorgado is import('..').PesquisaLoading}
 */
export function isFunciLoading(outorgado) {
  return Boolean(/** @type {import('..').PesquisaLoading} */(outorgado).loading);
}
