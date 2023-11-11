import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const getListaDePrefixos = (prefixo) =>
  fetch(FETCH_METHODS.GET, 'movimentacoes/jurisdicao-lista-prefixos', {
    prefixo,
  });

export const getDadosJurisdicaoMeuPrefixo = () =>
  fetch(FETCH_METHODS.GET, 'movimentacoes/jurisdicao-propria');

export const getDadosJurisdicaoPorPrefixo = (prefixo) =>
  fetch(FETCH_METHODS.GET, 'movimentacoes/jurisdicionadas-por-prefixo', {
    prefixo,
  });

export const postVincularSubordinadaProprioPrefixo = (data) =>
  fetch(FETCH_METHODS.POST, 'movimentacoes/jurisdicao-propria', { data });

export const postVincularSubordinadaQualquerPrefixo = (data) =>
  fetch(FETCH_METHODS.POST, 'movimentacoes/qualquer-jurisdicao', { data });

export const deleteSubordinadaPropriaJurisdicao = (prefixo) =>
  fetch(FETCH_METHODS.DELETE, 'movimentacoes/jurisdicao-propria', { prefixo });

export const deleteSubordinadaQualquerJurisdicao = (prefixo) =>
  fetch(FETCH_METHODS.DELETE, 'movimentacoes/qualquer-jurisdicao', { prefixo });
