/**
 * @typedef {(value: React.SetStateAction<PeopleCost.ListaEmails>) => void} setListas
 */

import { clearFromFetchingMatriculas } from './clearFromFetchingMatriculas';
import { fetchFuncis } from './fetchFuncis';

/**
 * @param {setListas} setListas
 * @param {string|string[]} value
 * @param {(newFuncis: PeopleCost.ListaEmails['funcis']) => void} handleAdd
 */
export function handleFuncisSearch(setListas, value, handleAdd) {
  setListas((old) => {
    const currentFetching = /** @type {string[]} */(Object.values(old.fetchingFuncis).flat(Infinity));
    const fetched = Object.keys(old.funcis);
    const dontFetch = [...currentFetching, ...fetched];

    // dedupe de matriculas já feitas ou sendo feitas
    const newFuncis = Array.from(new Set(
      /** @type {string[]} */([])
        .concat(value)
        .map((v) => v.toLowerCase())
        .filter(v => !dontFetch.includes(v))
    ));

    // gera um random key para o fetch, para poder remover depois
    const randomKey = String(performance.now());

    // se houverem matriculas
    if (newFuncis.length > 0) {
      fetchFuncis(newFuncis)
        .then(handleAdd)
        .finally(() => clearFromFetchingMatriculas(setListas, randomKey));

      return {
        ...old,
        fetchingFuncis: {
          ...old.fetchingFuncis,
          [randomKey]: newFuncis,
        }
      };
    }

    return {
      ...old,
    };
  });
}
