/**
 * @param {import('.').FunciListaOutorgados} outorgado
 * @returns {outorgado is Procuracoes.FunciError}
 */
export function isFunciError(outorgado) {
  return Boolean( /** @type {Procuracoes.FunciError} */(outorgado).error);
}
