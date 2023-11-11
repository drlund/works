import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

/* ------------ API CALLS -------------- */

export const fetchListaFerramentas = () => {
  return fetch(FETCH_METHODS.GET, "/acessos/ferramentas");
}

export const gerarNovaChave = ({nomeFerramenta, responsavel}) => {
  return fetch(FETCH_METHODS.POST, "/api-keys/gerar-nova-chave", { nomeFerramenta, responsavel });
}

export const fetchChavesApi = () => {
  return fetch(FETCH_METHODS.GET, "/api-keys");
}

export const removerChavesApi = (selectedKeys) => {
  return fetch(FETCH_METHODS.DELETE, "/api-keys", { selectedKeys });
}


/* ------------ END - API CALLS -------------- */