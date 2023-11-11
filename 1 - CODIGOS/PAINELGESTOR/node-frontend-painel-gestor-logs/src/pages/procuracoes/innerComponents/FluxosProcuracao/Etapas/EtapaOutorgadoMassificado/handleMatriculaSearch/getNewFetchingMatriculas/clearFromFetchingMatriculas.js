/**
 * @typedef {React.Dispatch<React.SetStateAction<Procuracoes.DadosProcuracao['outorgadoMassificado']>>} setListas
 */

/**
 * @param {setListas} setListas
 * @param {string} randomKey
 * no finally remove a entrada do fetching
 */
export function clearFromFetchingMatriculas(setListas, randomKey) {
  setListas((l) => {
    Reflect.deleteProperty(l.fetchingMatriculas, randomKey);

    return ({
      ...l,
      fetchingMatriculas: l.fetchingMatriculas,
    });
  });
}
