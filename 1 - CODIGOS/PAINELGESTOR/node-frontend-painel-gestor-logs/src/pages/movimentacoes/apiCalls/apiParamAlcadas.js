import { message } from 'antd';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const getParametros = async (/** @type {number} */ id) =>
  fetch(FETCH_METHODS.GET, '/movimentacoes/getParametros/', { id });

export const delParametro = async (
  /** @type {{ id: number; observacao: string; }} */ id,
) =>
  fetch(FETCH_METHODS.DELETE, '/movimentacoes/delParametro/', id).then(() =>
    message.success('Parametro excluído com sucesso!'),
  );

export const gravarParametro = async (/** @type {string} */ novoParametro) =>
  fetch(
    FETCH_METHODS.POST,
    '/movimentacoes/gravarParametro',
    novoParametro,
  ).then(() => message.success('Parametro gravado com sucesso!'));

export const patchParametros = async (/** @type {number} */ id) =>
  fetch(FETCH_METHODS.PATCH, 'movimentacoes/patchParametros', id).then(() =>
    message.success('Comitê alterado com sucesso!'),
  );

export const getCargosComissoesFot09 = async (
  /** @type {number} */ cod_dependencia,
) =>
  fetch(FETCH_METHODS.GET, '/movimentacoes/getCargosComissoesFot09/', {
    cod_dependencia,
  });

export const getJurisdicoesSubordinadas = async (
  /** @type {string} */ prefixo,
) =>
  fetch(FETCH_METHODS.GET, '/movimentacoes/getJurisdicoesSubordinadas/', {
    prefixo,
  });

export const listaComiteParamAlcadas = async (/** @type {string} */ prefixo) =>
  fetch(FETCH_METHODS.GET, '/movimentacoes/listaComiteParamAlcadas/', {
    prefixo,
  });
  