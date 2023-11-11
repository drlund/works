import apiModel from 'services/apis/ApiModel';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';
import { DownloadFileUtil } from 'utils/Commons';

/** *****     Action Types     ****** */
export const types = {
  TIPOS_MOVIMENTACAO: 'DESIGNACAO_TIPOS_MOVIMENTACAO',
  TIPO_MOVIMENTACAO: 'DESIGNACAO_TIPO_MOVIMENTACAO',
  VALIDAR_VAGA: 'DESIGNACAO_VALIDAR_VAGA',
  VALIDAR_FUNCI: 'DESIGNACAO_VALIDAR_FUNCI',
  DADOS_VAGA: 'DESIGNACAO_DADOS_VAGA',
  DADOS_FUNCI: 'DESIGNACAO_DADOS_FUNCI',
  ANALISE: 'DESIGNACAO_ANALISE',
  DESIG_ADD: 'DESIGNACAO_DESIG_ADD',
  SHOW_PENDENCIAS: 'DESIGNACAO_SHOW_PENDENCIAS',
  INI_FIM: 'DESIGNACAO_INI_FIM',
  INI_FIM_DESIG: 'DESIGNACAO_INI_FIM_DESIG',
  PROTOCOLO: 'DESIGNACAO_PROTOCOLO',
  NOVO: 'DESIGNACAO_NOVO',
  CADEIA: 'DESIGNACAO_CADEIA',
  NEGATIVAS: 'DESIGNACAO_NEGATIVAS',
};

/** *****     Reducers     ****** */
const initialState = {
  destino: {},
  origem: {},
  dadosVaga: '',
  dadosFunci: '',
  dadosAnalise: '',
  tipos: '',
  tipo: '',
  iniDesig: '',
  fimDesig: '',
  dt_ini: '',
  dt_fim: '',
  dias_uteis: '',
  dias_totais: '',
  protocolo: '',
  negativas: '',
};
/** *****     Actions     ****** */

// Método que retorna os dados básicos de cada tipo de movimentaçao interina
// para preenchimento das abas e informações básicas de cada tipo.
export const getTiposMovimentacao = () => async (dispatch) => {
  try {
    const response = await apiModel.get('/desigint/tipos/');

    if (!response) {
      return Promise.reject('Nenhum registro encontrado para os dados informados.');
    }

    dispatch({ type: types.TIPOS_MOVIMENTACAO, payload: response.data });

    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject('Falha ao obter os dados dos tipos de movimentação.');
  }
};

// Método que ajusta o tipo atual da movimentação
export const setTipo = (tipo) => (dispatch) => {
  try {
    dispatch({ type: types.TIPO_MOVIMENTACAO, payload: tipo });

    return Promise.resolve(tipo);
  } catch (error) {
    return Promise.reject('Falha ao obter os dados dos tipos de movimentação.');
  }
};

export const fetchPrefixos = (prefixo) => async () => {
  try {
    const response = await apiModel.get(
      '/matcheddependencias/',
      { params: { prefixo } }
    );

    const responseData = response.data;

    if (!responseData) {
      return Promise.reject('Nenhum registro encontrado para os dados informados.');
    }

    return Promise.resolve(responseData);
  } catch (error) {
    return Promise.reject('Falha ao obter os dados dos prefixos.');
  }
};

export const validarVaga = () => async (dispatch, getState) => {
  try {
    const { dadosVaga } = getState().designacao;

    const response = await apiModel.post(
      '/desigint/getDestino',
      { dadosVaga }
    );

    const destino = response.data;

    dispatch({ type: types.VALIDAR_VAGA, payload: destino });

    return Promise.resolve(destino);
  } catch (error) {
    return Promise.reject('Falha ao gravar os dados!');
  }
};

export const validarFunci = (dadosFunci) => async (dispatch) => {
  try {
    dispatch({ type: types.VALIDAR_FUNCI, payload: dadosFunci });

    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject('Falha ao gravar os dados!');
  }
};

export const getVagaValidada = () => async (dispatch, getState) => {
  try {
    const { vagaValidada } = getState().designacao;

    return Promise.resolve(vagaValidada);
  } catch (error) {
    return Promise.reject('Falha ao gravar os dados!');
  }
};

export const getFunciValidado = () => async (dispatch, getState) => {
  try {
    const { funciValidado } = getState().designacao;

    return Promise.resolve(funciValidado);
  } catch (error) {
    return Promise.reject('Falha ao gravar os dados!');
  }
};

export const getOptsBasicas = (dados) => async () => {
  try {
    const response = await apiModel.get(
      '/desigint/optsbasicas/',
      { params: { dados } }
    );

    const responseData = response.data;

    if (!responseData) {
      return Promise.reject('Nenhum registro encontrado para os dados informados.');
    }

    return Promise.resolve(responseData);
  } catch (error) {
    return Promise.reject('Falha ao obter os dados das opções.');
  }
};

export const setDadosVaga = (dados) => (dispatch) => {
  dispatch({ type: types.DADOS_VAGA, payload: dados });

  return Promise.resolve(true);
};

export const getDadosVaga = () => (dispatch, getState) => {
  try {
    const { dadosVaga } = getState().designacao;

    return Promise.resolve(dadosVaga);
  } catch (error) {
    return Promise.reject('Falha ao gravar os dados!');
  }
};

export const setDadosFunci = (dados) => (dispatch) => {
  try {
    dispatch({ type: types.DADOS_FUNCI, payload: dados });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject('Falha ao gravar os dados!');
  }
};

export const getDadosFunci = () => (dispatch, getState) => {
  try {
    const { dadosFunci } = getState().designacao;

    return Promise.resolve(dadosFunci);
  } catch (error) {
    return Promise.reject('Falha ao gravar os dados!');
  }
};

export const setDadosAnalise = (analise) => async (dispatch) => {
  try {
    dispatch({ type: types.ANALISE, payload: analise });

    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject('Falha ao obter os dados da Análise.');
  }
};

export const getDadosAnalise = () => (dispatch, getState) => {
  try {
    const analise = getState().designacao.dadosAnalise;
    analise.protocolo = getState().designacao.protocolo;

    return Promise.resolve(analise);
  } catch (error) {
    return Promise.reject('Falha ao gravar os dados!');
  }
};

export const desigOrAdd = (tipo) => (dispatch) => {
  try {
    dispatch({ type: types.DESIG_ADD, payload: tipo });

    return Promise.resolve();
  } catch (error) {
    return Promise.reject('Falha ao gravar o tipo de movimentação!');
  }
};

export const fetchSolicitacoes = () => async (dispatch) => {
  try {
    let solicitacoes = await apiModel.get('/desigint/solicitacoes/');

    solicitacoes = solicitacoes.data;

    dispatch({ type: types.DESIG_ADD, payload: solicitacoes });

    return Promise.resolve(solicitacoes);
  } catch (error) {
    return Promise.reject('Dados das Solicitações não disponíveis!');
  }
};

export const getFunciJaSolicitado = (funci) => async (dispatch, getState) => {
  try {
    const { iniDesig, fimDesig } = getState().designacao.dadosAnalise;

    const response = await apiModel.get('/desigint/getFunciJaSolicitado/', {
      params: {
        funci,
        iniDesig,
        fimDesig
      }
    });

    const responseData = response.data;

    if (!responseData) {
      return Promise.reject('Verificação de solicitações de movimentação para o funci nas datas informadas não foi bem sucedida.');
    }

    dispatch({ type: types.PENDENTES, payload: responseData });

    return Promise.resolve(responseData);
  } catch (error) {
    return Promise.reject('Falha ao verificar solicitações de movimentação para o referido funci nas datas informadas.');
  }
};

export const setDtsDesig = (dados) => (dispatch) => {
  try {
    dispatch({ type: types.INI_FIM, payload: dados });

    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject('Falha ao verificar solicitações de movimentação para o referido funci nas datas informadas.');
  }
};

export const setDtsDesigInt = (dados) => (dispatch) => {
  try {
    dispatch({ type: types.INI_FIM_DESIG, payload: dados });

    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject('Falha ao verificar solicitações de movimentação para o referido funci nas datas informadas.');
  }
};

export const resetDesignacao = () => (dispatch) => {
  try {
    dispatch({ type: types.NOVO, payload: null });

    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject('Falha ao resetar formulário.');
  }
};

export const getNegativas = () => async (dispatch) => {
  try {
    const response = await apiModel.get('/desigint/negativas');
    const negativas = response.data;

    dispatch({ type: types.NEGATIVAS, payload: negativas });

    return Promise.resolve(negativas);
  } catch (error) {
    return Promise.reject('Falha ao receber os dados das negativas.');
  }
};

export const getResponsavel = (id) => async () => {
  try {
    const response = await apiModel.get('desigint/getResponsavel', {
      params: {
        id
      }
    });
    const responsavel = response.data;

    return Promise.resolve(responsavel);
  } catch (error) {
    return Promise.reject('Falha ao verificar o responsável pela solicitação.');
  }
};

export const gravarSolicitacao = () => async (dispatch, getState) => {
  try {
    const dados = getState().designacao.dadosAnalise;
    dados.tipo = getState().designacao.tipo;
    dados.dt_ini = getState().designacao.dt_ini;
    dados.dt_fim = getState().designacao.dt_fim;
    dados.dias_uteis = getState().designacao.dias_uteis;
    dados.dias_totais = getState().designacao.dias_totais;

    const responseGravar = await apiModel.post('/desigint/gravar', { dados });

    if (!responseGravar) {
      return Promise.reject('Gravação de Solicitação não foi bem sucedida.');
    }

    const solicitacao = responseGravar.data;

    dispatch({ type: types.PROTOCOLO, payload: solicitacao.protocolo });

    return Promise.resolve(solicitacao);
  } catch (error) {
    return Promise.reject('Falha ao gravar os dados da Solicitação.');
  }
};

export const setProtocolo = (protocolo) => (dispatch) => {
  try {
    dispatch({ type: types.NOVO, payload: protocolo });

    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject('Falha ao resetar formulário.');
  }
};

export const setCadeia = (protocolo) => (dispatch) => {
  try {
    dispatch({ type: types.CADEIA, payload: protocolo });

    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject('Falha ao resetar formulário.');
  }
};

export const fetchPrefixosAndSubords = (prefixo, cancelToken = null) => async () => {
  try {
    const cancelParam = cancelToken ? { cancelToken } : {};

    const response = await apiModel.get('desigint/depesubord/', {
      params: {
        prefixo
      },
      ...cancelParam
    });

    const responseData = response.data;

    if (!responseData) {
      return Promise.reject('Nenhum registro encontrado para os dados informados.');
    }

    return Promise.resolve(responseData);
  } catch (error) {
    return Promise.reject('Falha ao obter os dados dos prefixos.');
  }
};

export const downloadDocsEnviados = (idSolicitacao, documento) => async () => {
  try {
    const resposta = await apiModel.get('/desigint/getdocumento/', {
      params: {
        id_solicitacao: idSolicitacao,
        documento: documento.documento
      },
      responseType: 'blob'
    });

    DownloadFileUtil(`DesignacaoInterinaOuAdicao.${documento.extensao}`, resposta.data);

    return Promise.resolve();
  } catch (error) {
    return Promise.reject('Falha ao identificar e apresentar o documento!');
  }
};

export const exportar = (dados) => async () => {
  try {
    const resposta = await apiModel.get('/desigint/exportar/', {
      params: {
        dados
      },
      responseType: 'blob'
    });

    DownloadFileUtil('Movimentação Transitória.xlsx', resposta.data);

    return Promise.resolve();
  } catch (error) {
    return Promise.reject('Falha ao identificar e apresentar o documento!');
  }
};

/* ------------ API CALLS -------------- */

export const showPendencias = (tipoAcesso) => fetch(FETCH_METHODS.GET, '/desigint/getPendencias/', { tipoAcesso });

export const getSolicitacao = (id) => fetch(FETCH_METHODS.GET, '/desigint/getSolicitacao', { id });

export const getTipoAcesso = () => fetch(FETCH_METHODS.GET, '/desigint/tipoAcesso');

export const getOpcoesHistorico = (acesso, idSolicitacao, consulta) => fetch(FETCH_METHODS.GET, '/desigint/getTipoHistorico', { acesso, id_solicitacao: idSolicitacao, consulta });

export const getAllTiposHistoricos = () => fetch(FETCH_METHODS.GET, '/desigint/getAllTiposHistoricos');

export const getHistorico = (id) => fetch(FETCH_METHODS.GET, '/desigint/getHistorico', { id });

export const setParecer = (values) => {
  const formData = new FormData();

  if (values.documentoParecer) {
    values.files.map((elem) => formData.append('files[]', elem));
  }
  formData.append('id_solicitacao', values.id);
  formData.append('id_historico', values.id_historico);
  formData.append('texto', values.texto);
  if (values.id_negativa) {
    formData.append('id_negativa', values.id_negativa);
  }
  if (values.tipo) {
    formData.append('tipo', values.tipo);
  }

  return fetch(FETCH_METHODS.POST, '/desigint/setDocumento', formData, {
    headers: {
      'Content-Type': 'multipart/form-data; boundary=500;',
    }
  });
};

export const setDocumento = (values) => {
  const formData = new FormData();

  if (values.files) {
    values.files.map((elem) => formData.append('files', elem.originFileObj));
  }
  formData.append('id_solicitacao', values.id);
  formData.append('id_historico', values.id_historico);
  formData.append('texto', values.texto);
  if (values.id_negativa) {
    formData.append('id_negativa', values.id_negativa);
  }

  if (values.tipo) {
    formData.append('tipo', values.tipo);
  }

  return fetch(FETCH_METHODS.POST, '/desigint/setDocumento', formData, {
    headers: {
      'Content-Type': 'multipart/form-data; boundary=500;',
    }
  });
};

export const getDiasTotaisUteis = (dados) => fetch(FETCH_METHODS.GET, '/desigint/getQtdeDias/', { dados });

export const fetchNegativas = () => fetch(FETCH_METHODS.GET, '/desigint/negativas');

export const showConcluidos = () => fetch(FETCH_METHODS.GET, '/desigint/concluidos');

export const setConcluir = (idSolicitacao) => fetch(FETCH_METHODS.PATCH, '/desigint/concluir', { id: idSolicitacao });

export const fetchConsulta = (dados) => fetch(FETCH_METHODS.GET, '/desigint/consultas', { dados });

export const getSituacoes = () => fetch(FETCH_METHODS.GET, '/desigint/getSituacoes');

export const getStatus = () => fetch(FETCH_METHODS.GET, '/desigint/getStatus');

export const getTipos = () => fetch(FETCH_METHODS.GET, '/desigint/tipos');

export const getProtocolo = (protocolo, cancelToken) => {
  const cancelParam = cancelToken ? { cancelToken } : {};

  return fetch(FETCH_METHODS.GET, '/desigint/getProtocolo', { protocolo, ...cancelParam });
};

export const compareVRDestOrig = (funci, fnDest) => fetch(FETCH_METHODS.GET, '/desigint/compareVRDestOrig', { funci, fn_dest: fnDest });

export const getOrigem = (funci) => fetch(FETCH_METHODS.GET, '/desigint/getOrigem', { funci });

export const getDestino = (dadosVaga) => fetch(FETCH_METHODS.POST, '/desigint/getDestino', { dadosVaga });

export const getAnalise = (id) => fetch(FETCH_METHODS.GET, 'desigint/getAnalise', { id });

export const analisarOrigDest = (dados) => fetch(FETCH_METHODS.POST, 'desigint/analise', { dados });

export const fetchFuncis = (funci, tipo, cancelToken = null) => {
  if (funci === undefined || String(funci).length === 0) {
    return new Promise((resolve, reject) => { reject('Informe a matrícula ou o nome para pesquisa!'); });
  }
  const cancelParam = cancelToken ? { cancelToken } : {};
  return fetch(FETCH_METHODS.GET, '/desigint/matchedfuncis/', { funci, tipo }, { ...cancelParam });
};

export const getDiaUtil = (dados) => fetch(FETCH_METHODS.GET, '/desigint/getDiaUtil/', { dados });

export const setSolicitacao = (dados) => fetch(FETCH_METHODS.POST, '/desigint/gravar', { dados });

export const getDadosDeAcordo = (id) => fetch(FETCH_METHODS.GET, '/desigint/getDeAcordo', { id });

export const setDadosDeAcordo = (id, tipo, texto) => fetch(FETCH_METHODS.POST, '/desigint/setDeAcordo/', { id, tipo, texto });

export const setResponsavel = (id) => fetch(FETCH_METHODS.POST, '/desigint/setResponsavel', { id });

export const fetchMatchedCodAusencia = (codigo, lista) => fetch(FETCH_METHODS.GET, '/desigint/matchcodausencia/', { codigo, lista });

export const getQtdeDias = (dados) => fetch(FETCH_METHODS.GET, '/desigint/getQtdeDias/', { dados });

export const getPrefSubord = (prefixo) => fetch(FETCH_METHODS.GET, '/desigint/getprefsubord/', { prefixo });

export const fetchFuncisLotados = (prefixo, comissao) => async () => fetch(FETCH_METHODS.GET, '/desigint/matchedfuncislotados/', { prefixo, comissao });

export const fetchFuncisMovimentados = (prefixo, comissao) => async () => fetch(FETCH_METHODS.GET, '/desigint/matchedfuncismovimentados/', { prefixo, comissao });

// método que retorna um Promise resolvido. Envia direto para o componente que chamou
// - usar direto com o this.setState()
export const fetchDotacao = (prefixo, ger = false, gest = false) => async () => fetch(FETCH_METHODS.GET, '/desigint/dotacao/', { prefixo, ger, gest });

export const fetchDotacao2 = (prefixo, ger = false, gest = false) => fetch(FETCH_METHODS.GET, '/desigint/dotacao/', { prefixo, ger, gest });

export const getTemplateByHistorico = (idTipoHistorico) => fetch(FETCH_METHODS.GET, '/desigint/gettemplates/', { id_tipo_historico: idTipoHistorico });

export const getTemplateById = (id) => fetch(FETCH_METHODS.GET, '/desigint/gettemplates/', { id });

export const setTemplate = (dados) => fetch(FETCH_METHODS.PATCH, '/desigint/settemplate/', { ...dados });

export const getHistoricoById = (id) => fetch(FETCH_METHODS.GET, '/desigint/getTipoHistoricoById/', { id });

export const getAllTemplates = (valido) => fetch(FETCH_METHODS.GET, '/desigint/getalltemplates', { valido });

/* ******Calcular Permissões********************************* */
export const getPermissao = (acesso) => fetch(FETCH_METHODS.GET, '/desigint/acessoteste', { acesso });

export default (state = initialState, action = null) => {
  switch (action.type) {
    case types.TIPOS_MOVIMENTACAO:
      return {
        ...state,
        tipos: action.payload
      };
    case types.TIPO_MOVIMENTACAO:
      return {
        ...state,
        tipo: action.payload
      };
    case types.NEGATIVAS:
      return {
        ...state,
        negativas: action.payload
      };
    case types.VALIDAR_VAGA:
      return {
        ...state,
        destino: action.payload
      };
    case types.VALIDAR_FUNCI:
      return {
        ...state,
        origem: action.payload
      };
    case types.DADOS_VAGA:
      return {
        ...state,
        dadosVaga: action.payload.vaga,
        iniDesig: action.payload.datas.iniDesig,
        fimDesig: action.payload.datas.fimDesig,
        dt_ini: action.payload.datas.dt_ini,
        dt_fim: action.payload.datas.dt_fim,
        dias_totais: action.payload.datas.dias_totais,
        dias_uteis: action.payload.datas.dias_uteis
      };
    case types.DADOS_FUNCI:
      return {
        ...state,
        dadosFunci: { funci: action.payload }
      };
    case types.ANALISE:
      return {
        ...state,
        dadosAnalise: action.payload
      };
    case types.DESIG_ADD:
      return {
        ...state,
        tipo: action.payload
      };
    case types.INI_FIM:
      return {
        ...state,
        iniDesig: action.payload.iniDesig,
        fimDesig: action.payload.fimDesig
      };
    case types.INI_FIM_DESIG:
      return {
        ...state,
        iniDesig: action.payload.datas.iniDesig,
        fimDesig: action.payload.datas.fimDesig,
        dt_ini: action.payload.datas.dt_ini,
        dt_fim: action.payload.datas.dt_fim,
        dias_totais: action.payload.datas.dias_totais,
        dias_uteis: action.payload.datas.dias_uteis
      };
    case types.PROTOCOLO:
      return {
        ...state,
        protocolo: action.payload
      };
    case types.NOVO:
      return {
        ...initialState
      };
    case types.CADEIA:
      return {
        ...state,
        destino: {},
        origem: {},
        dadosVaga: '',
        dadosFunci: '',
        dadosAnalise: '',
        iniDesig: '',
        fimDesig: '',
        dt_ini: '',
        dt_fim: '',
        dias_uteis: '',
        dias_totais: '',
        protocolo: state.protocolo
      };
    default:
      return state;
  }
};
