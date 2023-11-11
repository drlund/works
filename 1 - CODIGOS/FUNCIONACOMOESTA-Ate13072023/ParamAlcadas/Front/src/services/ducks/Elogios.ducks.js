import apiModel from 'services/apis/ApiModel';
import _ from 'lodash';
import { getProfileURL, DownloadFileUtil } from 'utils/Commons';
import {testeMatricula, testePrefixo} from '../../utils/Regex';
import history from "@/history.js";

/*******     Action Types     *******/

export const types = {
  ELOGIOS_UPDATE_LISTA_FUNCIS : 'ELOGIOS_UPDATE_LISTA_FUNCIS',  
  ELOGIOS_UPDATE_LISTA_DEPENDENCIAS: 'ELOGIOS_UPDATE_LISTA_DEPENDENCIAS',
  ELOGIOS_UPDATE_FORM_DATA: 'ELOGIOS_UPDATE_FORM_DATA',
  ELOGIOS_REMOVE_FUNCI_LISTA: 'ELOGIOS_REMOVE_FUNCI_LISTA',
  ELOGIOS_REMOVE_DEPENDENCIA_LISTA: 'ELOGIOS_REMOVE_DEPENDENCIA_LISTA',
  ELOGIOS_NEW_REGISTER: 'ELOGIOS_NEW_REGISTER',
  ELOGIOS_FETCH_ELOGIO: 'ELOGIOS_FETCH_ELOGIO',
  ELOGIOS_FETCH_ELOGIOS: 'ELOGIOS_FETCH_ELOGIOS',
  ELOGIOS_FETCH_HISTORICO_ELOGIOS: 'ELOGIOS_FETCH_HISTORICO_ELOGIOS',
  ELOGIOS_FETCH_HISTORICO_ODI: 'ELOGIOS_FETCH_HISTORICO_ODI'
}


/*******     Reducers     *******/

const defaultElogio = {
  listaDependencias: [],
  listaFuncis: [],
  formData: {
    outros: ""
  }
}

const initialState = {
  dadosElogio: {...defaultElogio},
  historicoElogios: [],
  historicoODIs: [],
  listaElogios: {
    pendentes: [],
    autorizados: []
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ELOGIOS_UPDATE_LISTA_FUNCIS:

        return {
          ...state, 
          dadosElogio: { ...state.dadosElogio, listaFuncis: action.payload}
        }
    case types.ELOGIOS_UPDATE_LISTA_DEPENDENCIAS:
        return {
          ...state, 
          dadosElogio: { ...state.dadosElogio, listaDependencias: action.payload}
        }     
    case types.ELOGIOS_REMOVE_FUNCI_LISTA:

        let funcisFiltrados = _.filter(state.dadosElogio.listaFuncis, (funci) => {
          return funci.matricula !== action.payload
        });

        return {
          ...state, 
          dadosElogio: { ...state.dadosElogio, listaFuncis: funcisFiltrados}
        }
    case types.ELOGIOS_UPDATE_FORM_DATA:

        let novoFormData = {
          ...state.dadosElogio.formData,
          ...action.payload
        }
        return {
          ...state, 
          dadosElogio: { ...state.dadosElogio, formData: novoFormData}
        }
    
    case types.ELOGIOS_REMOVE_DEPENDENCIA_LISTA:

        let depFiltradas = _.filter(state.dadosElogio.listaDependencias, (dep) => {
          return dep.prefixo !== action.payload
        });
        return {
          ...state, 
          dadosElogio: { ...state.dadosElogio, listaDependencias: depFiltradas}
        }        

    case types.ELOGIOS_NEW_REGISTER:
      return {
        ...state, 
        dadosElogio: {...defaultElogio}
      }

    case types.ELOGIOS_FETCH_ELOGIO: 
      return {
        ...state, 
        dadosElogio: {...action.payload}
      }

    case types.ELOGIOS_FETCH_ELOGIOS: 
      let novaLista = {...state.listaElogios};
      novaLista[action.payload.tipo] = action.payload.dados;

      return {
        ...state, 
        listaElogios: novaLista
      }

    case types.ELOGIOS_FETCH_HISTORICO_ELOGIOS:
      return {
        ...state, 
        historicoElogios: [...action.payload]
      }

    case types.ELOGIOS_FETCH_HISTORICO_ODI:
      return {
        ...state, 
        historicoODIs: [...action.payload]
      }

    default:
      return state;
  }
}


/*******     Actions     *******/

export const fetchDependencia = ({prefixo, responseHandler}) => async (dispatch, getState) => {
  try {

    let response = await apiModel.get("/dependencia/" + prefixo);
    let dependencia = response.data;

    if (!dependencia) {
      responseHandler.errorCallback();
      return;
    }

    let listaAtual = getState().elogios.dadosElogio.listaDependencias;
    let novaLista = 
      [ 
        ...listaAtual,      
        {
          key: dependencia.prefixo, 
          prefixo: dependencia.prefixo,
          email: dependencia.email,
          uor: dependencia.uor,
          nome: dependencia.nome ,
        }
           
      ];
    
    dispatch({ type: types.ELOGIOS_UPDATE_LISTA_DEPENDENCIAS, payload: novaLista});
    responseHandler.successCallback();
  } catch (error) {
    responseHandler.errorCallback();
  }

}

export const fetchFunci = ({matricula, responseHandler}) => async (dispatch, getState) => {
 
  try {

    let response = await apiModel.get("/funci/" + matricula);
    let funci = response.data;

    if (!funci) {
      responseHandler.errorCallback();
      return;
    }

    let listaAtual = getState().elogios.dadosElogio.listaFuncis;
    let novaLista = 
      [ 
        ...listaAtual,      
        {
          key: funci.matricula, 
          matricula: funci.matricula,
          nome: funci.nome ,
          cargo: funci.descCargo,
          email: funci.email,
          img: getProfileURL(funci.matricula),
          prefixo: funci.dependencia.prefixo,
          nome_prefixo: funci.dependencia.nome, 
          nomeGuerra: funci.nomeGuerra
        }
           
      ];
    
    dispatch({ type: types.ELOGIOS_UPDATE_LISTA_FUNCIS, payload: novaLista});
    responseHandler.successCallback();
  } catch (error) {
    responseHandler.errorCallback();
  }

}

export const removeDestinatario = ({identificador, responseHandler}) => {

    if(testeMatricula.test(identificador)){
     
      return{
        type: types.ELOGIOS_REMOVE_FUNCI_LISTA,
        payload: identificador        
      }
    }else if(testePrefixo.test(identificador)){
      return{
        type: types.ELOGIOS_REMOVE_DEPENDENCIA_LISTA,
        payload: identificador        
      }
    }else{
      
      responseHandler.errorCallback()
      return {
        type: "",
        payload: ""
      };
    }

}

export const updateFormData =  (newData) => {
  
  return{
    type: types.ELOGIOS_UPDATE_FORM_DATA,
    payload: {...newData}
  }
}

export const novoElogio =  (successCallback) => async (dispatch) => {
  dispatch({ type: types.ELOGIOS_NEW_REGISTER });  
  if (successCallback) {
    successCallback();
  }
}

export const salvarMensagem = (responseHandler) => async (dispatch, getState) => {

  let response;
  let dadosElogio = getState().elogios.dadosElogio;

  try {
    if (dadosElogio.id) {
      response = await apiModel.patch("/elogios", {...dadosElogio});
    } else {
      response = await apiModel.post("/elogios", {...dadosElogio});
    }

    responseHandler.successCallback();

    if (! dadosElogio.id) {
      //Caso for a criacao de um novo elogio, redireciona para a tela de edição.
      history.push('/elogios/editar-elogio/'+ response.data.id);
    }

  } catch (error) {
    let what = (error.response && error.response.data) ? error.response.data : null;;
    responseHandler.errorCallback(what);
  }  
} 

export const fetchElogio = ({idElogio, responseHandler}) => async (dispatch) => {
  try {
    let response = await apiModel.get("/elogios/" + idElogio);
    dispatch({ type: types.ELOGIOS_FETCH_ELOGIO, payload: response.data});
    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }
};


export const fetchElogios = ({tipo, responseHandler}) => async (dispatch) => {
  try {
    let options = {tipo};
    let response = await apiModel.get("/elogios", { params: {...options} });
    dispatch({ type: types.ELOGIOS_FETCH_ELOGIOS, payload: {tipo, dados: response.data} });
    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }
};

export const fetchHistoricoElogios = ({responseHandler}) => async (dispatch) => {
  try {
    let response = await apiModel.get("/elogios/historico");
    dispatch({ type: types.ELOGIOS_FETCH_HISTORICO_ELOGIOS, payload: response.data });
    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }
};

export const fetchHistoricoODI = ({responseHandler}) => async (dispatch) => {
  try {
    let response = await apiModel.get("/elogios/historico-odi");
    dispatch({ type: types.ELOGIOS_FETCH_HISTORICO_ODI, payload: response.data });
    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }
};

export const deleteElogio = ({id, responseHandler}) => async (dispatch) => {
  try {
    await apiModel.delete("/elogios", { params: { id }});
    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }
};

export const autorizaEnvioElogios = ({listaElogios, responseHandler}) => async (dispatch) => {
  try {
    await apiModel.post("/elogios/autorizar-envio", { listaEnvio: [...listaElogios] });
    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }
};

/**
 * Faz o download dos elogios autorizados.
 */
export const downloadElogiosAutorizados = ({fileName, responseHandler}) => async () => {
  try {
    let response = await apiModel.get("/elogios/exportar", { responseType: 'blob' });
    DownloadFileUtil(fileName, response.data);
    responseHandler.successCallback();
  } catch (error) {
    let what = (error.response && error.response.data) ? error.response.data : null;;
    responseHandler.errorCallback(what);
  }
};