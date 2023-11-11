import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const getFuncao = (funcao, prefixo) =>
  fetch(FETCH_METHODS.GET, 'flexcriterios/dadosfuncao', { funcao, prefixo });
export const getTipoFlex = async () =>
  fetch(FETCH_METHODS.GET, 'flexcriterios/tipos');
export const getEtapas = async () =>
  fetch(FETCH_METHODS.GET, 'flexcriterios/etapas');
export const getEscaloes = async (diretoria, idSolicitacao) =>
  fetch(FETCH_METHODS.GET, 'flexcriterios/escaloes', {
    diretoria,
    idSolicitacao,
  });
export const getAcoes = async () =>
  fetch(FETCH_METHODS.GET, 'flexcriterios/acoes');

// TODO mocks para testes ou ainda não implementada a rota verdadeira
// import {
//   getEtapasMock,
//   getFuncaoMock,
//   getSolicitacaoFiltrosMock,
//   getTipoFlexMock,
// } from '../mock/rotasMock';
// export const getFuncao = (funcao) => getFuncaoMock(funcao);
// export const getTipoFlex = async () => getTipoFlexMock();
// export const getEtapas = async () => getEtapasMock();
