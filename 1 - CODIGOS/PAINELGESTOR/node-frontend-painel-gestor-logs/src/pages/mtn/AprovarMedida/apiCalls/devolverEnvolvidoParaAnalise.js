import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const devolverEnvolvidoParaAnalise = async (idEnvolvido) =>
  fetch(
    FETCH_METHODS.POST,
    `/mtn/adm/envolvido/devolver-envolvido-para-analise/${idEnvolvido}`,
  );
