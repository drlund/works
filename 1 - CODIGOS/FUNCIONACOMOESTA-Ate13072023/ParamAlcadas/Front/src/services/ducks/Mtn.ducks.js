import apiModel from 'services/apis/ApiModel';
import _ from 'lodash';
import moment from 'moment';
import { DownloadFileUtil, ExtractErrorMessage } from 'utils/Commons';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';
import { arrayMesAtual } from 'utils/DateUtils';
/*******     Constants     *******/

//Tipos de interação do MTN com os funcionários
const interationType = {
  form: 'Formulário',
  esclarecimento: 'Esclarecimento',
};

/*******     Action Types     *******/

export const types = {
  //Funci
  FETCH_QUESTIONARIO: 'FETCH_QUESTIONARIO',
  RESPONDE_QUESTIONARIO: 'RESPONDE_QUESTIONARIO',
  FETCH_OCORRENCIAS: 'FETCH_OCORRENCIAS',

  // ADM
  FETCH_QUESTIONARIOS_ADM: 'FETCH_QUESTIONARIOS_ADM',
  FETCH_LOG_ACESSO: 'FETCH_LOG_ACESSO',
  FETCH_MTNS_EM_ANDAMENTO: 'FETCH_MTNS_EM_ANDAMENTO',
  FETCH_MTNS_FINALIZADOS: 'FETCH_MTNS_FINALIZADOS',
  FETCH_DADOS_BASICOS_MTN: 'FETCH_DADOS_BASICOS_MTN',
  FETCH_ENVOLVIDO: 'FETCH_ENVOLVIDO',
  FETCH_ENVOLVIDOS: 'FETCH_ENVOLVIDOS',
  FETCH_PARECERES_FINALIZADOS: 'FETCH_PARECERES_FINALIZADOS',
  FETCH_SOLICITACOES_PENDENTES: 'FETCH_SOLICITACOES_PENDENTES',
  FETCH_TIMELINE: 'FETCH_TIMELINE',
  SALVAR_ESCLARECIMENTO: 'SALVAR_ESCLARECIMENTO',
  FETCH_ESCLARECIMENTOS: 'FETCH_ESCLARECIMENTOS',
  SALVAR_TEXTO_PARECER: 'SALVAR_TEXTO_PARECER',
  UPDATE_ENVOLVIDO: 'UPDATE_ENVOLVIDO',
  REMOVE_ANEXO: 'REMOVE_ANEXO',
  FETCH_OCORRENCIAS_ADM: 'FETCH_OCORRENCIAS_ADM',
  FETCH_MEU_MTN: 'FETCH_MEU_MTN',
  UPDATE_ESCLARECIMENTOS: 'UPDATE_ESCLARECIMENTOS',
  UPDATE_ESCLARECIMENTOS_ADM: 'UPDATE_ESCLARECIMENTOS_ADM',
  UPDATE_ESCLARECIMENTO: 'UPDATE_ESCLARECIMENTO',
  UPDATE_STATUS_MTN: 'UPDATE_STATUS_MTN',
  DESMARCAR_ENVOLVIDO_PENDENTE: 'DESMARCAR_ENVOLVIDO_PENDENTE',
  PAINEL_DICOI_PRAZO: 'PAINEL_DICOI_PRAZO',
  PAINEL_DICOI_PRAZO_ANTERIOR: 'PAINEL_DICOI_PRAZO_ANTERIOR',
  PAINEL_DICOI_PERIODO: 'PAINEL_DICOI_PERIODO',
  PAINEL_DICOI_PERIODO_ANTERIOR: 'PAINEL_DICOI_PERIODO_ANTERIOR',
  PAINEL_DICOI_DATA: 'PAINEL_DICOI_DATA',
  PEOPLE_ANALITICS: 'PEOPLE_ANALITICS',
  QUESTIONARIO_INFO: 'QUESTIONARIO_INFO',
  NOTIFICACOES: 'NOTIFICACOES',
  MUDAR_VERSAO_ENVOLVIDO: 'MUDAR_VERSAO_ENVOLVIDO',
  MUDAR_VERSAO_MEU_ENVOLVIDO: 'MUDAR_VERSAO_MEU_ENVOLVIDO',
  REABRIR_MTN: 'REABRIR_MTN',
};

/*******     Estado Inicial     *******/

const initialState = {
  questionario: {
    titulo: '',
    respostas: [],
    respondidos: [],
  },
  admOcorrencias: {
    analises: {
      emAndamento: [],
      finalizados: [],
    },
    interacoesPendentes: [],
    questionarios: [],
    mtnAnalise: {
      dadosBasicos: {},
      envolvidos: [],
    },
    reversao: {
      pareceresFinalizados: [],
      solicitacoesPendentes: [],
    },
  },

  meuMtn: {
    emAndamento: { interacoesPendentes: [], mtns: [] },
    finalizadas: [],
    dadosMtn: {},
  },
  logsAcesso: [],
  painelDicoiPrazo: 15,
  painelDicoiPrazoAnterior: null,
  painelDicoiPeriodo: arrayMesAtual,
  painelDicoiPeriodoAnterior: [],
  painelDicoiData: {},
  peopleAnalitics: [],
  questionarioView: [],
  notificacoes: [],
};

/*******     Reducers     *******/

export default (state = initialState, action) => {
  let newState = _.cloneDeep(state);

  switch (action.type) {
    case types.FETCH_QUESTIONARIO: {
      newState.questionario = action.payload;
      return { ...newState };
    }
    case types.RESPONDE_QUESTIONARIO: {
      let respondidos = state.respondidos;
      let { idPergunta, idResposta, value } = action.payload;
      //Caso ainda não haja resposta, só incluí a nova resposta
      if (!respondidos) {
        respondidos = [action.payload];
      } else {
        let indexResposta = respondidos.findIndex((respondido) => {
          return (
            respondido.idPergunta === idPergunta &&
            respondido.idResposta === idResposta
          );
        });
        //Caso seja uma mudança substitui
        if (indexResposta >= 0) {
          respondidos[indexResposta].value = value;
          //Caso ainda não tenha respondido essa pergunta, inclui no array
        } else {
          respondidos.push(action.payload);
        }
      }
      return {
        ...state,
        respondidos,
      };
    }
    case types.FETCH_QUESTIONARIOS_ADM: {
      newState.admOcorrencias.questionarios = action.payload.map(
        (questionario) => {
          return {
            ...questionario,
            tipo: interationType[questionario.tipo],
          };
        },
      );
      return newState;
    }
    case types.FETCH_MTN_FUNCI: {
      newState.meuMtn = { ...newState.meuMtn, ...action.payload };
      return newState;
    }
    case types.FETCH_LOG_ACESSO: {
      let logs = action.payload.map((log) => {
        return {
          ...log,
          acessadoEm: moment(log.acessadoEm).format('DD/MM/YYYY HH:mm'),
        };
      });
      newState.admOcorrencias.logsAcesso = logs;
      return newState;
    }

    case types.SALVAR_TEXTO_PARECER: {
      return newState;
    }
    case types.FETCH_MTNS_EM_ANDAMENTO: {
      newState.admOcorrencias.analises.emAndamento = action.payload;
      return newState;
    }
    case types.FETCH_MTNS_FINALIZADOS: {
      newState.admOcorrencias.analises.finalizados = action.payload;
      return newState;
    }

    case types.FETCH_PARECERES_FINALIZADOS: {
      newState.admOcorrencias.reversao.pareceresFinalizados = action.payload;
      return newState;
    }

    case types.FETCH_SOLICITACOES_PENDENTES: {
      newState.admOcorrencias.reversao.solicitacoesPendentes = action.payload;
      return newState;
    }

    case types.FETCH_DADOS_BASICOS_MTN: {
      const { envolvidos, medidas, ...dadosBasicos } = action.payload;
      newState.admOcorrencias.mtnAnalise.envolvidos = envolvidos;
      newState.admOcorrencias.mtnAnalise.dadosBasicos = dadosBasicos;
      newState.admOcorrencias.mtnAnalise.medidas = medidas;
      return newState;
    }

    case types.FETCH_ENVOLVIDO: {
      newState.admOcorrencias.mtnAnalise.envolvidos.push(action.payload);
      return newState;
    }

    case types.MUDAR_VERSAO_ENVOLVIDO: {
      const { novosDados, indiceParaAlterar } = action.payload;
      newState.admOcorrencias.mtnAnalise.envolvidos =
        newState.admOcorrencias.mtnAnalise.envolvidos.map((envolvido, index) =>
          index === indiceParaAlterar ? novosDados : envolvido,
        );

      return newState;
    }

    case types.MUDAR_VERSAO_MEU_ENVOLVIDO: {
      const { novosDados } = action.payload;
      newState.meuMtn.dadosMtn = { ...novosDados };
      return newState;
    }

    case types.FETCH_ENVOLVIDOS: {
      newState.admOcorrencias.mtnAnalise.envolvidos = action.payload.map(
        (envolvido) => {
          return {
            ...envolvido,
            impedimentos: {
              ...envolvido.impedimentos,
            },
          };
        },
      );
      return newState;
    }

    case types.FETCH_ESCLARECIMENTOS: {
      const { idEnvolvido, esclarecimentos } = action.payload;
      const indexEnvolvido =
        newState.admOcorrencias.mtnAnalise.envolvidos.findIndex(
          (envolvido) => envolvido.idEnvolvido === idEnvolvido,
        );
      newState.admOcorrencias.mtnAnalise.envolvidos[
        indexEnvolvido
      ].esclarecimentos = esclarecimentos;

      return newState;
    }

    case types.FETCH_TIMELINE: {
      const { idEnvolvido, timeline } = action.payload;
      const indexEnvolvido =
        newState.admOcorrencias.mtnAnalise.envolvidos.findIndex(
          (envolvido) => envolvido.idEnvolvido === idEnvolvido,
        );
      newState.admOcorrencias.mtnAnalise.envolvidos[indexEnvolvido].timeline =
        timeline;

      return newState;
    }
    case types.UPDATE_ENVOLVIDO: {
      const { idEnvolvido } = action.payload;
      const indexEnvolvido =
        newState.admOcorrencias.mtnAnalise.envolvidos.findIndex(
          (envolvido) => envolvido.idEnvolvido === idEnvolvido,
        );

      newState.admOcorrencias.mtnAnalise.envolvidos[indexEnvolvido] = {
        ...newState.admOcorrencias.mtnAnalise.envolvidos[indexEnvolvido],
        ...action.payload,
      };

      return newState;
    }
    case types.FETCH_OCORRENCIAS: {
      const { interacoesPendentes, mtnsPendentes, mtnsFinalizados } =
        action.payload;
      newState.meuMtn.emAndamento.interacoesPendentes = interacoesPendentes;
      newState.meuMtn.emAndamento.mtns = mtnsPendentes;
      newState.meuMtn.finalizadas = mtnsFinalizados;
      return newState;
    }
    case types.UPDATE_STATUS_MTN: {
      const { idStatus, status } = action.payload;
      newState.admOcorrencias.mtnAnalise.dadosBasicos.idStatus = idStatus;
      newState.admOcorrencias.mtnAnalise.dadosBasicos.status = status;

      return newState;
    }

    case types.FETCH_MEU_MTN: {
      newState.meuMtn.dadosMtn = action.payload;
      return newState;
    }
    case types.UPDATE_ESCLARECIMENTOS: {
      newState.meuMtn.dadosMtn.dadosEnvolvido.esclarecimentosMeuMtn =
        action.payload;
      return newState;
    }
    case types.UPDATE_ESCLARECIMENTO: {
      const { id } = action.payload;
      let index =
        newState.meuMtn.dadosMtn.dadosEnvolvido.esclarecimentosMeuMtn.findIndex(
          (elem) => elem.id === id,
        );
      newState.meuMtn.dadosMtn.dadosEnvolvido.esclarecimentosMeuMtn[index] = {
        ...action.payload,
      };

      return newState;
    }

    case types.DESMARCAR_ENVOLVIDO_PENDENTE: {
      const { idEnvolvido } = action.payload;
      const indexEnvolvido =
        newState.admOcorrencias.mtnAnalise.envolvidos.findIndex(
          (envolvido) => envolvido.idEnvolvido === idEnvolvido,
        );

      newState.admOcorrencias.mtnAnalise.envolvidos[indexEnvolvido] = {
        ...newState.admOcorrencias.mtnAnalise.envolvidos[indexEnvolvido],
        pendenteEnvolvido: true,
      };
      return newState;
    }
    case types.UPDATE_ESCLARECIMENTOS_ADM: {
      const { idEnvolvido, esclarecimentos } = action.payload;
      const indexEnvolvido =
        newState.admOcorrencias.mtnAnalise.envolvidos.findIndex(
          (envolvido) => envolvido.idEnvolvido === idEnvolvido,
        );

      newState.admOcorrencias.mtnAnalise.envolvidos[indexEnvolvido] = {
        ...newState.admOcorrencias.mtnAnalise.envolvidos[indexEnvolvido],
        esclarecimentos,
      };
      return newState;
    }
    case types.REMOVE_ANEXO: {
      const { idAnexo } = action.payload;

      const indexEnvolvido =
        newState.admOcorrencias.mtnAnalise.envolvidos.findIndex((envolvido) => {
          return envolvido.idEnvolvido === action.payload.idEnvolvido;
        });

      const anexosFiltrados = newState.admOcorrencias.mtnAnalise.envolvidos[
        indexEnvolvido
      ].anexos.filter((anexo) => {
        return anexo.idAnexo !== idAnexo;
      });
      newState.admOcorrencias.mtnAnalise.envolvidos[indexEnvolvido] = {
        ...newState.admOcorrencias.mtnAnalise.envolvidos[indexEnvolvido],
        anexos: anexosFiltrados,
      };
      return newState;
    }
    case types.PAINEL_DICOI_PRAZO: {
      return {
        ...state,
        painelDicoiPrazo: action.payload,
      };
    }
    case types.PAINEL_DICOI_PRAZO_ANTERIOR: {
      return {
        ...state,
        painelDicoiPrazoAnterior: action.payload,
      };
    }
    case types.PAINEL_DICOI_PERIODO: {
      return {
        ...state,
        painelDicoiPeriodo: action.payload,
      };
    }
    case types.PAINEL_DICOI_PERIODO_ANTERIOR: {
      return {
        ...state,
        painelDicoiPeriodoAnterior: action.payload,
      };
    }
    case types.PAINEL_DICOI_DATA: {
      return {
        ...state,
        painelDicoiData: action.payload,
      };
    }
    case types.PEOPLE_ANALITICS: {
      return {
        ...state,
        peopleAnalitics: action.payload,
      };
    }
    case types.QUESTIONARIO_INFO: {
      return {
        ...state,
        questionarioView: action.payload,
      };
    }
    case types.NOTIFICACOES: {
      return {
        ...state,
        notificacoes: action.payload,
      };
    }
    default:
      return state;
  }
};

/*******     Actions     *******/

/**
 *
 * @param {dadosForm} dadosForm Objeto contendo as respostas ao formulário. As chaves são:
 *
 * idPergunta: identifca a qual perguntas do formulário a resposta se refere.
 * idResposta: Identifica o questionário através de um hash.
 * value: Valor respondido
 *
 *
 */

export const respondeQuestionario = ({ idPergunta, idResposta, value }) => {
  return {
    type: types.RESPONDE_QUESTIONARIO,
    payload: { idPergunta, idResposta, value },
  };
};

export const setPrazoPainelDicoi = (prazo) => (dispatch) => {
  dispatch({
    type: types.PAINEL_DICOI_PRAZO,
    payload: prazo,
  });
};

export const setPrazoAnterioPainelDicoi = (prazoAnterior) => (dispatch) => {
  dispatch({
    type: types.PAINEL_DICOI_PRAZO_ANTERIOR,
    payload: prazoAnterior,
  });
};

export const setPeriodoPainelDicoi = (periodo) => (dispatch) => {
  dispatch({
    type: types.PAINEL_DICOI_PERIODO,
    payload: periodo,
  });
};

export const setPeriodoAnteriorPainelDicoi =
  (periodoAnterior) => (dispatch) => {
    dispatch({
      type: types.PAINEL_DICOI_PERIODO_ANTERIOR,
      payload: periodoAnterior,
    });
  };

export const fetchPainelDicoi = (periodo, prazo) => async (dispatch) => {
  try {
    let response = await apiModel.get('/mtn/painelDicoi', {
      params: {
        periodo: periodo,
        prazo: prazo,
      },
    });

    if (!response) {
      return new Promise((resolve, reject) =>
        reject('Nenhum registro encontrado para os filtros informados.'),
      );
    }

    dispatch({
      type: types.PAINEL_DICOI_DATA,
      payload: response.data,
    });

    return new Promise((resolve) => {
      resolve(response.data);
    });
  } catch (error) {
    return new Promise((resolve, reject) =>
      reject('Não foi possível obter os dados.'),
    );
  }
};

export const fetchPeopleAnalitics = (idEnvolvido) => async (dispatch) => {
  try {
    let response = await apiModel.get('/mtn/adm/people-analitics', {
      params: {
        idEnvolvido: idEnvolvido,
      },
    });

    if (!response) {
      return new Promise((resolve, reject) =>
        reject('Nenhum registro encontrado.'),
      );
    }

    dispatch({
      type: types.PEOPLE_ANALITICS,
      payload: response.data,
    });

    return new Promise((resolve) => {
      resolve(response.data);
    });
  } catch (error) {
    return new Promise((resolve, reject) =>
      reject('Não foi possível obter os dados.'),
    );
  }
};

export const fetchQuestionarioInfo =
  (idEnvolvido, idMtn) => async (dispatch) => {
    try {
      let response = await apiModel.get('/mtn/adm/questionario-view', {
        params: {
          idEnvolvido: idEnvolvido,
          idMtn: idMtn,
        },
      });

      if (!response) {
        return new Promise((resolve, reject) =>
          reject('Nenhum registro encontrado.'),
        );
      }

      dispatch({
        type: types.QUESTIONARIO_INFO,
        payload: response.data,
      });

      return new Promise((resolve) => {
        resolve(response.data);
      });
    } catch (error) {
      return new Promise((resolve, reject) =>
        reject('Não foi possível obter os dados.'),
      );
    }
  };

export const fetchNotificacoes = (idEnvolvido) => async (dispatch) => {
  try {
    let response = await apiModel.get('/mtn/adm/notificacoes-analise', {
      params: {
        idEnvolvido: idEnvolvido,
      },
    });

    if (!response) {
      return new Promise((resolve, reject) =>
        reject('Nenhum registro encontrado.'),
      );
    }

    dispatch({
      type: types.NOTIFICACOES,
      payload: response.data,
    });

    return new Promise((resolve) => {
      resolve(response.data);
    });
  } catch (error) {
    return new Promise((resolve, reject) =>
      reject('Não foi possível obter os dados.'),
    );
  }
};

/**
 *
 *  Envia os questionários para o backend
 *
 * @param {responseHandler} responseHandler Objeto contendo as funções SuccessCallBck e ErrorCallback
 */

export const enviarQuestionario =
  (responseHandler) => async (dispatch, getState) => {
    try {
      let respondidos = getState().mtn.respondidos;
      let respostas = getState().mtn.questionario.respostas;

      const msgErro = 'Todos os campos deve ser preenchidos';

      //Verifica se alguma pergunta foi respondida
      //Primeiramente já verifica se a quantidade de perguntas é igual à quantidade de perguntas
      //Verifica se alguma das respostas está em branco
      if (
        !respondidos ||
        respostas.length !== respondidos.length ||
        respondidos.find((respondido) => respondido.value === '')
      ) {
        throw Error(msgErro);
      }

      for (let resposta of respostas) {
        let index = respondidos.find((respondido) => {
          return (
            respondido.idPergunta === resposta.id_pergunta &&
            respondido.idResposta === resposta.id_resposta
          );
        });

        //Quando não é encontrado o index é -1
        if (index < 0) {
          throw Error(msgErro);
        }
      }

      // let respondidos = getState().mtn.respondidos;

      await apiModel.post('/mtnForm/salvarRespostas', {
        respondidos,
      });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback(error);
    }
  };

/**
 *
 *  Recupera, do backend, um questionário para o funcionáŕio.
 *
 * @param {params} params Objeto que identifica o questionário, através da chave idResposta, e as callbacks a serem executadas através da
 *  chave responseHandler.
 */

export const fetchQuestionario =
  ({ idResposta, responseHandler }) =>
  async (dispatch, getState) => {
    try {
      let response = await apiModel.get('/mtnForm/' + idResposta);
      let questionario = response.data;
      dispatch({ type: types.FETCH_QUESTIONARIO, payload: questionario });
      responseHandler.successCallback('Recuperado com sucesso');
    } catch (error) {
      responseHandler.errorCallback(error.response);
    }
  };

export const fetchQuestionarioAdm =
  ({ idResposta, responseHandler }) =>
  async (dispatch, getState) => {
    try {
      let response = await apiModel.get('/mtn/adm/form-answer/' + idResposta);
      let questionario = response.data;
      dispatch({ type: types.FETCH_QUESTIONARIO, payload: questionario });
      responseHandler.successCallback('Recuperado com sucesso');
    } catch (error) {
      responseHandler.errorCallback(error.response);
    }
  };

/**
 *  Recupera os questionários pendentes de resposta de todos os funcionários
 *
 * @param {responseHandler} responseHandler Objeto contendo as funções SuccessCallBck e ErrorCallback
 *
 */

export const fetchQuestionariosAdm =
  ({ responseHandler }) =>
  async (dispatch, getState) => {
    try {
      let response = await apiModel.get('/mtn/adm/forms/pendentes');
      let questionarios = response.data;
      dispatch({ type: types.FETCH_QUESTIONARIOS_ADM, payload: questionarios });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback(error);
    }
  };

//TODO
export const fetchEsclarecimentosPendentes =
  ({ responseHandler }) =>
  async (dispatch, getState) => {
    try {
      // let response = await apiModel.get("/mtnForm/adm/pendentes");
      // let questionarios = response.data;
      dispatch({ type: types.FETCH_ESCLARECIMENTOS_ADM, payload: [] });
      // responseHandler.successCallback();
    } catch (error) {
      // responseHandler.errorCallback();
    }
  };

/**
 *  Função que recupera os MTNs e Questionários de um funcionario.
 *
 * @param {responseHandler} responseHandler Objeto contendo as funções SuccessCallBck e ErrorCallback
 *
 */
export const fetchOcorrencias =
  ({ tipo, responseHandler }) =>
  async (dispatch, getState) => {
    try {
      let response = await apiModel.get(`/mtn`);
      dispatch({ type: types.FETCH_OCORRENCIAS, payload: response.data });

      responseHandler.successCallback(tipo);
    } catch (error) {
      responseHandler.errorCallback(tipo);
    }
  };

export const incluirEnvolvido = (arrayFuncis, idMtn) => async () => {
  let arrayErros = [];
  let arrayIncluidos = [];
  if (!idMtn) {
    return new Promise((resolve, reject) =>
      reject(
        'Mtn não informado. Favor entrar em contato com o Administrador do Sistema',
      ),
    );
  }

  for (let funci of arrayFuncis) {
    const { matricula } = funci;
    if (!matricula) {
      arrayErros.push('Matrícula inválida');
    }

    try {
      let response = await apiModel.post(`/mtn/adm/envolvido/`, {
        matricula,
        idMtn,
      });
      let dadosEnvolvido = response.data;
      if (!dadosEnvolvido) {
        arrayErros.push(
          `Erro ao incluir o funcionário ${matricula} como envolvido. Caso o erro persista, favor entrar em contato com o Administrador do Sistema`,
        );
      }

      arrayIncluidos.push(dadosEnvolvido);
    } catch (error) {
      console.log(error.response.status);
      const msg =
        error.response.status === 400
          ? `Funcionário ${matricula} já é envolvido nesta ocorrência.`
          : `Erro ao incluir o funcionário ${matricula} como envolvido. Caso o erro persista, favor entrar em contato com o Administrador do Sistema`;
      arrayErros.push(msg);
    }
  }

  if (arrayErros.length > 0) {
    console.log('Deu erro.');

    return new Promise((resolve, reject) => {
      return reject([...arrayErros]);
    });
  }

  return new Promise((resolve, reject) => {
    return resolve({ ...arrayIncluidos });
  });
};

/**
 *
 *  Função que retorna log de acesso de um determinado funci a um questionário
 *
 * @param {dadosForm} dadosForm Dados para  identificar a qual questionário  do qual se deseja o log de acessos. Deve ter duas chaves
 * idResposta e matricula
 */

export const fetchLogsAcesso =
  ({ dadosForm, responseHandler }) =>
  async (dispatch, getState) => {
    try {
      let response = await apiModel.get(
        '/mtn/adm/logs/' + dadosForm.idResposta,
        {
          params: { matricula: dadosForm.matricula },
        },
      );
      let logs = response.data;
      dispatch({ type: types.FETCH_LOG_ACESSO, payload: logs });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback();
    }
  };

/**
 *  Recupera uma listagem de mtns.
 * @param {*} tipo Filtro do MTN entre em andamento ou finalizados
 *
 */
export const fetchMtns =
  ({ tipo, responseHandler, matricula }) =>
  async (dispatch, getState) => {
    if (
      matricula !== null &&
      (matricula.length !== 8 || matricula.search('_') > 0)
    ) {
      responseHandler.errorCallback('Matrícula Inválida');
      return;
    }

    try {
      let actionType =
        tipo === 'emAndamento'
          ? types.FETCH_MTNS_EM_ANDAMENTO
          : types.FETCH_MTNS_FINALIZADOS;

      let response =
        matricula === null
          ? await apiModel.get('/mtn/adm/' + tipo)
          : await apiModel.get('/mtn/adm/' + tipo, {
              params: {
                matricula,
              },
            });
      dispatch({ type: actionType, payload: response.data });
      responseHandler.successCallback();
    } catch (error) {
      console.log('Error');
      responseHandler.errorCallback(error);
    }
  };

export const getMeuMtn = async ({ idMtn, idEnvolvido }) => {
  const response = await apiModel.get('/mtn/' + idMtn, {
    params: {
      idEnvolvido,
    },
  });
  return response.data;
};

export const fetchMeuMtn =
  ({ idMtn, idEnvolvido, responseHandler }) =>
  async (dispatch) => {
    try {
      const response = await apiModel.get('/mtn/' + idMtn, {
        params: {
          idEnvolvido,
        },
      });
      dispatch({ type: types.FETCH_MEU_MTN, payload: response.data });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback(error.response);
    }
  };

/**
 *   Recupera os dados básicos de um MTN
 *
 */

export const fetchMtn =
  ({ idMtn, responseHandler }) =>
  async (dispatch) => {
    try {
      let response = await apiModel.get('/mtn/adm/analisar/' + idMtn);
      dispatch({ type: types.FETCH_DADOS_BASICOS_MTN, payload: response.data });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback();
    }
  };

export const criarLock =
  ({ idMtn, responseHandler }) =>
  async (dispatch) => {
    try {
      await apiModel.post('/mtn/adm/lock/' + idMtn);
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback();
    }
  };
export const avocarLock =
  ({ idMtn, responseHandler }) =>
  async (dispatch) => {
    try {
      await apiModel.patch('/mtn/adm/lock/' + idMtn);
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback();
    }
  };
export const liberarLock =
  ({ idMtn, responseHandler }) =>
  async (dispatch) => {
    try {
      await apiModel.delete('/mtn/adm/lock/' + idMtn);
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback();
    }
  };

export const fetchDadosEnvolvidos =
  ({ idMtn, responseHandler }) =>
  async (dispatch) => {
    try {
      let response = await apiModel.get('/mtn/adm/envolvidos/' + idMtn);

      dispatch({ type: types.FETCH_ENVOLVIDOS, payload: response.data });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback();
    }
  };

export const fetchDadosEnvolvido =
  ({ idEnvolvido, responseHandler }) =>
  async (dispatch) => {
    try {
      let response = await apiModel.get('/mtn/adm/envolvido/' + idEnvolvido);
      dispatch({ type: types.FETCH_ENVOLVIDO, payload: response.data });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback();
    }
  };

export const solicitarEsclarecimento =
  ({ idEnvolvido, txtEsclarecimento, responseHandler }) =>
  async (dispatch) => {
    try {
      let response = await apiModel.post(
        '/mtn/adm/envolvido/esclarecimento/' + idEnvolvido,
        { txtEsclarecimento, idEnvolvido },
      );

      dispatch({
        type: types.DESMARCAR_ENVOLVIDO_PENDENTE,
        payload: { idEnvolvido },
      });
      dispatch({
        type: types.UPDATE_ESCLARECIMENTOS_ADM,
        payload: { idEnvolvido, esclarecimentos: response.data },
      });
      responseHandler.successCallback(response);
    } catch (error) {
      responseHandler.errorCallback('Não foi possível salvar o esclarecimento');
    }
  };

export const fetchMtnStatus =
  ({ idMtn, responseHandler }) =>
  async (dispatch) => {
    try {
      let response = await apiModel.get('/mtn/adm/status/' + idMtn);
      dispatch({
        type: types.UPDATE_STATUS_MTN,
        payload: { ...response.data },
      });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback('Não foi possível atualizar o status');
    }
  };

export const prorrogarEsclarecimento =
  ({ idEsclarecimento, responseHandler }) =>
  async (dispatch) => {
    try {
      let response = await apiModel.put(
        '/mtn/prorrogar-esclarecimento/' + idEsclarecimento,
      );

      dispatch({ type: types.UPDATE_ESCLARECIMENTO, payload: response.data });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback('Não foi possível solicitar a prorrogação');
    }
  };

export const salvarDadosForaAlcance = async (dadosForaAlcance) => {
  const { tipoComplemento, idMtn, observacao, arquivos, listaForaAlcance } =
    dadosForaAlcance;

  try {
    var formData = new FormData();
    for (let arquivo of arquivos) {
      formData.append('files', arquivo.originFileObj);
    }
    formData.append('observacao', observacao);
    formData.append('idMtn', idMtn);
    formData.append('tipoComplemento', tipoComplemento);
    formData.append('listaForaAlcance', JSON.stringify(listaForaAlcance));

    await apiModel.post('/mtn/adm/foraAlcance/' + idMtn, formData, {
      headers: {
        'Content-Type': 'multipart/form-data; boundary=500;',
      },
    });

    return new Promise((resolve, reject) => resolve('Salvo com sucesso'));
  } catch (error) {
    return new Promise((resolve, reject) =>
      reject('Erro ao salvar o complemento'),
    );
  }
};

export const salvarParecer =
  ({
    idEnvolvido,
    txtParecer,
    medida,
    arquivos,
    finalizar,
    finalizarSemConsultarDedip,
    nrGedip,
    responseHandler,
  }) =>
  async (dispatch) => {
    try {
      var formData = new FormData();
      for (let arquivo of arquivos) {
        formData.append('files', arquivo);
      }
      formData.append('txtParecer', txtParecer);
      formData.append('idEnvolvido', idEnvolvido);
      formData.append('idMedida', medida);
      if (nrGedip) {
        formData.append('nrGedip', nrGedip);
      }
      formData.append('finalizar', JSON.stringify(finalizar));
      formData.append(
        'finalizarSemConsultarDedip',
        JSON.stringify(finalizarSemConsultarDedip),
      );
      let response = await apiModel.post(
        '/mtn/adm/envolvido/parecer/' + idEnvolvido,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data; boundary=500;',
          },
        },
      );
      dispatch({ type: types.UPDATE_ENVOLVIDO, payload: response.data });
      responseHandler.successCallback(response.data);
    } catch (error) {
      const { status } = error.response;

      if (status === 400) {
        responseHandler.errorCallback(error.response.data);
      } else {
        responseHandler.errorCallback('Não foi possível salvar a análise');
      }
    }
  };

export const responderRecurso =
  ({ txt, fileList, identificador }) =>
  async (dispatch) => {
    try {
      var formData = new FormData();
      for (let arquivo of fileList) {
        formData.append('files', arquivo);
      }
      formData.append('txtRecurso', txt);

      let response = await apiModel.patch(
        '/mtn/recurso/' + identificador,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data; boundary=500;',
          },
        },
      );
      dispatch({ type: types.FETCH_MEU_MTN, payload: response.data });
      return new Promise((resolve) => {
        resolve();
      });
    } catch (error) {
      let msg = ExtractErrorMessage(error, 'Falha ao salvar recurso!');
      return new Promise((resolve, reject) => reject(msg));
    }
  };

export const salvarEsclarecimento =
  ({ idEsclarecimento, txtEsclarecimento, arquivos, responseHandler }) =>
  async (dispatch) => {
    try {
      var formData = new FormData();
      for (let arquivo of arquivos) {
        formData.append('files', arquivo);
      }
      formData.append('txtEsclarecimento', txtEsclarecimento);

      let response = await apiModel.post(
        '/mtn/esclarecimento/' + idEsclarecimento,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data; boundary=500;',
          },
        },
      );
      dispatch({ type: types.UPDATE_ESCLARECIMENTOS, payload: response.data });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback('Não foi possível salvar a análise');
    }
  };

export const fetchEsclarecimentos =
  ({ idEnvolvido, responseHandler }) =>
  async (dispatch) => {
    try {
      let response = await apiModel.get(
        '/mtn/adm/envolvido/esclarecimentos/' + idEnvolvido,
        { idEnvolvido },
      );
      dispatch({
        type: types.FETCH_ESCLARECIMENTOS,
        payload: { esclarecimentos: response.data, idEnvolvido },
      });
      responseHandler.successCallback(response);
    } catch (error) {
      responseHandler.errorCallback('Não foi possível salvar o esclarecimento');
    }
  };

export const fetchTimeline =
  ({ idEnvolvido, responseHandler }) =>
  async (dispatch) => {
    try {
      let response = await apiModel.get(
        '/mtn/adm/envolvido/timeline/' + idEnvolvido,
        { idEnvolvido },
      );
      dispatch({
        type: types.FETCH_TIMELINE,
        payload: { timeline: response.data, idEnvolvido },
      });
      responseHandler.successCallback(response);
    } catch (error) {
      responseHandler.errorCallback('Não foi possível salvar o esclarecimento');
    }
  };
export const fetchSolicitacoesPendentes = () => async (dispatch) => {
  try {
    const response = await apiModel.get('/mtn/adm/alterar-medidas/pendentes');
    dispatch({
      type: types.FETCH_SOLICITACOES_PENDENTES,
      payload: response.data,
    });
    return new Promise((resolve) => {
      resolve();
    });
  } catch (error) {
    let msg = ExtractErrorMessage(
      error,
      'Falha ao obter os dados de acompanhamento da ordem solicitada!',
    );
    return new Promise((resolve, reject) => reject(msg));
  }
};

export const fetchPareceresFinalizados = async (filtros, dispatch) => {
  try {
    const filtrosValidos = [
      'matriculaEnvolvido',
      'periodoInicio',
      'periodoFim',
      'matriculaAnalista',
      'nrMtn',
    ];

    for (let filtro in filtros) {
      if (!filtrosValidos.includes(filtro)) {
        return new Promise((resolve, reject) => reject('Filtro Inválido'));
      }
    }
    const response = await apiModel.get('/mtn/adm/ocorrencias-finalizadas/', {
      params: filtros,
    });
    dispatch({
      type: types.FETCH_PARECERES_FINALIZADOS,
      payload: response.data,
    });
    return new Promise((resolve) => {
      resolve();
    });
  } catch (error) {
    let msg = ExtractErrorMessage(
      error,
      'Falha ao obter os dados de acompanhamento da ordem solicitada!',
    );
    return new Promise((resolve, reject) => reject(msg));
  }
};

export const confirmarAlteracaoMedida = async (idSolicitacao) => {
  try {
    if (!idSolicitacao) {
      return new Promise((resolve, reject) =>
        reject('É obrigatório informar qual a solicitação desejada'),
      );
    }

    await apiModel.patch(`/mtn/adm/alterar-medida/finalizar/${idSolicitacao}`);
    return new Promise((resolve) => {
      resolve();
    });
  } catch (error) {
    let msg = ExtractErrorMessage(
      error,
      'Falha ao solicitar reversão do parecer',
    );
    return new Promise((resolve, reject) => reject(msg));
  }
};

export const cancelarSolicitacao = async (idSolicitacao) => {
  try {
    if (!idSolicitacao) {
      return new Promise((resolve, reject) =>
        reject('Informar a justificativa e o envolvido são obrigatórios'),
      );
    }
    await apiModel.delete(`/mtn/adm/alterar-medida/${idSolicitacao}`);
    return new Promise((resolve) => {
      resolve();
    });
  } catch (error) {
    let msg = ExtractErrorMessage(
      error,
      'Não foi possível cancelar a solicitação.',
    );
    return new Promise((resolve, reject) => reject(msg));
  }
};

export const solicitarAlteracaoMedida = async (
  { idEnvolvido, txtJustificativa, listaAnexos, novaMedida },
  dispatch,
) => {
  try {
    if (!txtJustificativa || !idEnvolvido) {
      return new Promise((resolve, reject) =>
        reject('Informar a justificativa e o envolvido são obrigatórios'),
      );
    }
    var formData = new FormData();
    for (let arquivo of listaAnexos) {
      formData.append('files', arquivo);
    }
    formData.append('idEnvolvido', idEnvolvido);
    formData.append('novaMedida', novaMedida);
    formData.append('txtJustificativa', txtJustificativa);
    await apiModel.post('/mtn/adm/alterar-medida/solicitar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data; boundary=500;',
      },
    });
    dispatch({
      type: types.FETCH_PARECERES_FINALIZADOS,
      payload: [],
    });
    return new Promise((resolve) => {
      resolve();
    });
  } catch (error) {
    let msg = ExtractErrorMessage(
      error,
      'Falha ao solicitar reversão do parecer',
    );
    return new Promise((resolve, reject) => reject(msg));
  }
};

export const removeAnexo =
  ({ idAnexo, idEnvolvido, responseHandler }) =>
  async (dispatch) => {
    try {
      await apiModel.delete('/mtn/adm/anexos/' + idAnexo);
      dispatch({
        type: types.REMOVE_ANEXO,
        payload: { idAnexo, idEnvolvido },
      });
      responseHandler.successCallback();
    } catch (error) {
      let what =
        error.response && error.response.data ? error.response.data : null;
      responseHandler.errorCallback(what);
    }
  };

const _downloadAnexoService = async ({
  idAnexo,
  fileName,
  responseHandler,
}) => {
  try {
    let response = await apiModel.get('/mtn/adm/anexos/download/' + idAnexo, {
      responseType: 'blob',
    });
    DownloadFileUtil(fileName, response.data);
    responseHandler.successCallback();
  } catch (error) {
    let what =
      error.response && error.response.data ? error.response.data : null;
    responseHandler.errorCallback(what);
  }
};

export const downloadAnexo = (downloadParams) => async () => {
  _downloadAnexoService(downloadParams);
};

export const downloadAnexoSemRedux = async (downloadParams) => {
  _downloadAnexoService(downloadParams);
};

//  ================= APIS Calls =================

// Versão por fora do redux
export const getStatusMtn = ({ idMtn }) => {
  return fetch(FETCH_METHODS.GET, `mtn/adm/status/${idMtn}`);
};

export const fetchMedidas = () => {
  return fetch(FETCH_METHODS.GET, 'mtn/adm/medidas');
};

export const fetchVisoes = () => {
  return fetch(FETCH_METHODS.GET, 'mtn/adm/visoes');
};

export const fetchAcoes = () => {
  return fetch(FETCH_METHODS.GET, 'mtn/adm/acoes');
};

export const fetchStatus = () => {
  return fetch(FETCH_METHODS.GET, 'mtn/adm/status');
};

export const fetchPendentesSuper = async (somenteUsuario) => {
  try {
    let response = await apiModel.get('/mtn/adm/pendentes-super', {
      params: {
        somenteUsuario,
      },
    });
    return new Promise((resolve) => resolve(response.data));
  } catch (error) {
    return new Promise((resolve, reject) =>
      reject('Não foi possível recuperar as ocorrências pendentes da super'),
    );
  }
};

export const finalizarMtnSemEnvolvido = async (
  dadosMtnFinalizadoSemEnvolvido,
) => {
  const camposForm = [
    'complemento',
    'idMtn',
    'observacao',
    'possuiComplemento',
    'tipoEncerramento',
  ];

  var formData = new FormData();
  for (const campo of camposForm) {
    if (dadosMtnFinalizadoSemEnvolvido[campo]) {
      formData.append(
        campo,
        JSON.stringify(dadosMtnFinalizadoSemEnvolvido[campo]),
      );
    }
  }

  const { anexos, idMtn } = dadosMtnFinalizadoSemEnvolvido;
  if (anexos) {
    if (anexos.fileList) {
      for (let anexo of anexos.fileList) {
        formData.append('files', anexo.originFileObj);
      }
    }
  }

  try {
    await apiModel.patch(
      `/mtn/adm/finalizar-sem-envolvido/${idMtn}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data; boundary=500;',
        },
      },
    );
    return new Promise((resolve, reject) =>
      resolve('Mtn finalizado com sucesso'),
    );
  } catch (error) {
    return new Promise((resolve, reject) => reject(error));
  }
};

export const atualizarPrazos = async (dados) => {
  try {
    let response = await apiModel.put(`/mtn/adm/atualizar-config-prazos/`, {
      prazos: { ...dados },
    });
    return new Promise((resolve) => resolve(response.data));
  } catch (error) {
    return new Promise((resolve, reject) =>
      reject('Erro ao salvar os dados dos prazos'),
    );
  }
};

export const getConfigPrazos = async () => {
  try {
    let response = await apiModel.get(`/mtn/adm/get-config-prazos/`);
    return new Promise((resolve) => resolve(response.data));
  } catch (error) {
    return new Promise((resolve, reject) =>
      reject('Erro ao recuperar os prazos'),
    );
  }
};

export const getIdMtn = async (nrMtn) => {
  try {
    let response = await apiModel.get(`/mtn/adm/getId/${nrMtn}`);
    return new Promise((resolve) => resolve(response.data));
  } catch (error) {
    return new Promise((resolve, reject) => reject('Mtn não encontrado'));
  }
};

export const getMtnByOcorrencia = async (nrOcorrencia) => {
  try {
    let response = await apiModel.get(
      `/mtn/adm/getIdByOcorrencia/${nrOcorrencia}`,
    );
    return new Promise((resolve) => resolve(response.data));
  } catch (error) {
    return new Promise((resolve, reject) => reject('Mtn não encontrado'));
  }
};

export const filtrarOcorrenciasMtn = async (filtros, paginationParams) => {
  try {
    let response = await apiModel.get('/mtn/adm/filtrar-envolvidos', {
      params: {
        filtros: { ...filtros },
        pagination: { ...paginationParams },
      },
    });
    return new Promise((resolve) => resolve(response.data));
  } catch (error) {
    return new Promise((resolve, reject) =>
      reject('Não foi possível filtrar as ocorrencias'),
    );
  }
};

export const getNotificacoesFilaEnvio = async (dadosPesquisa) => {
  return fetch(FETCH_METHODS.GET, 'mtn/adm/notificacoes-fila-envio', {
    ...dadosPesquisa,
  });
};

export const fetchAusenciasFunci = ({ matricula, periodo }) => {
  return fetch(FETCH_METHODS.GET, `mtn/adm/funci-ausencias/${matricula}`, {
    periodo,
  });
};

export const getEnvolvido = (idEnvolvido) =>
  fetch(FETCH_METHODS.GET, `/mtn/adm/envolvido/${idEnvolvido}`);

export const filtrarVisaoAssessor = async (filtros, paginationParams) => {
  try {
    let response = await apiModel.get('/mtn/adm/filtrar-visao-assessor', {
      params: {
        filtros: { ...filtros },
        pagination: { ...paginationParams },
      },
    });
    return new Promise((resolve) => resolve(response.data));
  } catch (error) {
    return new Promise((resolve, reject) =>
      reject('Não foi possível filtrar as ocorrencias'),
    );
  }
};

export const incluirMonitoramento = (dadosMonitoramento) => {
  return fetch('post', `mtn/adm/incluir-monitoramento/`, dadosMonitoramento);
};
