import apiModel from 'services/apis/ApiModel';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';
import { getProfileURL, HandleErrorResponse, ExtractErrorMessage } from 'utils/Commons';
import { TIPO_PARTICIPANTE } from 'pages/ordemserv/Types';
import _ from 'lodash';
import cloneDeep from 'lodash.clonedeep';
import { fetchFunci } from 'services/ducks/Arh.ducks';
import uuid from 'uuid/v4';
import moment from 'moment';
import { ESTADOS } from '../../pages/ordemserv/Types';


/*******     Action Types     *******/
const ConstTypes = [
  'FIND_BY_ESTADO_ORDEM',
  'FIND_HISTORICO_PESSOAL',
  'FIND_ESTADOS',
  'FETCH_ORDEM_EDICAO',
  'FETCH_ORDEM_VISUALIZACAO',
  'FETCH_COLABORADOR',
  'REMOVE_COLABORADOR',
  'FETCH_FUNCI_AUTORIZACAO',
  'REMOVE_FUNCI_AUTORIZACAO',
  'UPDATE_DADOS_BASICOS',
  'NEW_ORDEM',
  'SAVE_PARTICIPANTE',
  'REMOVE_PARTICIPANTE',
  'SAVE_INSTRUCOES',
  'REMOVE_INSTRUCAO',
  'REMOVE_ALL_INSTRUCOES',
  'REMOVE_ALL_DESIGNANTES',
  'REMOVE_ALL_DESIGNADOS',
  'CLEAR_MINHAS_ORDENS_DATA',
  'CLEAR_ORDEM_VISUALIZACAO'
]

//cria um objeto de types a partir do array ConstTypes
const generateTypes = (PrefixoFerramenta) => {
  let actionTypes = {}

  for (const type of ConstTypes) {
    actionTypes[type] = `${PrefixoFerramenta}:${type}`
  }

  return {...actionTypes}
}

//Gerando os Action Types dinamicamente
export const types = generateTypes("OrdemServ")

/*******     Reducers     *******/

const salvarDadosParticipante = (arrParticipantes, dadosParticipante) => {
  if (dadosParticipante.id) {
    //remove o participante da lista e cria um novo com base nos dados alterados
    //mantendo apenas o id
    let listaFiltrada = arrParticipantes.filter( elem => elem.id !== dadosParticipante.id);
    let registro = cloneDeep(dadosParticipante);
    return [...listaFiltrada, registro];
  } else {
    //novo participante na lista
    let registro = cloneDeep(dadosParticipante);
    registro.id = uuid();
    return [...arrParticipantes, registro];
  }
}

//funcao generica que verifica se um participante esta incluido no array de 
//participantes fornecido.
const _verificaVinculoRepetido = (arrParticipantes, dadosParticipante) => {
  let partToCompare = cloneDeep(dadosParticipante);
  let listaParticipantes = cloneDeep(arrParticipantes);
  delete partToCompare.id;

  for (let elem of listaParticipantes) {
    delete elem.id;
    
    if (_.isEqual(elem, partToCompare)) {
      //achou algum participante com os mesmo dados
      return true;
    }
  }

  return false;
}

const possuiVinculoRepetido = (arrParticipantes, dadosParticipante) => {
  return _verificaVinculoRepetido(arrParticipantes, dadosParticipante);
}

const designadoEstaNaListaDesignantes = (arrDesignantes, dadosDesignado) => {
  let partToCompare = cloneDeep(dadosDesignado);
  partToCompare.tipoParticipante = TIPO_PARTICIPANTE.DESIGNANTE;

  return _verificaVinculoRepetido(arrDesignantes, partToCompare);
}

const designanteEstaNaListaDesignados = (arrDesignados, dadosDesignante) => {
  let partToCompare = cloneDeep(dadosDesignante);
  partToCompare.tipoParticipante = TIPO_PARTICIPANTE.DESIGNADO;

  return _verificaVinculoRepetido(arrDesignados, partToCompare);
}

const defaultOrdemObject = {
  dadosBasicos: { 
    estado: ESTADOS.RASCUNHO, 
    tipoValidade: "Indeterminada", 
    confidencial: 0 
  },
  instrucoesNorm: [],
  participantes: [],
  colaboradores: [],
  autorizacaoConsulta: []
}

const initialState = {
  listaOrdensPorFiltro: [],
  listaHistoricoPessoal: [],
  listaEstados: [],
  ordemAtual: {},
  ordemEdicao: {...defaultOrdemObject}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FIND_BY_ESTADO_ORDEM:
      return {
        ...state, 
        listaOrdensPorFiltro: [...action.payload]
      }
      
    case types.FIND_HISTORICO_PESSOAL:
      return {
        ...state, 
        listaHistoricoPessoal: [...action.payload]
      }
       
    case types.FIND_ESTADOS:
      return {
        ...state, 
        listaEstados: [...action.payload]
      }

    case types.FETCH_ORDEM_EDICAO: {
      _.set(state, "ordemEdicao", {...action.payload})
      return {...state}
    }

    case types.FETCH_ORDEM_VISUALIZACAO: {
      _.set(state, "ordemAtual", {...action.payload})
      return {...state}
    }

    case types.CLEAR_ORDEM_VISUALIZACAO: {
      _.set(state, "ordemAtual", {})
      return {...state}
    }

    case types.FETCH_COLABORADOR: {
      let newList = [...state.ordemEdicao.colaboradores, action.payload];
      _.set(state, 'ordemEdicao.colaboradores', newList);
      return {...state};
    }

    case types.REMOVE_COLABORADOR: {
      let newList = state.ordemEdicao.colaboradores.filter((elem) => elem.matricula !== action.payload)
      _.set(state, 'ordemEdicao.colaboradores', newList);
      return {...state};
    }

    case types.FETCH_FUNCI_AUTORIZACAO: {
      let newList = [...state.ordemEdicao.autorizacaoConsulta, action.payload];
      _.set(state, 'ordemEdicao.autorizacaoConsulta', newList);
      return {...state};
    }

    case types.REMOVE_FUNCI_AUTORIZACAO: {
      let newList = state.ordemEdicao.autorizacaoConsulta.filter((elem) => elem.matricula !== action.payload)
      _.set(state, 'ordemEdicao.autorizacaoConsulta', newList);
      return {...state};
    }

    case types.UPDATE_DADOS_BASICOS: {
      _.set(state, 'ordemEdicao.dadosBasicos', {...state.ordemEdicao.dadosBasicos, ...action.payload});
      return {...state}
    }

    case types.NEW_ORDEM: {
      _.set(state, 'ordemEdicao', {...defaultOrdemObject});
      return {...state}
    }

    case types.SAVE_PARTICIPANTE: {
      let dadosParticipante = {...action.payload};
      let listaParticipantes = [];
      let newState = {...state}

      listaParticipantes = salvarDadosParticipante(newState.ordemEdicao.participantes, dadosParticipante);
      _.set(newState, "ordemEdicao.participantes", [...listaParticipantes])

      return {...newState};
    }

    case types.REMOVE_PARTICIPANTE: {
      let idParticipante = action.payload;
      let listaParticipantes = [];

      listaParticipantes = cloneDeep(state.ordemEdicao.participantes);
      listaParticipantes = listaParticipantes.filter(elem => elem.id !== idParticipante);
      _.set(state, "ordemEdicao.participantes", [...listaParticipantes])
      return {...state}
    }

    case types.SAVE_INSTRUCOES: {
      _.set(state, "ordemEdicao.instrucoesNorm", [...action.payload])
      return {...state}      
    }

    case types.REMOVE_INSTRUCAO: {
      let newList = state.ordemEdicao.instrucoesNorm.filter( elem => elem.key !== action.payload);
      _.set(state, "ordemEdicao.instrucoesNorm", newList)
      return {...state}
    }

    case types.REMOVE_ALL_INSTRUCOES: {
      _.set(state, "ordemEdicao.instrucoesNorm", [])
      return {...state}
    }

    case types.REMOVE_ALL_DESIGNANTES: {
      let listaParticipantes = [];

      listaParticipantes = cloneDeep(state.ordemEdicao.participantes);
      listaParticipantes = listaParticipantes.filter(elem => elem.tipoParticipante !== TIPO_PARTICIPANTE.DESIGNANTE);
      _.set(state, "ordemEdicao.participantes", [...listaParticipantes])
      return {...state}
    }

    case types.REMOVE_ALL_DESIGNADOS: {
      let listaParticipantes = [];

      listaParticipantes = cloneDeep(state.ordemEdicao.participantes);
      listaParticipantes = listaParticipantes.filter(elem => elem.tipoParticipante !== TIPO_PARTICIPANTE.DESIGNADO);
      _.set(state, "ordemEdicao.participantes", [...listaParticipantes])
      return {...state}
    }

    case types.CLEAR_MINHAS_ORDENS_DATA: {
      _.set(state, "listaOrdensPorFiltro", []);
      _.set(state, "listaHistoricoPessoal", []);
      _.set(state, "listaEstados", []);
      return {...state}
    }

    default:
      return state;
  }
}


/*******     Actions     *******/

export const findByEstadoDaOrdem = ({filtroEstadoDaOrdem, responseHandler}) => async (dispatch) => {
  try {
    let response = await apiModel.get('/ordemserv/minhasordens', {params: {filtroEstadoDaOrdem}}); 
    let listaOrdens = response.data;
    dispatch({ type: types.FIND_BY_ESTADO_ORDEM, payload: listaOrdens});
    responseHandler.successCallback();
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
}

export const findByEstadoDaOrdemADM = ({filtroEstadoDaOrdem, responseHandler}) => async (dispatch) => {
  try {
    let response = await apiModel.get('/ordemserv/gerenciar/minhasordens-adm', {params: {filtroEstadoDaOrdem}}); 
    let listaOrdens = response.data;
    dispatch({ type: types.FIND_BY_ESTADO_ORDEM, payload: listaOrdens});
    responseHandler.successCallback();
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
}

export const findHistoricoPessoal = ({responseHandler}) => async (dispatch) => {
  try {
    let response = await apiModel.get('/ordemserv/historico-pessoal'); 
    let listaHistoricoPessoal = response.data;
    dispatch({ type: types.FIND_HISTORICO_PESSOAL, payload: listaHistoricoPessoal});
    responseHandler.successCallback();
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
}

export const findEstados = ({responseHandler}) => async (dispatch) => {
  try {
    let response = await apiModel.get('/ordemserv/estados'); 
    let listaEstados = response.data;
    dispatch({ type: types.FIND_ESTADOS, payload: listaEstados});
    responseHandler.successCallback();
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
}

/**
 * Obtem os dados de um funcionario especifico pela matricula informada.
 * Utiliza a funcao fetchFunci do Arh.ducks.
 * @param {*} matricula 
 * @param {*} responseHandler 
 */
export const fetchColaborador = (matricula, responseHandler) => async (dispatch) => {

  try {
    let colaborador = await fetchFunci(matricula)();

    if (!colaborador) {
      responseHandler.errorCallback('Nenhum registro encontrado para a matrícula informada.');
      return;
    }
  
    dispatch({ type: types.FETCH_COLABORADOR, payload: {...colaborador} });
    responseHandler.successCallback();
    
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
}

export const removeColaborador = (matricula, responseHandler) => async (dispatch) => {
  if (!matricula.length) {
    responseHandler.errorCallback('Matrícula não informada!');
    return;
  }

  dispatch({ type: types.REMOVE_COLABORADOR, payload: matricula })
  responseHandler.successCallback();
}

export const fetchFunciAutorizacao = (matricula, responseHandler) => async (dispatch) => {

  try {
    let colaborador = await fetchFunci(matricula)();

    if (!colaborador) {
      responseHandler.errorCallback('Nenhum registro encontrado para a matrícula informada.');
      return;
    }
  
    dispatch({ type: types.FETCH_FUNCI_AUTORIZACAO, payload: {...colaborador} });
    responseHandler.successCallback();
    
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
}

export const removeFunciAutorizacao = (matricula, responseHandler) => async (dispatch) => {
  if (!matricula.length) {
    responseHandler.errorCallback('Matrícula não informada!');
    return;
  }

  dispatch({ type: types.REMOVE_FUNCI_AUTORIZACAO, payload: matricula })
  responseHandler.successCallback();
}

export const updateDadosBasicos = (dadosBasicos) => async (dispatch) => {
  dispatch({ type: types.UPDATE_DADOS_BASICOS, payload: {...dadosBasicos} })
}

export const novaOrdemServico = (successCallback) => async (dispatch) => {
  dispatch({ type: types.NEW_ORDEM })
  successCallback();
}

export const saveOrdem = ({responseHandler}) => async (dispatch, getState) => {
  try {
    let ordemEdicao = getState().ordemserv.ordemEdicao;
    let { dadosBasicos } = ordemEdicao;

    let errorsList = [];    
    let response;

    //fazendo a validacao dos dados da ordem antes de enviar para o backend
    //Dados Basicos
    if (_.isEmpty(ordemEdicao.dadosBasicos)) {
      errorsList.push("Dados de validade, título e descrição não informados.")
    } else {      
      //testa a validade
      if (dadosBasicos.tipoValidade === "Determinada" && 
          (!dadosBasicos.dataValidade || dadosBasicos.dataValidade.trim() === "") ) {
        errorsList.push("Tipo de validade determinada necessita da data de validade.")    
      }

      //testa o titulo
      if (!dadosBasicos.titulo || dadosBasicos.titulo.trim() === "") {
        errorsList.push("Necessário o título da ordem de serviço.")    
      }

      //testa a descricao
      if (!dadosBasicos.descricao || dadosBasicos.descricao.trim() === "") {
        errorsList.push("Necessária a descrição da ordem de serviço.")
      }
    }

    //Colaboradores
    if (_.isEmpty(ordemEdicao.colaboradores)) {
      errorsList.push("Necessário pelo menos um colaborador na ordem.")
    }

    //Instrucoes Normativas
    if (_.isEmpty(ordemEdicao.instrucoesNorm)) {
      errorsList.push("Necessário pelo um item de uma instrução normativa nesta ordem.")
    }

    //obtem a lista completa dos participantes.
    let listaParticipantes = ordemEdicao.participantes;

    let designantes = listaParticipantes.filter( elem => elem.tipoParticipante === TIPO_PARTICIPANTE.DESIGNANTE);
    
    //Designantes
    if (_.isEmpty(designantes)) {
      errorsList.push("Necessário pelo menos um vínculo de designante na ordem.")
    }

    let designados = listaParticipantes.filter( elem => elem.tipoParticipante === TIPO_PARTICIPANTE.DESIGNADO);

    //Designados
    if (_.isEmpty(designados)) {
      errorsList.push("Necessário pelo menos um vínculo de designado na ordem.")
    }

    if (errorsList.length) {
      //foram identificados erros na confeccao da ordem
      responseHandler.validationErrorCallback(errorsList);
      return;
    }

    console.log("ordemEdicao.id = ", ordemEdicao.id)

    if (dadosBasicos.id) {
      //atualizacao dos dados da ordem
      response = await apiModel.patch("/ordemserv", {dadosOrdem: {...ordemEdicao} });
    } else {
      //criacao de uma nova ordem
      response = await apiModel.post("/ordemserv", {dadosOrdem: {...ordemEdicao} });
    }

    responseHandler.successCallback(response.data.id);
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback)
  }
}

/**
 * Fetch especifico para obter os dados de um funci obedecendo as regras de negocio
 * da ordem de servico.
 * @param {*} matricula 
 * @param {*} tipoParticipante 
 * @param {*} responseHandler 
 */
export const fetchFunciByTipoParticipante = (matricula, tipoParticipante, responseHandler) => async () => {
  try {
    if (!matricula.length) {
      responseHandler.errorCallback('Matrícula não informada!');
      return;
    }

    let response = await apiModel.get("/ordemserv/find-participante", { params: {matricula, tipoParticipante} });
    let responseData = response.data;

    if (!responseData) {
      responseHandler.errorCallback('Nenhum registro encontrado para a matrícula informada.');
      return;
    }

    let dadosFunci = {
      key: responseData.matricula, 
      matricula: responseData.matricula,
      nome: responseData.nome,
      nomeGuerra: responseData.nomeGuerra,
      cargo: responseData.descCargo,
      img: getProfileURL(responseData.matricula),
      prefixo: responseData.dependencia.prefixo,
      nome_prefixo: responseData.dependencia.nome 
    };
    
    responseHandler.successCallback(dadosFunci);
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }

}

export const saveParticipante = (dadosParticipante, responseHandler) => async (dispatch, getState) => {
  let listaParticipantes = getState().ordemserv.ordemEdicao.participantes;

  if (possuiVinculoRepetido(listaParticipantes, dadosParticipante)) {
    responseHandler.errorCallback("Inclusão não permitida! Vínculo já está na lista.")
    return;
  }

  if (dadosParticipante.tipoParticipante === TIPO_PARTICIPANTE.DESIGNANTE) {
    let listaDesignados = listaParticipantes.filter( elem => elem.tipoParticipante === TIPO_PARTICIPANTE.DESIGNADO);

    if (designanteEstaNaListaDesignados(listaDesignados, dadosParticipante)) {
      responseHandler.errorCallback("Inclusão não permitida! Vínculo já definido na lista de designados.")
      return;
    }  
  } else {
    //se for designado, verifica se o mesmo vinculo consta da lista de designantes
    let listaDesignantes = listaParticipantes.filter( elem => elem.tipoParticipante === TIPO_PARTICIPANTE.DESIGNANTE);;

    if (designadoEstaNaListaDesignantes(listaDesignantes, dadosParticipante)) {
      responseHandler.errorCallback("Inclusão não permitida! Vínculo já definido na lista de designantes.")
      return;
    }
  }

  dispatch({ type: types.SAVE_PARTICIPANTE,  payload: {...dadosParticipante} })
  responseHandler.successCallback();
}

export const removeParticipante = (idParticipante, responseHandler) => async (dispatch, getState) => {

  let listaParticipantes = getState().ordemserv.ordemEdicao.participantes; 
  let listaFiltrada = listaParticipantes.filter( elem => elem.id === idParticipante);

  if (!listaFiltrada.length) {
    responseHandler.errorCallback("Erro ao remover! Vínculo não encontrado na lista.")
    return;
  }

  dispatch({ type: types.REMOVE_PARTICIPANTE,  payload: idParticipante })
  responseHandler.successCallback();
}

export const fetchComissoesByPrefixo = (prefixo, responseHandler) => async () => {
  try {
    if (!prefixo) {
      responseHandler.errorCallback('Prefixo não informado!');
      return;
    }

    let response = await apiModel.get(`/comissoes/${prefixo}`);
    let listaComissoes = response.data;

    if (!listaComissoes || !listaComissoes.length) {
      responseHandler.errorCallback('Nenhum cargo/comissão encontrado para o prefixo informado.');
      return;
    }

    responseHandler.successCallback([...listaComissoes]);
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }

}

export const fetchOrdemEdicao = (idOrdem) => async (dispatch) => {

  if (!idOrdem) {
    return new Promise((resolve, reject) => reject('Id da ordem não informado!'))
  }

  try {
    let response = await apiModel.get(`/ordemserv/edicao/${idOrdem}`);
    let ordem = response.data;

    if (!ordem) {
      return new Promise((resolve, reject) => reject('Ordem de serviço não encontrada!'))
    }

    if (ordem.dadosBasicos.dataValidade) {
      ordem.dadosBasicos.dataValidade = moment(ordem.dadosBasicos.dataValidade, 'DD/MM/YYYY', true).toISOString();
    }

    dispatch({ type: types.FETCH_ORDEM_EDICAO, payload: ordem});
    return new Promise(resolve => { resolve() });

  } catch (error) {
    let msg = ExtractErrorMessage(error, 'Falha ao obter os dados da ordem solicitada!');
    return new Promise((resolve, reject) => reject(msg))
  }

}

/**
 * Action que envia a solicitacao de remocao da ordem.
 * Apenas ordens em rascunho serao removidas da base e realizadas
 * por um dos colaboradores da ordem.
 * 
 * @param {*} idOrdem 
 * @param {*} responseHandler 
 */
export const deleteOrdem = (idOrdem, responseHandler) => async (dispatch) => {
  try {
    await apiModel.delete(`/ordemserv/${idOrdem}`);
    responseHandler.successCallback();
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
}

/**
 * Action que enviar a solicitação de finalizacao do rascunho de uma ordem de servico.
 * Apos a finalizacao do rascunho os designantes serao notificados para assinar a ordem.
 * 
 * @param {*} idOrdem 
 * @param {*} responseHandler 
 */
export const finalizarRascunho = (idOrdem, responseHandler) => async (dispatch) => {
  try {
    await apiModel.post(`/ordemserv/finalizar-rascunho/${idOrdem}`);
    responseHandler.successCallback();
  } catch (error) {
    HandleErrorResponse(error, responseHandler.errorCallback);
  }
}

export const saveInstrucoesNorm = (listaInstrucoes, responseHandler) => async (dispatch) => {

  if (!listaInstrucoes.length) {
    responseHandler.errorCallback("Erro ao salvar! Itens da lista não informados.")
    return;
  }

  dispatch({ type: types.SAVE_INSTRUCOES,  payload: [...listaInstrucoes] })
  responseHandler.successCallback();
}

/**
 * Remove um item da lista de instrucoes selecionadas.
 * 
 * @param {*} key - a key do objeto a remover
 * @param {*} responseHandler 
 */
export const removeInstrucaoNorm = (key, responseHandler) => async (dispatch) => {

  if (!key) {
    responseHandler.errorCallback("Erro ao salvar! Itens da lista não informados.")
    return;
  }

  dispatch({ type: types.REMOVE_INSTRUCAO, payload: key })
  responseHandler.successCallback();
}

/**
 * Limpa a lista de instrucoes normativas selecionadas.
 */
export const removeAllInstrucaoNorm = () => async (dispatch) => {
  dispatch({ type: types.REMOVE_ALL_INSTRUCOES})
}

/**
 * Remove todos os designantes da lista de participantes.
 */
export const removeAllDesignantes = () => async (dispatch) => {
  dispatch({ type: types.REMOVE_ALL_DESIGNANTES})
}

/**
 * Remove todos os designados da lista de participantes.
 */
export const removeAllDesignados = () => async (dispatch) => {
  dispatch({ type: types.REMOVE_ALL_DESIGNADOS})
}

/**
 * Solicita a assinatura/ciencia/revogacao de uma ordem de servico.
 * @param {integer} idOrdem 
 * @param {string} tipoForm - "assinar" | "darCiencia" | "revogar"
 */
export const assinarOrdem = (idOrdem, tipoForm, extraParams = {}) => async () =>{

  if (!idOrdem) {
    return new Promise((resolve, reject) => reject('Id da ordem não informado!'))
  }

  try {
    switch (tipoForm) {
      case "darCiencia":
        await apiModel.post(`/ordemserv/dar-ciencia/${idOrdem}`);
        break;

      case "revogar":
        await apiModel.post(`/ordemserv/revogar/${idOrdem}`, {...extraParams});
        break;

      default:
        await apiModel.post(`/ordemserv/assinar/${idOrdem}`);        
    }

    return new Promise(resolve => { resolve() });
  } catch (error) {
    let msg = ExtractErrorMessage(error, 'Falha ao executar o comando solicitado nesta da ordem de serviço! Contate o administrador do sistema.');
    return new Promise((resolve, reject) => reject(msg))
  }
}

/**
 * Action que verifica se o funci pode assinar ou dar ciencia em uma ordem de servico especifica.
 * @param {Integer} idOrdem
 * @param {string} tipoForm - "assinar" | "darCiencia" | "revogar"
 * @return {Object} - {podeAssinar: (boolean), motivo: (string)}
 */
export const permiteAssinar = (idOrdem, tipoForm) => async () => {

  if (!idOrdem) {
    return new Promise((resolve, reject) => reject('Identificador da ordem não informado!'))
  }

  try {
    let parametros;

    switch (tipoForm) {
      case "darCiencia":
        parametros = { darCiencia: 1}
        break;

      case "revogar":
        parametros = { revogar: 1}
        break;

      default:
        parametros = {};
    }
    
    let response = await apiModel.get(`/ordemserv/permite-assinar/${idOrdem}`, { params: {...parametros}}); 
    let permissaoAssinar = response.data;
    return new Promise(resolve => { resolve({...permissaoAssinar}) });

  } catch (error) {
    let msg = ExtractErrorMessage(error, 'Falha na consulta da permissão deste comando para esta ordem! Tente novamente mais tarde.');
    return new Promise((resolve, reject) => reject(msg))
  }
}

/**
 * Faz uma limpeza no hsitorico de todos os registros retornados pelas consultas da
 * tela minhas ordens.
 */
export const removeMinhasOrdensData = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_MINHAS_ORDENS_DATA})
}

/**
 * Busca os registros de historico de uma ordem de servico.
 * @param {*} idOrdem 
 */
export const findHistoricoOrdem = (idOrdem) => async (dispatch) => {

  if (!idOrdem) {
    return new Promise((resolve, reject) => reject('Id da ordem não informado!'))
  }

  try {
    let response = await apiModel.get(`/ordemserv/historico/${idOrdem}`);
    return new Promise(resolve => { resolve([...response.data]) });
  } catch (error) {
    let msg = ExtractErrorMessage(error, 'Falha ao obter os dados de historico da ordem solicitada!');
    return new Promise((resolve, reject) => reject(msg))
  }
}


/**
 * Busca os dados de acompanhamento (estatisticas) da ordem solicitada.
 * @param {*} idOrdem 
 */
export const findAcompanhamentoOrdem = (idOrdem) => async () => {

  if (!idOrdem) {
    return new Promise((resolve, reject) => reject('Id da ordem não informado!'))
  }

  try {
    let response = await apiModel.get(`/ordemserv/acompanhamento/${idOrdem}`);
    return new Promise(resolve => { resolve({...response.data}) });
  } catch (error) {
    let msg = ExtractErrorMessage(error, 'Falha ao obter os dados de acompanhamento da ordem solicitada!');
    return new Promise((resolve, reject) => reject(msg))
  }
}

/**
 * Busca as instrucoes normativas alteradas.
 * @param {*} idOrdem 
 */
export const findInsAlteradasOrdem = (idOrdem) => async () => {

  if (!idOrdem) {
    return new Promise((resolve, reject) => reject('Id da ordem não informado!'))
  }

  try {
    let response = await apiModel.get(`/ordemserv/ins-alteradas/${idOrdem}`);
    return new Promise(resolve => { resolve({...response.data}) });
  } catch (error) {
    let msg = ExtractErrorMessage(error, 'Falha ao obter a resposta da ação solicitada!');
    return new Promise((resolve, reject) => reject(msg))
  }
}

/**
 * Confirma as alteracoes das instrucoes normativas da ordem de servico.
 * @param {*} idOrdem 
 */
export const confirmarInstrucoesAlteradasOrdem = (idOrdem) => async () => {

  if (!idOrdem) {
    return new Promise((resolve, reject) => reject('Id da ordem não informado!'))
  }

  try {
    await apiModel.post('/ordemserv/confirmar-ins-alteradas', {id: idOrdem});
    return new Promise(resolve => resolve());
  } catch (error) {
    let msg = ExtractErrorMessage(error, 'Falha ao obter a resposta da ação solicitada!');
    return new Promise((resolve, reject) => reject(msg))
  }
}

/**
 * Solicta a criação de uma nova ordem de servico com base em uma anterior.
 * @param {*} idOrdemBase 
 */
export const clonarOrdemServico = (idOrdemBase) => async () => {

  if (!idOrdemBase) {
    return new Promise((resolve, reject) => reject('Id da ordem não informado!'))
  }

  try {
    let response = await apiModel.post('/ordemserv/clonar-ordem', {idBase: idOrdemBase});
    return new Promise(resolve => resolve({...response.data}));
  } catch (error) {
    let msg = ExtractErrorMessage(error, 'Falha ao obter a resposta da ação solicitada!');
    return new Promise((resolve, reject) => reject(msg))
  }
}

/**
 * Remove a autorização de consulta de uma O.S para o usuário.
 * @param {*} idOrdem 
 */
 export const removerAutorizacaoConsulta = (idOrdem) => async () => {

  if (!idOrdem) {
    return new Promise((resolve, reject) => reject('Id da ordem não informado!'))
  }

  try {
    let response = await apiModel.post('/ordemserv/remover-autorizacao-consulta', {idOrdem});
    return new Promise(resolve => resolve({...response.data}));
  } catch (error) {
    let msg = ExtractErrorMessage(error, 'Falha ao obter a resposta da ação solicitada!');
    return new Promise((resolve, reject) => reject(msg))
  }
}

/**
 * Obtem os dados da Ordem de Serviço verificando também as permissoes de Gerenciar do usuário.
 * Se a ordem não possível de visualização pelo usuário, verifica se o mesmo tem perfil 
 * Gerenciar ou Admin na suas permissões de acesso.
 * @param {*} idOrdem 
 */
export const fetchVisualizarOrdem = (idOrdem) => async (dispatch) => {

  if (!idOrdem) {
    return new Promise((resolve, reject) => reject('Id da ordem não informado!'))
  }

  try {
    let response;
    
    //ordem completa com todos os dados
    response = await apiModel.get(`/ordemserv/gerenciar/visualizar/${idOrdem}`, { params: { withResolucaoVinculos: 1} });

    let ordem = response.data;

    if (!ordem) {
      return new Promise((resolve, reject) => reject('Ordem de serviço não encontrada!'))
    }

    dispatch({ type: types.FETCH_ORDEM_VISUALIZACAO, payload: ordem});
    return new Promise(resolve => { resolve() });

  } catch (error) {
    dispatch({ type: types.CLEAR_ORDEM_VISUALIZACAO});
    let msg = ExtractErrorMessage(error, 'Falha ao obter os dados da ordem solicitada!');
    return new Promise((resolve, reject) => reject(msg))
  }

}

/**
 * Obtem os dados de uma ordem conforme a data do historico.
 * (ordens antigas)
 * @param {*} idOrdem 
 * @param {*} idHistorico 
 * @returns 
 */
export const fetchVisualizarOrdemEstoque = (idOrdem, idHistorico) => async (dispatch) => {

  if (!idOrdem) {
    return new Promise((resolve, reject) => reject('Id da ordem não informado!'))
  }

  if (!idHistorico) {
    return new Promise((resolve, reject) => reject('Id do histórico não informado!'))
  }

  try {
    let response;
    
    //ordem completa com todos os dados
    response = await apiModel.get(`/ordemserv/ordem-estoque`, { params: { id: idOrdem, idHistorico: idHistorico } });

    let ordem = response.data;

    if (!ordem) {
      return new Promise((resolve, reject) => reject('Ordem de serviço (estoque) não encontrada!'))
    }

    dispatch({ type: types.FETCH_ORDEM_VISUALIZACAO, payload: ordem});
    return new Promise(resolve => { resolve() });

  } catch (error) {
    dispatch({ type: types.CLEAR_ORDEM_VISUALIZACAO});
    let msg = ExtractErrorMessage(error, 'Falha ao obter os dados da ordem (estoque) solicitada!');
    return new Promise((resolve, reject) => reject(msg))
  }

}

export const fetchINCNodes = ({nroINC, codTipoNormativo, baseItem}) => async () => {

  if (nroINC === undefined || String(nroINC).length === 0) {
    return new Promise((resolve, reject) => reject('Informe o número da IN!'))
  }

  if (codTipoNormativo === undefined || String(codTipoNormativo).length === 0) {
    return new Promise((resolve, reject) => reject('Informe o tipo de normativo!'))
  }

  try {
    let response = await apiModel.get("/ordemserv/inc", { params: {
      nroINC,
      codTipoNormativo,
      baseItem
    }});

    let responseData = response.data;

    if (!responseData) {
      return new Promise((resolve, reject) => reject('Nenhum registro encontrado para os dados informados.'))
    }
  
    return new Promise(resolve => { 
      resolve(responseData) 
    });

  } catch (error) {
    let msg = ExtractErrorMessage(error, 'Falha ao obter os dados deste normativo.');
    return new Promise((resolve, reject) => reject(msg))
  }
}

/** ------------------- API CALLS -------------------- */

export const voltarOrdemRascunho = (idOrdem) => {
  return fetch(FETCH_METHODS.POST, `/ordemserv/voltar-rascunho/${idOrdem}`);
}

export const fetchOrdensAnalisadas = (filters) => {
  return fetch(FETCH_METHODS.GET, "/ordemserv/ordens-analisadas", filters);
}

export const fetchListaGestoresSugestoes = () => {
  return fetch(FETCH_METHODS.GET, "/ordemserv/sugestoes/lista-gestores");
}

export const fetchListaInstrucoesSugestoes = () => {
  return fetch(FETCH_METHODS.GET, "/ordemserv/sugestoes/lista-instrucoes");
}

export const revogarOrdemPorAltInsNorm = (idOrdem) => {
  return fetch(FETCH_METHODS.POST, '/ordemserv/revogar-por-ins-alteradas', { id: idOrdem });
}

export const criarLinkPublico = (idOrdem) => {
  return fetch(FETCH_METHODS.POST, `/ordemserv/link-publico/${idOrdem}`);
}

export const fetchLinkPublico = (idOrdem) => {
  return fetch(FETCH_METHODS.GET, `/ordemserv/link-publico/${idOrdem}`);
}

export const trocarSenhaLinkPublico = (idOrdem) => {
  return fetch(FETCH_METHODS.POST, `/ordemserv/link-publico/nova-senha/${idOrdem}`);
}

export const excluirLinkPublico = (idOrdem) => {
  return fetch(FETCH_METHODS.DELETE, `/ordemserv/link-publico/${idOrdem}`);
}

export const fetchOrdemLinkPublico = (hash, senha) => {
  return fetch(FETCH_METHODS.GET, `/ordemserv/link-publico/visualizar/${hash}`, { senha });
}


/** ------------------- END - API CALLS -------------------- */