/**
 * @param {PeopleCost.Pesquisa} funci
 * @returns {funci is PeopleCost.PesquisaLoading}
 */
export function isFunciLoading(funci) {
  return Boolean(/** @type {PeopleCost.PesquisaLoading} */(funci).loading);
}
