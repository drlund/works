/**
 * @typedef {(value: React.SetStateAction<PeopleCost.ListaEmails>) => void} setListas
 */

/**
 * @param {setListas} setListas
 * @param {string} randomKey
 * no finally remove a entrada do fetching
 */
export function clearFromFetchingMatriculas(setListas, randomKey) {
  setListas((l) => {
    Reflect.deleteProperty(l.fetchingFuncis, randomKey);

    return ({
      ...l,
      fetchingFuncis: l.fetchingFuncis,
    });
  });
}
