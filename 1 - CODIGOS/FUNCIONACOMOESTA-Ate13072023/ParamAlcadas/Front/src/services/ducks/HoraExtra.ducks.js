import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

/*******     Action Types     *******/
export const types = {
}

/*******     Reducers     *******/
const initialState = {
}

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
}


/*******     Actions     *******/


/* ------------ API CALLS -------------- */


export const getDadosSolicitacaoHE = () => {
  return fetch(FETCH_METHODS.GET, "/hrxtra/getdadossolicitacaohe/");
}

export const getDadosFuncionario = (matricula) => {
  return fetch(FETCH_METHODS.GET, "/hrxtra/adesaohe/", { matricula });
}

export const getFuncisPrefixo = (prefixo) => {
  return fetch(FETCH_METHODS.GET, "/hrxtra/funcisporprefixo/", { prefixo });
}

export const enviarDadosSolicitacao = (dados) => {
  return fetch(FETCH_METHODS.POST, "/hrxtra/addsolicitacao/", { dados });
}

export const getDadosResumoHEGG = (matricula, prefixo, idSolicitacao) => {
  return fetch(FETCH_METHODS.GET, "/hrxtra/getdadosresumohegg/", { matricula, prefixo, idSolicitacao });
}

export const getPeriodos = () => {
  return fetch(FETCH_METHODS.GET, "/hrxtra/getperiodos/");
}

export const getEstadosSolicitacoes = () => {
  return fetch(FETCH_METHODS.GET, "/hrxtra/getestadossolicitacoes/");
}

export const getRegionais = () => {
  return fetch(FETCH_METHODS.GET, "/hrxtra/getregionais/");
}

export const getSolicitacoes = (periodo, status, regional) => {
  return fetch(FETCH_METHODS.GET, "/hrxtra/getsolicitacoesacomp/", { periodo, status, regional });
}

export const getPeriodoEstados = () => {
  return fetch(FETCH_METHODS.GET, "/hrxtra/getperiodoestados/");
}

export const enviarParecer = (parecer) => {
  return fetch(FETCH_METHODS.PATCH, "/hrxtra/addparecer/", { parecer });
}

export const acessoPermitido = () => {
  return fetch(FETCH_METHODS.GET, '/hrxtra/ispermitido/');
}

export const podeSolicitar = () => {
  return fetch(FETCH_METHODS.GET, '/hrxtra/podesolicitar/');
}

export const obterListaDiasUteis = (inicio, fim, prefixo) => {
  return fetch(FETCH_METHODS.GET, '/hrxtra/getlistadiasuteis/', { inicio, fim, prefixo });
}