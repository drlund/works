/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import apiModel from 'services/apis/ApiModel';
import { HandleErrorResponse, DownloadFileUtil } from 'utils/Commons';
import moment from 'moment';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

/** Acões da Ferramenta */
export const Acoes = {
  IncluirSolic: 1,
  AlterarSolic: 2,
  CancelarSolic: 3,
  EnviarParaVotacao: 4,
  RegistrarVoto: 5,
  DevolverSolic: 8,
};

/** *****     Hash de Perguntas     ****** */
/* Utilizado para saber qual pergunta específica está vindo do bd  */
export const hashPerguntas = {
  NomeEvento: 'nomeEvento',
  DataInicioEvento: 'dataInicioEvento',
  DataFimEvento: 'dataFimEvento',
  ValorPatrocinio: 'valorPatrocinio',
  ValorAcaoPromocional: 'valorAcaoPromocional',
  Recorrencia: 'recorrencia',
  AutorizSECOM: 'autorizacaoSECOM',
  Briefing: 'briefing',
  FunciContato: 'funciContato',
};

/** *****     Tipo de Arquivos     ****** */
export const tipoArquivos = {
  AutDimac: 8,
  Briefing: 57,
};

export const tipoCampoResposta = {
  textArea: 2,
  radio: 4,
  simNaoSubperguntas: 17,
  nrMKT: 21,
  radioSubperguntas: 22,
};

export const statusSolicitacao = {
  emAndamento: 1,
  concluido: 2,
};

/** *****     Action Types     ****** */
export const types = {
  PATROCINIOS_GET_ARQUIVOS: 'PATROCINIOS_GET_ARQUIVOS',
  PATROCINIOS_CHANGE_FILE_LIST: 'PATROCINIOS_CHANGE_FILE_LIST',
  PATROCINIOS_CHANGE_RECORRENCIA_SELECIONADA:
    'PATROCINIOS_CHANGE_RECORRENCIA_SELECIONADA',
  PATROCINIOS_VISIBLE_FORM_RECORRENCIA: 'PATROCINIOS_VISIBLE_FORM_RECORRENCIA',
  PATROCINIOS_CHANGE_CAMPOS_RESPOSTA: 'PATROCINIOS_CHANGE_CAMPOS_RESPOSTA',
};

/** *****     Reducers     ****** */
const initialState = {
  arquivos: {},
  camposResposta: {},
  recorrenciaSelecionada: '',
  visibleFormRecorrencia: false,
};

// eslint-disable-next-line default-param-last
export default (state = initialState, action) => {
  switch (action.type) {
    case types.PATROCINIOS_GET_ARQUIVOS:
      return {
        ...state,
        arquivos: action.payload,
      };
    case types.PATROCINIOS_CHANGE_FILE_LIST:
      return {
        ...state,
        arquivos: {
          ...state.arquivos,
          [action.idTipoArquivo]: action.payload,
        },
      };
    case types.PATROCINIOS_CHANGE_CAMPOS_RESPOSTA:
      return {
        ...state,
        camposResposta: {
          ...state.camposResposta,
          [action.idTipoOpcao]: action.payload,
        },
      };
    case types.PATROCINIOS_CHANGE_RECORRENCIA_SELECIONADA:
      return {
        ...state,
        recorrenciaSelecionada: action.payload,
      };
    case types.PATROCINIOS_VISIBLE_FORM_RECORRENCIA:
      return {
        ...state,
        visibleFormRecorrencia: action.payload,
      };
    default:
      return state;
  }
};

/** *****     Actions     ****** */
export const dispatchArquivos = (solicitacao) => (dispatch) => {
  if (solicitacao) {
    const { arquivos } = solicitacao;
    if (arquivos) {
      dispatch({ type: types.PATROCINIOS_GET_ARQUIVOS, payload: arquivos });
    }
  }
};

export const changeRecorrenciaSelecionada = (recorrenciaSelecionada) => (dispatch) => {
  dispatch({
    type: types.PATROCINIOS_CHANGE_RECORRENCIA_SELECIONADA,
    payload: recorrenciaSelecionada,
  });
};

export const setVisibleFormRecorrencia = (visible) => (dispatch) => {
  dispatch({
    type: types.PATROCINIOS_VISIBLE_FORM_RECORRENCIA,
    payload: visible,
  });
};

/** *****     Funções Comuns     ****** */
export const getTpSolic = async ({ responseHandler }) => {
  try {
    const response = await apiModel.get('/patrocinios/tpSolic');
    responseHandler.successCallback(response.data);
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
};

export const getPerguntas = async ({
  idTipoSolicitacao,
  idSolicitacao,
  sequencial,
  readOnly,
  responseHandler,
}) => {
  try {
    const url = readOnly
      ? '/patrocinios/formReadOnly'
      : '/patrocinios/formulario';

    const response = await apiModel.get(url, {
      params: { idTipoSolicitacao, sequencial, idSolicitacao },
    });
    responseHandler.successCallback(response.data);
  } catch (error) {
    responseHandler.errorCallback(error.response);
  }
};

export const getRecorrencia = async ({ responseHandler, prefixo }) => {
  try {
    const response = await apiModel.get('/patrocinios/recorrencia', {
      params: { prefixo },
    });
    responseHandler.successCallback(response.data);
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
};

export const getPrefAut = async ({ responseHandler }) => {
  try {
    const response = await apiModel.get('/patrocinios/prefAut');
    responseHandler.successCallback(response.data);
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
};

export const gravaSolic = async ({ solicitacao, responseHandler }) => {
  try {
    const formData = setFormData(solicitacao);
    await apiModel.post('/patrocinios/gravaSolic', formData, {
      headers: { 'Content-Type': 'multipart/form-data; boundary=500;' },
    });
    responseHandler.successCallback();
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
};

export const gravaGestao = async ({ solicitacao, responseHandler }) => {
  try {
    const formData = setFormData(solicitacao);
    await apiModel.post('/patrocinios/gravaGestao', formData, {
      headers: { 'Content-Type': 'multipart/form-data; boundary=500;' },
    });
    responseHandler.successCallback();
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
};

export const alteraSolic = async ({ solicitacao, responseHandler }) => {
  try {
    const formData = setFormData(solicitacao);
    const response = await apiModel.patch(
      '/patrocinios/alteraSolic',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data; boundary=500;' } },
    );

    responseHandler.successCallback(response.data);
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
};

export const getSolic = async ({ filtro, idSolicitacao, responseHandler }) => {
  try {
    const response = await apiModel.get('/patrocinios/solicitacoes', {
      params: { filtro, idSolicitacao },
    });
    responseHandler.successCallback(response.data);
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
};

export const getSolicEmVotacao = async ({ responseHandler }) => {
  try {
    const response = await apiModel.get('/patrocinios/emVotacao');
    responseHandler.successCallback(response.data);
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
};

export const gravaVotos = async ({ votos, responseHandler }) => {
  try {
    const response = await apiModel.post('/patrocinios/gravaVoto', votos);
    responseHandler.successCallback(response.data);
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
};

export const getArquivo = async ({
  idSolicitacao,
  idTipoArquivo,
  readOnly,
  responseHandler,
}) => {
  try {
    const url = readOnly ? '/patrocinios/fileReadOnly' : '/patrocinios/arquivo';

    const response = await apiModel.get(url, {
      params: { idSolicitacao, idTipoArquivo },
    });
    responseHandler.successCallback(response.data);
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
};

export const fetchFases = async (idSolicitacao) => fetch(FETCH_METHODS.GET, '/patrocinios/fases', idSolicitacao);

export const fetchHistorico = async (idSolicitacao) => fetch(FETCH_METHODS.GET, '/patrocinios/historico', idSolicitacao);

export const fetchEquipeComunicacao = async () => fetch(FETCH_METHODS.GET, '/patrocinios/EquipeComunicacao');

export const gravaRespAnalise = async (idSolicitacao) => fetch(
  FETCH_METHODS.POST,
  '/patrocinios/gravaRespAnalise',
  idSolicitacao,
);

/* Identifica qual id da pergunta referente ao hash passado como parâmetro */
export const getIdPergunta = (perguntas, hashPergunta) => perguntas
  . find((pergunta) => pergunta.hashPergunta === hashPergunta);

export const strMoedaToNumber = (strMoeda) => Number(strMoeda.replace('R$ ', '').replace('.', '').replace(',', '.'));

export const checkDtEventoForaPrazo = (tipoSolicitacao, dtEvento) => {
  try {
    if (dtEvento) {
      const diffDays = dtEvento.diff(moment(), 'days'); // Quantidade de dias até a data do evento
      return tipoSolicitacao.prazoAntecedente > diffDays;
    }

    return false;
  } catch (error) {
    return { error: 'Erro ao verificar prazo de antecedência da solicitação.' };
  }
};

const setFormData = (solicitacao) => {
  const formData = new FormData();

  for (const elem in solicitacao) {
    formData.append(elem, JSON.stringify(solicitacao[elem]));
    if (elem === 'respostas') {
      for (const field in solicitacao[elem]) {
        if (field.substring(0, 4) === 'file') {
          solicitacao[elem][field].forEach((file) => {
            formData.append(field, file);
          });
        }
      }
    }
  }

  return formData;
};

/**
 * Faz o download dos dados recebidos como parâmetro.
 */
export const downloadDados = ({ filtro, fileName, responseHandler }) => async () => {
  try {
    const response = await apiModel.get('/patrocinios/exportar', {
      params: { filtro: JSON.stringify(filtro) },
      responseType: 'blob',
    });

    DownloadFileUtil(fileName, response.data);
    responseHandler.successCallback();
  } catch (error) {
    const what = error.response && error.response.data
      ? error.response.data
      : 'Falha ao exportar os dados.';
    responseHandler.errorCallback(what);
  }
};
