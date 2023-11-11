import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';


export const fetchDependencia = (prefixo) => {
  return fetch(FETCH_METHODS.GET, `dependencia/${prefixo}`);
}

export const fetchAllDiretorias = () => {
  return fetch(FETCH_METHODS.GET, "mestre/diretorias");
}

export const fetchSubordinadas = (prefixo) => {
  return fetch(FETCH_METHODS.GET, `mestre/subordinadas/${prefixo}`);
}