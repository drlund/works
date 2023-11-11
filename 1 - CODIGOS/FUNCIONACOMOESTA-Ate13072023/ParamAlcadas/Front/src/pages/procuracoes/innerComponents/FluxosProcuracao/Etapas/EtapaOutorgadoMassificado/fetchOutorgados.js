import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

/**
 * @param {string[]} currentList
 * @param {string} idFluxo
 * @returns {Promise<Procuracoes.FetchedFunci[]>}
 */
export async function fetchOutorgados(currentList, idFluxo) {
  return fetch(FETCH_METHODS.POST, 'procuracoes/massificado/listaOutorgados', {
    listaDeMatriculas: currentList,
    idFluxo,
  }).then(
    /**
     * @param {Record<string,{ funci?: Funci, error: string|null }>} res
     */
    (res) => Object
      .entries(res)
      .map(([matricula, { error, funci }]) => ({
        ...funci,
        matricula,
        error,
      })));
}
