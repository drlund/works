import { message } from 'antd';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const getSuspensoes = async (/** @type {number} */ id) =>
  fetch(FETCH_METHODS.GET, '/movimentacoes/getSuspensoes/', id);

export const getSuspensoesView = async (/** @type {number} */ id) =>
  fetch(FETCH_METHODS.GET, '/movimentacoes/getSuspensoesView/', id);

export const getTipoSuspensao = async (/** @type {number} */ id) =>
  fetch(FETCH_METHODS.GET, '/movimentacoes/getTipoSuspensao/', { id });

export const gravarTipoDeSuspensao = async (/** @type {string} */ mensagem) =>
  fetch(FETCH_METHODS.POST, '/movimentacoes/gravarTipoDeSuspensao/', {
    mensagem,
  });

export const gravarSuspensao = async (/** @type {number} */ id) =>
  fetch(FETCH_METHODS.POST, '/movimentacoes/gravarSuspensao/', {
    id,
  }).then(() => message.success('Suspensão incluída com sucesso!'));

export const getTiposJurisdicoes = async (/** @type {string} */ prefixo) =>
  fetch(FETCH_METHODS.GET, '/movimentacoes/getTiposJurisdicoes/', {
    prefixo,
  });

export const getMatriculas = async (/** @type {string} */ matricula) =>
  fetch(FETCH_METHODS.GET, '/movimentacoes/getMatriculas/', {
    matricula,
  });

export const patchSuspensao = async (/** @type {string} */ id) =>
  fetch(FETCH_METHODS.PATCH, '/movimentacoes/patchSuspensao/', id).then(() =>
    message.success('Suspensão alterada com sucesso!'),
  );

export const deleteSuspensao = async (
  /** @type {{ idSuspensao: number }} */ idSuspensao,
) =>
  fetch(FETCH_METHODS.DELETE, '/movimentacoes/deleteSuspensao/', idSuspensao).then(() =>
    message.success('Suspensão excluída com sucesso!'),
  );
