import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

const getPareceresPendentesAprovacao = () => {
  return fetch(FETCH_METHODS.GET, 'mtn/adm/pareceres-para-aprovacao');
};

export default getPareceresPendentesAprovacao;
