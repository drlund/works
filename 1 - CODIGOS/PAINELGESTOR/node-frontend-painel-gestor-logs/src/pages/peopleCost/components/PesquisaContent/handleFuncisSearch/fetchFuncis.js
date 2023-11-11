import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

/**
 * @param {string[]} emails
 */
export async function fetchFuncis(emails) {
  return fetch(FETCH_METHODS.POST, '/peopleCost/', {
    emails,
  }).then((/** @type {PeopleCost.PesquisaOk[]} */ res) => emails.reduce(
    (acc, cur) => {
      const pesquisa = res.find((r) => r.email === cur);

      acc[cur] = pesquisa || {
        email: cur,
        error: 'Funci sem Informação Encontrada',
      };

      return acc;
    }, /** @type {PeopleCost.ListaEmails['funcis']} */({}))
  );
}
