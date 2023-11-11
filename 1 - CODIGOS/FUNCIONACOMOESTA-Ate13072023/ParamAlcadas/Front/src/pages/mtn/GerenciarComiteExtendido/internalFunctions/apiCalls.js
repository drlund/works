import { message } from 'antd';
import { setDataExpiracaoFutura } from "../../../../utils/dateFunctions/setDataExpiracaoFutura";
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const getComite = async (cb) => {
  const data = await fetch(FETCH_METHODS.GET, '/mtn-gerenciar-comite-extendido');
  cb(data);
};

export const postPessoaComite = async ({ matricula, month }) => {
  const dataExpiracao = setDataExpiracaoFutura(month);
  return fetch(FETCH_METHODS.POST, '/mtn-gerenciar-comite-extendido', { matricula, dataExpiracao });
};

export const patchPessoaComite = async ({ matricula, month }) => {
  const dataExpiracao = setDataExpiracaoFutura(month);
  return fetch(FETCH_METHODS.PATCH, '/mtn-gerenciar-comite-extendido', { matricula, dataExpiracao })
    .then(() => message.success('Pessoa alterada com sucesso!'));
};

export const deletePessoaComite = async ({ matricula }) => {
  return fetch(FETCH_METHODS.DELETE, '/mtn-gerenciar-comite-extendido', { matricula })
    .then(() => message.success('Pessoa excluída com sucesso!'));
};

