import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const getDadosEnvolvido = async (idEnvolvido) => {
  return fetch(FETCH_METHODS.GET, `/mtn/adm/envolvido/${idEnvolvido}`);
};
