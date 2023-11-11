/**
 * @param {string[]} newMatriculas
 * @param {Procuracoes.DadosProcuracao['outorgadoMassificado']} old
 */
export function getMatriculasToFetch(newMatriculas, old) {
  // pega as matriculas para fazer o fetch
  return newMatriculas.filter((m) => {
    // sendo as que ainda não foram feito o fetch
    const notFetched = old.outorgados[m] === undefined;
    // e aquelas que estão sendo feito o fetch
    const isFetching = Object.values(old.fetchingMatriculas).flat(Infinity).includes(m);

    return notFetched && !isFetching;
  });
}
