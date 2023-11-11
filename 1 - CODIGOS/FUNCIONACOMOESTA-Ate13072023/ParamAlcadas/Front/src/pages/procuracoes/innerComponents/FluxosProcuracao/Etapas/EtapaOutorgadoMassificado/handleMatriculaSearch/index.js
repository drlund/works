import { getNewFetchingMatriculas } from './getNewFetchingMatriculas';

/**
 * @typedef {React.Dispatch<React.SetStateAction<Procuracoes.DadosProcuracao['outorgadoMassificado']>>} setListas
 */

/**
 * @param {setListas} setListas
 * @param {string} idFluxo
 * @param {string|string[]} value
 */
export function handleMatriculaSearch(setListas, idFluxo, value) {
  setListas((old) => {
    // junta novas matriculas a lista de matriculas, fazendo o dedupe
    // as matriculas sempre se mantem até que sejam excluidas
    const newMatriculas = Array.from(new Set(old.listaDeMatriculas.concat(value)));
    newMatriculas.sort();

    const newFetchingMatriculas = getNewFetchingMatriculas(idFluxo, newMatriculas, old, setListas);

    return {
      ...old,
      listaDeMatriculas: newMatriculas,
      fetchingMatriculas: newFetchingMatriculas,
    };
  });
}
