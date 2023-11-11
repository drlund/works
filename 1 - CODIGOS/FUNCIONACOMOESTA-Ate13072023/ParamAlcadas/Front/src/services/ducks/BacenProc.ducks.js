import apiModel from 'services/apis/ApiModel';
import { DownloadFileUtil } from 'utils/Commons';

/*******     Action Types     *******/

export const types = {
  BACENPROC_GET_ANO : 'BACENPROC_GET_ANO',
  BACENPROC_GET_TABELAS: 'BACENPROC_GET_TABELAS',
  BACENPROC_GET_DADOSMODAL: 'BACENPROC_GET_DADOSMODAL'
}

/*******     Reducers     *******/

const initialState = {
  listaAnos: [],
  tabelas: [],
  dadosModal: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.BACENPROC_GET_ANO:
      return { ...state, listaAnos: action.payload }
    case types.BACENPROC_GET_TABELAS:
      return { ...state, tabelas: action.payload }
    case types.BACENPROC_GET_DADOSMODAL:
      return { ...state, dadosModal: action.payload }  
    default:
      return state;
  }
}

/*******     Actions     *******/

export const getAno = ({ responseHandler }) => async (dispatch) => {
  try {
    let response = await apiModel.get("/bacenproc", { params: { action: 'GET_YEAR'} });    

    if (!response.data) {
      responseHandler.errorCallback();
      return;
    }
    
    dispatch({ type: types.BACENPROC_GET_ANO, payload: [...response.data] });

    const lastYearIndex = response.data.length - 1;
    const lastYear = lastYearIndex >=0 ? response.data[lastYearIndex].ano : "Aguarde";
    responseHandler.successCallback(lastYear);
  } catch (error) {
    let what = (error.response && error.response.data) ? error.response.data : null;
    responseHandler.errorCallback(what);
  }
}

export const getAction = (visao) => {
  switch (visao) {
    case 'urvSuper':
      return 'ACTION_COUNT_URV_SUPER';
    case 'uavSuper':
      return 'ACTION_COUNT_UAV_SUPER';
    case 'urvGerev':
      return 'ACTION_COUNT_URV_GEREV';
    case 'uavGerev':
      return 'ACTION_COUNT_UAV_GEREV';
    case 'motBacen':
      return 'ACTION_MOTIVOS_BACEN';
    default:
      return 'ACTION_COUNT_DIRETORIA';
  }
}

export const getTabelas = ({ ano, periodo, visao, responseHandler }) => async (dispatch) => {
  try {
    let action = getAction(visao);
    let response = await apiModel.get("/bacenproc", { params: { ano, periodo, action } });    

    if (!response.data) {
      responseHandler.errorCallback();
      return;
    }
    
    dispatch({ type: types.BACENPROC_GET_TABELAS, payload: [...response.data] });
    responseHandler.successCallback();
  } catch (error) {
    let what = (error.response && error.response.data) ? error.response.data : null;
    responseHandler.errorCallback(what);
  }
}

export const getDadosModal = ({ periodo, ano, visao, mesRef, prefixo, responseHandler }) => async (dispatch) => {
  try {
    let action = getAction(visao);
    let response = await apiModel.get("/bacenproc", { params: { periodo, ano, action, mesRef, prefixo } });

    if (!response.data) {
      responseHandler.errorCallback();
      return;
    }

    dispatch({ type: types.BACENPROC_GET_DADOSMODAL, payload: [...response.data] });
    responseHandler.successCallback();
  } catch (error) {
    let what = (error.response && error.response.data) ? error.response.data : null;
    responseHandler.errorCallback(what);
  }
}

/**
 * Faz o download dos dados conforme filtro feito pelo usuário.
 */
export const downloadDados = ({ ano, periodo, visao, mesRef, prefixo, fileName, responseHandler }) => async () => {
  try {
    let action = getAction(visao); 
    let response = await apiModel.get("/bacenproc/exportar", { 
      params: { ano, periodo, action, mesRef, prefixo },
      responseType: 'blob'
    });

    DownloadFileUtil(fileName, response.data);
    responseHandler.successCallback();
  } catch (error) {
    let what = (error.response && error.response.data) ? error.response.data : null;;
    responseHandler.errorCallback(what);
  }
};