import apiModel from 'services/apis/ApiModel';

/*******     Action Types     *******/

export const types = {
  COBAN_FETCH_MUNICIPIOS: 'COBAN_FETCH_MUNICIPIOS',
  COBAN_FETCH_MUNICIPIO: 'COBAN_FETCH_MUNICIPIO',
  COBAN_FETCH_COBANS: 'COBAN_FETCH_COBANS',
  COBAN_FETCH_COBAN: 'COBAN_FETCH_COBAN',
  COBAN_NEW_COBAN: 'COBAN_NEW_COBAN',
  COBAN_FETCH_TEXTO: 'COBAN_FETCH_TEXTO',
  COBAN_FETCH_PREFIXOS: 'COBAN_FETCH_PREFIXOS',
}

/*******     Reducers     *******/

const initialState = {
  municipios: [],
  municipio: {},
  cobans: [],
  coban: {},
  texto: {},
  prefixos: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.COBAN_FETCH_MUNICIPIOS:
      return {
        ...state,
        municipios: action.payload
      }
    case types.COBAN_FETCH_MUNICIPIO:
      return {
        ...state,
        municipios: action.payload
      }
    case types.COBAN_FETCH_COBANS:
      return {
        ...state,
        cobans: action.payload
      }
    case types.COBAN_FETCH_COBAN:
      return {
        ...state,
        coban: action.payload
      }
    case types.COBAN_NEW_COBAN:
      return {
        ...state,
        coban: action.payload
      }
    case types.COBAN_FETCH_TEXTO:
      return {
        ...state,
        texto: action.payload
      }
    case types.COBAN_FETCH_PREFIXOS:
      return {
        ...state,
        prefixos: action.payload
      }
    default:
      return state;
  }
}

/*******     Actions     *******/

export const fetchMunicipios = ({ dados, responseHandler }) => async (dispatch) => {

  try {
    let response = await apiModel.get("/coban/municipio",
      { params: { municipio: dados } }
    );

    dispatch({ type: types.COBAN_FETCH_MUNICIPIOS, payload: response.data });

    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }

}

export const fetchCobans = ({ responseHandler }) => async (dispatch) => {

  try {
    let response = await apiModel.get("/coban/cobans");

    dispatch({ type: types.COBAN_FETCH_COBANS, payload: response.data });

    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }

}

export const fetchMunicipio = ({ id, responseHandler }) => async (dispatch) => {

  try {
    let response = await apiModel.get(`/coban/municipio/${id}`);

    dispatch({ type: types.COBAN_FETCH_MUNICIPIO, payload: response.data });

    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }

}

export const fetchCoban = ({ id, responseHandler }) => async (dispatch) => {

  try {
    let response = await apiModel.get(`/coban/coban/${id}`);

    dispatch({ type: types.COBAN_FETCH_COBAN, payload: response.data });

    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }

}

export const novaIndicacaoCoban = ({ dados, responseHandler }) => async (dispatch) => {

  try {
    let resp = await apiModel.get("/coban/cnpjexiste",
      { params: { cnpj: dados.dados.cnpj } }
    );

    const existe = resp.data;

    if (!existe.length ) {
      let response = await apiModel.post("/coban/coban", { ...dados });

      dispatch({ type: types.COBAN_NEW_COBAN, payload: response.data });

      responseHandler.successCallback();
    } else {
      responseHandler.errorCallback('cnpjexiste');
    }

  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }
}

export const fetchTexto = ({ responseHandler }) => async (dispatch) => {

  try {
    let response = await apiModel.get('/coban/texto/');

    dispatch({ type: types.COBAN_FETCH_TEXTO, payload: response.data });

    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }

}

export const fetchPrefixos = ({ dados, responseHandler }) => async (dispatch) => {

  try {
    let response = await apiModel.get('/matcheddependencias/',
      { params: { prefixo: dados } }
    );

    dispatch({ type: types.COBAN_FETCH_PREFIXOS, payload: response.data });

    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }

}
