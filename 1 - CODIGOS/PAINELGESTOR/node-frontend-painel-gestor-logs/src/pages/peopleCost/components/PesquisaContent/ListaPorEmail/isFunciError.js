/**
 * @param {PeopleCost.Pesquisa} funci
 * @returns {funci is PeopleCost.PesquisaError}
 */
export function isFunciError(funci) {
  return Boolean( /** @type {PeopleCost.PesquisaError} */(funci).error);
}
