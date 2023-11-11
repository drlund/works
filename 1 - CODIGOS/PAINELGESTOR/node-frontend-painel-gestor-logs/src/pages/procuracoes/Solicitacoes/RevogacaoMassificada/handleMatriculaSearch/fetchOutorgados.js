import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

/**
 * @param {string[]} matriculas
 */
export async function fetchOutorgados(matriculas) {
  return fetch(FETCH_METHODS.GET, 'procuracoes/solicitacoes/massificado/revogacao/lista', {
    matriculas,
  }).then((/** @type {import('..').PesquisaOk[]} */ res) => matriculas.reduce(
    (acc, cur) => {
      const pesquisa = res.filter((r) => r.matricula === cur);

      acc[cur] = (pesquisa.length > 0)
        ? pesquisa
        : [{
          matricula: cur,
          error: 'Funci sem Procuração Encontrada',
        }];

      return acc;
    }, /** @type {import('..').ListaRevogacaoMassificada['outorgados']} */({}))
  );
}

export async function fetchProcuracoesARevogar() {
  return fetch(FETCH_METHODS.GET, 'procuracoes/solicitacoes/massificado/revogacao/lista-revogar')
    .then((/** @type {import('..').PesquisaOk[]} */  res) => res.reduce(
      (acc, cur) => {
        if (acc[cur.matricula]) {
          /** @type {typeof res} */(acc[cur.matricula]).push(cur);
        } else {
          acc[cur.matricula] = [cur];
        }

        return acc;
      }, /** @type {import('..').ListaRevogacaoMassificada['outorgados']} */({}))
    );
}
