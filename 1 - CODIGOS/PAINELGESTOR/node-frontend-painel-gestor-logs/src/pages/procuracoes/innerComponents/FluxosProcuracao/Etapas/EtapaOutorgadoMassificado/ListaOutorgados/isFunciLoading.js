/**
 * @param {import('.').FunciListaOutorgados} outorgado
 * @returns {outorgado is import('.').FunciLoading}
 */
export function isFunciLoading(outorgado) {
  return Boolean(/** @type {import('.').FunciLoading} */(outorgado).loading);
}
