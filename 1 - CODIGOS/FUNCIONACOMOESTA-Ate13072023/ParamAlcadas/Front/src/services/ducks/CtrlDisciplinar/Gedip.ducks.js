import apiModel from 'services/apis/ApiModel';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';
import { ExtractErrorMessage, BlobToURL } from 'utils/Commons';
import _ from 'lodash';

// import _ from 'lodash';
// import {testeMatricula, testePrefixo} from 'utils/Regex';
// import history from "@/history.js";

/*******     Action Types     *******/

export const types = {
  CTRL_DISCP_ADD_GEDIP: 'CTRL_DISCP_ADD_GEDIP',
  CTRL_DISCP_FETCH_GEDIPS: 'CTRL_DISCP_FETCH_GEDIPS',
  CTRL_DISCP_CONCLUIR_GEDIP: 'CTRL_DISCP_CONCLUIR_GEDIP',
  CTRL_DISCP_FUNCI_GEDIP: 'CTRL_DISCP_FUNCI_GEDIP',
  CTRL_DISCP_FETCH_STATUS_GEDIP: 'CTRL_DISCP_FETCH_STATUS_GEDIP',
  CTRL_DISCP_FETCH_DOCUMENTOS_GEDIP: 'CTRL_DISCP_FETCH_DOCUMENTOS_GEDIP',
  CTRL_DISCP_FETCH_TIPOS_DOCUMENTOS_GEDIPS: 'CTRL_DISCP_FETCH_TIPOS_DOCUMENTOS_GEDIPS',
  CTRL_DISCP_FETCH_COMITES: 'CTRL_DISCP_FETCH_COMITES',
  CTRL_DISCP_FETCH_MEDIDAS: 'CTRL_DISCP_FETCH_MEDIDAS',
  CTRL_DISCP_FILL_DADOS_NOVA_GEDIP: 'CTRL_DISCP_FILL_DADOS_NOVA_GEDIP',
  CTRL_DISCP_FETCH_GEDIP: 'CTRL_DISCP_FETCH_GEDIP',
  CTRL_DISCP_FILL_DADOS_FUNCI_RESP: 'CTRL_DISCP_FILL_DADOS_FUNCI_RESP',
  CTRL_DISCP_FILL_DADOS_ARQUIVO: 'CTRL_DISCP_FILL_DADOS_ARQUIVO',
  CTRL_DISCP_FILL_DADOS_SEND_DADOS_ARQUIVO: 'CTRL_DISCP_FILL_DADOS_SEND_DADOS_ARQUIVO',
  CTRL_DISCP_FILL_DADOS_LINK_ARQUIVO: 'CTRL_DISCP_FILL_DADOS_LINK_ARQUIVO',
  CTRL_DISCP_FILL_DADOS_LINK_ARQUIVO_UPLOADED: 'CTRL_DISCP_FILL_DADOS_LINK_ARQUIVO_UPLOADED',
  CTRL_DISCP_FETCH_INS: 'CTRL_DISCP_FETCH_INS',
  CTRL_DISCP_CALC_LIMITE: 'CTRL_DISCP_CALC_LIMITE',
}

/*******     Reducers     *******/

const initialState = {
  gedips: [],
  funcionarioGedip: {},
  funcionarioResp: {},
  comites: [],
  medidas: [],
  dadosGedip: {},
  confirmModalVisible: false,
  funciResp: {},
  documentoEnviado: {},
  linkPdf: '',
  linkPdfUp: '',
  ins: [],
}

export default (state = initialState, action) => {
  switch (action.type) {

    case types.CTRL_DISCP_ADD_GEDIP:
      let novoGedip = { ...state.dadosGedip };
      novoGedip[action.payload.tipo] = action.payload.dados;

      return {
        ...state,
        dadosGedip: novoGedip
      }

    case types.CTRL_DISCP_FETCH_GEDIPS:
      return {
        ...state,
        gedips: [...action.payload]
      };

    case types.CTRL_DISCP_CONCLUIR_GEDIPS:
      return {
        ...state,
        gedips: [...action.payload]
      };

    case types.CTRL_DISCP_FUNCI_GEDIP:
      return {
        ...state,
        funcionarioGedip: { ...action.payload }
      }

    case types.CTRL_DISCP_FETCH_STATUS_GEDIP:
      return {
        ...state,
        statusGedip: [...action.payload]
      }

    case types.CTRL_DISCP_FETCH_DOCUMENTOS_GEDIP:
      return {
        ...state,
        docsGedip: [...action.payload]
      }

    case types.CTRL_DISCP_FETCH_TIPOS_DOCUMENTOS_GEDIPS:
      return {
        ...state,
        tiposDocsGedip: [...action.payload]
      }

    case types.CTRL_DISCP_FETCH_COMITES:
      return {
        ...state,
        comites: [...action.payload]
      }

    case types.CTRL_DISCP_FETCH_MEDIDAS:
      return {
        ...state,
        medidas: [...action.payload]
      }

    case types.CTRL_DISCP_FILL_DADOS_NOVA_GEDIP:
      return {
        ...state,
        dadosGedip: { ...action.payload }
      }

    case types.CTRL_DISCP_FETCH_GEDIP:
      return {
        gedip: { ...action.payload }
      }

    case types.CTRL_DISCP_CONF_MODAL_OPEN:
      return {
        ...state,
        confirmModalVisible: [...action.payload]
      }
    case types.CTRL_DISCP_CONF_MODAL_CLOSE:
      return {
        ...state,
        confirmModalVisible: [...action.payload]
      }
    case types.CTRL_DISCP_FILL_DADOS_FUNCI_RESP:
      return {
        ...state,
        funciResp: {...action.payload}
      }
    case types.CTRL_DISCP_FILL_DADOS_ADD_FUNCI_RESP:
      let funcionarioResp = { ...state.funcionarioResp };
      funcionarioResp[action.payload.tipo] = action.payload.dados;

      return {
        ...state,
        funcionarioResp: funcionarioResp
      }
    case types.CTRL_DISCP_FILL_DADOS_ARQUIVO:
      return {
        ...state,
        documentoEnviado: { ...action.payload }
      }
    case types.CTRL_DISCP_FILL_DADOS_SEND_DADOS_ARQUIVO:
      let documentoEnviado = { ...state.documentoEnviado };
      documentoEnviado[action.payload.tipo] = action.payload.dados;

      return {
        ...state,
        documentoEnviado: documentoEnviado
      }
    case types.CTRL_DISCP_FILL_DADOS_LINK_ARQUIVO:
      return {
        ...state,
        linkPdf: action.payload
      }
    case types.CTRL_DISCP_FILL_DADOS_LINK_ARQUIVO_UPLOADED:
      return {
        ...state,
        linkPdfUp: action.payload
      }
    case types.CTRL_DISCP_FETCH_INS:
      return {
        ...state,
        ins: action.payload
      }
    case types.CTRL_DISCP_CALC_LIMITE:
      return {
        ...state,
        dadosGedip: { ...state.dadosGedip, dt_limite_execucao: action.payload }
      }
    default:
      return state;
  }

}


/*******     Actions     *******/

export const fetchGedips = ({ responseHandler }) => async (dispatch) => {

  try {
    let response = await apiModel.get("/ctrldiscp/gedips");

    dispatch({ type: types.CTRL_DISCP_FETCH_GEDIPS, payload: response.data });

    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }

}

export const fetchGedipsConcluidos = ({ params, responseHandler }) => async (dispatch) => {

  try {
    let response = await apiModel.get("/ctrldiscp/gedipsconcluidos", params);

    dispatch({ type: types.CTRL_DISCP_FETCH_GEDIPS, payload: response.data });

    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }

}

export const concluirGedip = ({ responseHandler }) => async (dispatch) => {

  try {
    let response = await apiModel.get("/ctrldiscp/gedips");

    dispatch({ type: types.CTRL_DISCP_FETCH_GEDIPS, payload: response.data });

    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }

}

export const fetchFunci = ({ matricula, responseHandler }) => async (dispatch) => {

  try {

    let response = await apiModel.get("/funci/" + matricula);
    let funci = response.data;

    if (!funci) {
      let error = new Error('Erro ao tentar Buscar Funci');
      throw error;
    }

    dispatch({ type: types.CTRL_DISCP_FUNCI_GEDIP, payload: { ...funci } });

    responseHandler.successCallback(true);
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage, 'fetchFunci');
  }

}

export const fillDadosNovaGedip = ({ dados, responseHandler }) => (dispatch, getState) => {
  try {

    dispatch({ type: types.CTRL_DISCP_FILL_DADOS_NOVA_GEDIP, payload: dados });

    responseHandler.successCallback("fillDadosNovaGedip");

  } catch (error) {

    let what = (error.response && error.response.data) ? error.response.data : null;;
    responseHandler.errorCallback(what, 'fillDadosNovaGedip');
  }
}

export const addGedip = ({ responseHandler }) => async (dispatch, getState) => {

  let response;
  let dadosGedip = getState().gedip.dadosGedip;
  let funcionarioGedip = getState().gedip.funcionarioGedip;
  let funciResp = getState().gedip.funciResp;
  dadosGedip.sexo = funcionarioGedip.sexo;

  try {

    response = await apiModel.post("/ctrldiscp/gedips", { dadosGedip, funcionarioGedip, funciResp });

    dispatch({ type: types.CTRL_DISCP_ADD_GEDIP, payload: response.data });

    responseHandler.successCallback("addGedip");

  } catch (error) {
    let what = (error.response && error.response.data) ? error.response.data : null;;
    responseHandler.errorCallback(what);
  }
}

export const fetchComites = ({ responseHandler }) => async (dispatch) => {
  try {
    let response = await apiModel.get("/ctrldiscp/comites");

    dispatch({ type: types.CTRL_DISCP_FETCH_COMITES, payload: response.data });

    responseHandler.successCallback('fetchingComites');
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage, 'fetchingComites');
  }
}

export const fetchMedidas = ({ responseHandler }) => async (dispatch) => {
  try {
    let response = await apiModel.get("/ctrldiscp/medidas");

    dispatch({ type: types.CTRL_DISCP_FETCH_MEDIDAS, payload: response.data });

    responseHandler.successCallback('fetchingMedidas');
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage, 'fetchingMedidas');
  }
}


export const fetchGedip = ({ responseHandler }) => (dispatch, getState) => {
  try {

    const resp = getState().gedip.dadosGedip;

    dispatch({ type: types.CTRL_DISCP_FETCH_GEDIP, payload: resp });

    responseHandler.successCallback('fetchingGedip');
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage, 'fetchingGedip');
  }
}

export const fillDadosDelegFunci = ({ dados, responseHandler }) => async (dispatch) => {
  try {

    let response = await apiModel.get("/funci/" + dados.chave_funci_resp);
    let funci = response.data;

    if (!funci) {
      let error = new Error('Erro ao tentar Buscar Funci');
      throw error;
    }

    funci = { ...funci, ...dados };

    dispatch({ type: types.CTRL_DISCP_FILL_DADOS_FUNCI_RESP, payload: { ...funci } });


    responseHandler.successCallback("fillDadosDelegFunci");

  } catch (error) {

    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage, 'fillDadosDelegFunci');
  }
}

export const delegarFunci = ({dados, responseHandler }) => async (dispatch, getState) => {

  try {

    await apiModel.post("/ctrldiscp/funcisresps", { ...dados });

    responseHandler.successCallback("delegarFunci");

  } catch (error) {

    let errorMessage = 'Erro na Delegação do Funcionário Responsável';

    responseHandler.errorCallback(errorMessage, 'delegarFunci');
  }
}


export const fillUploadedFile = ({ dadosDocumento, responseHandler }) => (dispatch) => {
  try {

    dispatch({ type: types.CTRL_DISCP_FILL_DADOS_ARQUIVO, payload: { ...dadosDocumento } });


    responseHandler.successCallback("fillUploadedFile");

  } catch (error) {

    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage, 'fillUploadedFile');
  }
}

export const enviarUploadedFile = ({ dados, responseHandler }) => async (dispatch, getState) => {

  let response;
  // let docEnv = getState().gedip.documentoEnviado;

  try {
    var formData = new FormData();
    formData.append('file', dados.file);
    formData.append('id_gedip', dados.id_gedip);

    response = await apiModel.post("/ctrldiscp/docsgedips", formData, {
      headers: {
        'Content-Type': 'multipart/form-data; boundary=12345678912345678;'
      }
    });

    dispatch({ type: types.CTRL_DISCP_FILL_DADOS_SEND_DADOS_ARQUIVO, payload: response.data });

    responseHandler.successCallback("enviarUploadedFile");

  } catch (error) {

    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage, 'enviarUploadedFile');
  }
}

export const downloadPdfDocumentos = ({ params, responseHandler }) => async (dispatch) => {

  try {

    let resposta = await apiModel.get(`/ctrldiscp/docsgedips/${params.id_gedip}`);

    dispatch({ type: types.CTRL_DISCP_FILL_DADOS_LINK_ARQUIVO, payload: resposta.data });

    responseHandler.successCallback("downloadPdfDocumentos");
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage, 'downloadPdfDocumentos');
  }
};

export const downloadPdfDocumentosEnviados = ({ responseHandler }) => async (dispatch, getState) => {

  try {
    let filePath = getState().gedip.linkPdf;

    let resposta = await apiModel.get('/ctrldiscp/downdocs/', {
      params: {
        filePdf: filePath
      },
      responseType: 'blob'
    }
    );

    BlobToURL('gedip.pdf', resposta.data);


    responseHandler.successCallback("downloadPdfDocumentosEnviados");
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage, 'downloadPdfDocumentosEnviados');
  }
};

export const downloadUploadedPdfDocumentos = ({ params, responseHandler }) => async (dispatch) => {

  try {

    let resposta = await apiModel.get('/ctrldiscp/updocs/', {
      params: params,
      responseType: 'blob'
    }
    );

    BlobToURL('gedip.pdf', resposta.data);

    responseHandler.successCallback("downloadPdfDocumentosEnviados");
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage, 'downloadPdfDocumentosEnviados');
  }
};

export const fetchIns = ({ dados, responseHandler }) => async (dispatch) => {

  try {

    let resposta = await apiModel.get('/ctrldiscp/in/', {
      params: { ins: dados }
    });

    dispatch({ type: types.CTRL_DISCP_FETCH_INS, payload: resposta.data });

    responseHandler.successCallback("fetchIns");
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage, 'Problema ao acessar a base de INs');
  }
};

export const enviarCobrancaGedip = ({ id_gedip, responseHandler }) => async () => {

  try {

    await apiModel.get('/ctrldiscp/cobranca/', {
      params: {
        id_gedip: id_gedip
      }
    });

    responseHandler.successCallback();
  } catch (error) {
    let errorMessage = null;

    if (error.response) {
      errorMessage = error.response.data;
    }

    responseHandler.errorCallback(errorMessage);
  }
};

export const confirmarGedip = () => async (dispatch, getState) => {

  try {
    let dadosGedip = getState().gedip.dadosGedip;
    let funcionarioGedip = getState().gedip.funcionarioGedip;
    let comites = getState().gedip.comites;
    let medidas = getState().gedip.medidas;

    if (!dadosGedip && !funcionarioGedip) {
      return new Promise((resolve, reject) => reject('Dados da Gedip não disponíveis!'))
    }

    let response = [];
    if (_.isNil(dadosGedip.gestor_envolvido)) {
      const resp = await apiModel.get('/ctrldiscp/resp', { params: { matricula: dadosGedip.funcionario_gedip, id_gedip: 0 } });
      response = resp.data;
    }

    const funciResp = response;
    dispatch({ type: types.CTRL_DISCP_FILL_DADOS_FUNCI_RESP, payload: funciResp });

    let nmComite = comites.filter(el => el.id_comite === dadosGedip.comite_gedip);
    let nmMedida = medidas.filter(el => el.id_medida === dadosGedip.id_medida);

    nmComite = nmComite[0];
    nmMedida = nmMedida[0];

    dadosGedip.nmComite = nmComite.nm_comite;
    dadosGedip.nmMedida = nmMedida.nm_medida;

    return ({ funciResp, dadosGedip, funcionarioGedip });

  } catch (error) {
    let msg = ExtractErrorMessage(error, 'Falha ao obter a resposta da ação solicitada!');
    return new Promise((resolve, reject) => reject(msg))
  }
}

export const dataLimiteResposta = (dataInicial) => async () => {
  try {
    // Completar o método
    let dataLimite = await apiModel.get('ctrldiscp/dtlmt', { params: { dataInicial } })
    const dtLt = dataLimite.data

    return new Promise(resolve => { resolve(dtLt) });

  } catch (error) {
    let msg = ExtractErrorMessage(error, 'Falha ao calcular a data Limite!');
    return new Promise((resolve, reject) => reject(msg))
  }
}

export const complementaGedip = (dados) => {
  return fetch(FETCH_METHODS.POST, "/ctrldiscp/complementagedip", { dados });
}

/****************************** fetch *************************************************/

export const getBulkSelectGedip = (dados) => {
  return fetch(FETCH_METHODS.GET, "/ctrldiscp/bulkgedip", { ...dados });
}

export const setBulkSelectGedip = (dados) => {
  return fetch(FETCH_METHODS.POST, "/ctrldiscp/bulkgedip", { ...dados });
}

export const getPrimGest = (prefixo) => {
  return fetch(FETCH_METHODS.GET, "ctrldiscp/getprimgest", { prefixo });
}

export const getAlineas = () => {
  return fetch(FETCH_METHODS.GET, "ctrldiscp/getalineas");
}