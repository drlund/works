import { fetchOutorgados } from './fetchOutorgados';
import { getMatriculasToFetch } from './getMatriculasToFetch';
import { clearFromFetchingMatriculas } from './clearFromFetchingMatriculas';

/**
 * @typedef {(value: React.SetStateAction<import('..').ListaRevogacaoMassificada>) => void} setListas
 */

/**
 * @param {string[]} newMatriculas
 * @param {import('..').ListaRevogacaoMassificada} old
 * @param {setListas} setListas
 */
export function getNewFetchingMatriculas(newMatriculas, old, setListas) {
  // gera um random key para o fetch, para poder remover depois
  const randomKey = String(performance.now());

  // se houverem matriculas
  if (newMatriculas.length > 0) {
    fetchOutorgados(newMatriculas)
      .then((newOutorgados) => setListas((oldFetch) => ({
        ...oldFetch,
        outorgados: {
          ...oldFetch.outorgados,
          ...newOutorgados,
        }
      })))
      .finally(() => clearFromFetchingMatriculas(setListas, randomKey));

    return {
      ...old.fetchingMatriculas,
      [randomKey]: newMatriculas,
    };
  }

  return old.fetchingMatriculas;
}
