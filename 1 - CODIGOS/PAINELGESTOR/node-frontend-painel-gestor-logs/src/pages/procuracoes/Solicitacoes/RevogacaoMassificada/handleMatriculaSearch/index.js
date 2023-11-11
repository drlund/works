/**
 * @typedef {(value: React.SetStateAction<import('..').ListaRevogacaoMassificada>) => void} setListas
 */

import { clearFromFetchingMatriculas } from './clearFromFetchingMatriculas';
import { fetchOutorgados } from './fetchOutorgados';

/**
 * @param {setListas} setListas
 * @param {string|string[]} value
 * @param {(newOutorgados: import('..').ListaRevogacaoMassificada['outorgados']) => void} handleAdd
 */
export function handleMatriculaSearch(setListas, value, handleAdd) {
  setListas((old) => {
    const currentFetching = /** @type {string[]} */(Object.values(old.fetchingMatriculas).flat(Infinity));
    const fetched = Object.keys(old.outorgados);
    const dontFetch = [...currentFetching, ...fetched];

    // dedupe de matriculas já feitas ou sendo feitas
    const newMatriculas = Array.from(new Set(
      /** @type {string[]} */([])
        .concat(value)
        .map((v) => v.toUpperCase())
        .filter(v => !dontFetch.includes(v))
    ));

    // gera um random key para o fetch, para poder remover depois
    const randomKey = String(performance.now());

    // se houverem matriculas
    if (newMatriculas.length > 0) {
      fetchOutorgados(newMatriculas)
        .then(handleAdd)
        .finally(() => clearFromFetchingMatriculas(setListas, randomKey));

      return {
        ...old,
        fetchingMatriculas: {
          ...old.fetchingMatriculas,
          [randomKey]: newMatriculas,
        }
      };
    }

    return {
      ...old,
    };
  });
}
