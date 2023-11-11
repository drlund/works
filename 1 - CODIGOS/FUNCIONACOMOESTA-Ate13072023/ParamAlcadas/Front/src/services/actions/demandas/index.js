import apiModel from 'services/apis/ApiModel';
import _ from 'lodash';
import {
  validateQuestionList,
  validateGeralForm,
  validatePublicoAlvo,
} from 'components/demandas/perguntas/ValidationHelper';
import { LogIn } from 'components/authentication/Authentication';
import types from './types';
import { getProfileURL, DownloadFileUtil } from 'utils/Commons';
import { validateNotificacoes } from 'components/demandas/perguntas/ValidationHelper';

import history from '@/history.js';

export const filtrarDemandas = (termo) => ({
  type: types.FILTRAR_DEMANDAS,
  payload: termo,
});

export const limparPesquisa = () => {
  return {
    type: types.LIMPAR_PESQUISA,
  };
};

/**
 * Metodo que prepara o store da demanda para a criação de um novo registro.
 */
export const createDemanda = (successCallback) => async (dispatch) => {
  dispatch({ type: types.CREATE_DEMANDA });
  if (successCallback) {
    successCallback();
  }
};

export const validateDemanda =
  ({ successCallback, errorCallback }) =>
  async (dispatch, getState) => {
    let dadosDemanda = getState().demandas.demanda_atual;
    let authState = getState().app.authState;

    let geralFormErros = validateGeralForm(dadosDemanda.geral);
    let perguntasErros = validateQuestionList(dadosDemanda.perguntas);
    let publicoAlvoErros = validatePublicoAlvo(
      dadosDemanda.publicoAlvo ? dadosDemanda.publicoAlvo : {},
    );
    let notificacoesErros = validateNotificacoes(
      dadosDemanda.notificacoes ? dadosDemanda.notificacoes : {},
    );

    /*  Checa se não existe os colaboradores. Caso negativo inclui o usuário logado na lista */
    if (!('colaboradores' in dadosDemanda)) {
      if (!authState.isLoggedIn) {
        LogIn();
        var checaLogado = setInterval(() => {
          if (authState.isLoggedIn) {
            clearInterval(checaLogado);
            let novaLista = [
              {
                key: authState.sessionData.chave,
                matricula: authState.sessionData.chave,
                nome: authState.sessionData.nome_usuario,
                cargo: authState.sessionData.nome_funcao,
                img: getProfileURL(authState.sessionData.chave),
                prefixo: authState.sessionData.prefixo,
                nome_prefixo: authState.sessionData.dependencia,
              },
            ];

            dispatch({
              type: types.UPDATE_FORM_DATA,
              payload: { propName: 'colaboradores', formData: novaLista },
            });
          }
        }, 500);
      } else {
        let novaLista = [
          {
            key: authState.sessionData.chave,
            matricula: authState.sessionData.chave,
            nome: authState.sessionData.nome_usuario,
            cargo: authState.sessionData.nome_funcao,
            img: getProfileURL(authState.sessionData.chave),
            prefixo: authState.sessionData.prefixo,
            nome_prefixo: authState.sessionData.dependencia,
          },
        ];

        dispatch({
          type: types.UPDATE_FORM_DATA,
          payload: { propName: 'colaboradores', formData: novaLista },
        });
      }
    }

    //verifica se existe pelo menos alguma pergunta na lista.
    if (!dadosDemanda.perguntas || !dadosDemanda.perguntas.length) {
      //nenhuma pergunta na lista
      perguntasErros = { erros: ['Adicione ao menos uma pergunta!'] };
    }

    if (
      geralFormErros.length ||
      !_.isEmpty(perguntasErros) ||
      publicoAlvoErros.length ||
      notificacoesErros.length
    ) {
      let demanda_erros = {
        geral: geralFormErros,
        perguntas: perguntasErros,
        publicoAlvo: publicoAlvoErros,
        notificacoes: notificacoesErros,
      };

      //chama a callback de erro informando que houveram erros na validacao
      if (errorCallback) {
        errorCallback(
          'Existem erros na validação da demanda, corrija-os e tente novamente.',
        );
      }

      //existem erros em algum dos formularios, faz um dispatch para atualizar as mensagens no store
      dispatch({ type: types.UPDATE_ERROR_MESSAGES, payload: demanda_erros });
    } else {
      //Limpa os status de erro.
      dispatch({ type: types.CLEAR_ERROR_MESSAGES });

      //sem erros de validacao nos formularios, chama a callback de sucesso.
      if (successCallback) {
        successCallback();
      }
    }
  };

export const saveDemanda =
  ({ successCallback, errorCallback }) =>
  async (dispatch, getState) => {
    let response;
    let dadosDemanda = getState().demandas.demanda_atual;

    //remove o historico antes de enviar os dados da demanda
    delete dadosDemanda['historico'];

    try {
      //Exclui os dados referentes ao tipo de demanda não escolhido
      if (dadosDemanda.publicoAlvo.tipoPublico === 'publicos') {
        delete dadosDemanda.publicoAlvo['lista'];
      } else {
        delete dadosDemanda.publicoAlvo['publicos'];
      }

      if (dadosDemanda.id) {
        response = await apiModel.patch('/demandas', dadosDemanda);
      } else {
        response = await apiModel.post('/demandas', dadosDemanda);
      }

      if (response && response.data) {
        //atualiza o historico da demanda.
        dispatch({ type: types.SAVE_DEMANDA, payload: response.data });
      }

      successCallback();
      if (!dadosDemanda.id) {
        //Caso for a criacao de uma nova demanda, redireciona para a tela de edição.
        history.push('/demandas/editar-demanda/' + response.data.id);
      }
    } catch (error) {
      let errorMessage = 'Sem conexão com o servidor.';

      if (error.response) {
        if (error.response.data && error.response.data.errorMessage) {
          errorMessage = error.response.data.errorMessage;
        } else {
          errorMessage = error.response.statusText;
        }
      }
      errorCallback(errorMessage);
    }
  };

/**
 * Atualiza os dados da demanda conforme propriedade especificada em propName.
 * Ex. propName - geral, perguntas, colaboradores.
 * @param {A} propName - nome da propriedade no objeto demanda.
 * @param {*} formData - dados a serem atualizados.
 */

export const updateFormData = (propName, formData) => {
  return {
    type: types.UPDATE_FORM_DATA,
    payload: {
      propName,
      formData,
    },
  };
};

export const fetchColaborador =
  (matricula, responseHandler) => async (dispatch, getState) => {
    try {
      let response = await apiModel.get('/funci/' + matricula);
      let colaborador = response.data;

      if (!colaborador) {
        responseHandler.errorCallback();
        return;
      }

      let listaAtual = getState().demandas.demanda_atual.colaboradores;
      let novaLista = [
        ...listaAtual,
        {
          key: colaborador.matricula,
          matricula: colaborador.matricula,
          nome: colaborador.nome,
          cargo: colaborador.descCargo,
          img: getProfileURL(colaborador.matricula),
          prefixo: colaborador.dependencia.prefixo,
          nome_prefixo: colaborador.dependencia.nome,
        },
      ];

      dispatch({
        type: types.UPDATE_FORM_DATA,
        payload: { propName: 'colaboradores', formData: novaLista },
      });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback();
    }
  };

export const fetchEstatisticasDemanda =
  ({ idDemanda, responseHandler }) =>
  async (dispatch) => {
    try {
      let response = await apiModel.get(
        '/demandas/estatisticas/respostas/' + idDemanda,
      );
      if (!response) {
        responseHandler.errorCallback();
        return;
      }

      dispatch({
        type: types.FETCH_ESTATISTICAS_DEMANDA,
        payload: response.data,
      });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback();
    }
  };

export const fetchStatusNotificacoes =
  ({ idDemanda, responseHandler }) =>
  async (dispatch) => {
    try {
      let response = await apiModel.get(
        '/demandas/status/notificacoes/' + idDemanda,
      );
      if (!response) {
        responseHandler.errorCallback();
        return;
      }

      dispatch({
        type: types.FETCH_STATUS_NOTIFICACOES,
        payload: response.data,
      });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback();
    }
  };

export const fetchHistoricoNotificacoes =
  ({ idDemanda, responseHandler }) =>
  async (dispatch) => {
    try {
      let response = await apiModel.get(
        '/demandas/notificacoes/historico/' + idDemanda,
      );
      if (!response) {
        responseHandler.errorCallback();
        return;
      }

      dispatch({
        type: types.FETCH_HISTORICO_NOTIFICACOES,
        payload: response.data,
      });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback();
    }
  };

/**
 * Busca os dados da demanda com o id informado.
 * @param idDemanda - (string) id da demanda (hash)
 * @param responseHandler - (object) - objeto contendo as chaves
 *                          successCallback e errorCallback referentes as
 *                          funcoes de tratamento do resultado do envio da solicitacao.
 *
 */

export const fetchDemanda =
  ({ idDemanda, responseHandler, apenasColaborador }) =>
  async (dispatch) => {
    try {
      let options = {};
      console.log("Before")
      if (apenasColaborador) {
        options.apenasColaborador = true;
      }
      let response = await apiModel.get('/demandas/' + idDemanda, {
        params: { ...options },
      });
      console.log("After")
      console.log(response)
      dispatch({ type: types.FETCH_DEMANDA, payload: response.data });
      responseHandler.successCallback();
    } catch (error) {
      let errorMessage = null;

      if (error.response) {
        errorMessage = error.response.data;
      }

      responseHandler.errorCallback(errorMessage);
    }
  };

export const fetchDemandasAdm =
  ({ typeFetch, responseHandler, mostrarTodas }) =>
  async (dispatch) => {
    try {
      let response = await apiModel.get('/demandas/adm', {
        params: { type: typeFetch, showAll: mostrarTodas },
      });
      dispatch({ type: types.FETCH_DEMANDAS, payload: response.data });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback(error);
    }
  };

export const fetchDemandasResponder =
  ({ typeFetch, responseHandler }) =>
  async (dispatch) => {
    try {
      let response = await apiModel.get('/demandas/responder/' + typeFetch);
      dispatch({ type: types.FETCH_DEMANDAS, payload: response.data });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback(error);
    }
  };

export const enviarConvites =
  ({ idDemanda, responseHandler }) =>
  async (dispatch) => {
    try {
      dispatch({ type: types.ENVIANDO_CONVITES, payload: true });
      await apiModel.post('/demandas/notificacoes/convites/' + idDemanda);
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback(error);
    }
  };

export const enviarNotificacoes =
  ({ idDemanda, responseHandler }) =>
  async (dispatch) => {
    try {
      dispatch({ type: types.ENVIANDO_LEMBRETES, payload: true });
      await apiModel.post('/demandas/notificacoes/lembretes/' + idDemanda);
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback(error);
    }
  };

export const filtrarExpiradas = (checked) => {
  return {
    type: types.FILTRAR_EXPIRADAS,
    payload: {
      mostrarDesativadas: checked,
    },
  };
};

export const arquivarDemanda =
  ({ idDemanda, responseHandler }) =>
  async () => {
    try {
      await apiModel.patch('/demandas/arquivar/' + idDemanda);
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback();
    }
  };

export const duplicarDemanda =
  ({ idDemanda, responseHandler, qtd }) =>
  async () => {
    try {
      await apiModel.post('/demandas/duplicar/' + idDemanda, { qtd });
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback();
    }
  };

export const reativarDemanda =
  ({ idDemanda, responseHandler }) =>
  async () => {
    try {
      await apiModel.patch('/demandas/reativar/' + idDemanda);
      responseHandler.successCallback();
    } catch (error) {
      responseHandler.errorCallback();
    }
  };

/**
 * Atualiza o objeto de erros da demanda conforme propriedade especificada em propName.
 * Ex. propName - geral, perguntas, colaboradores.
 * @param {A} propName - nome da propriedade no objeto demanda.
 * @param {*} hasError - boolean (true/false).
 */

export const updateErrorStatus = (propName, hasError) => {
  return {
    type: types.UPDATE_ERROR_MESSAGES,
    payload: {
      propName,
      hasError,
    },
  };
};

/**
 * Limpa o objeto de erros das perguntas especificamente.
 * Tem o objetivo de limpar as mensagens quando todas as perguntas são removidas.
 */

export const clearQuestionErrorStatus = () => {
  return {
    type: types.CLEAR_QUESTION_MESSAGES,
  };
};

/**
 * Busca as respostas da demanda com o id informado para o usuario logado.
 * @param {String} idDemanda - id da demanda (hash)
 * @param {Object} responseHandler - (object) - objeto contendo as chaves
 *                          successCallback e errorCallback referentes as
 *                          funcoes de tratamento do resultado do envio da solicitacao.
 *
 */

export const fetchResposta =
  ({ idDemanda, responseHandler, hashLista }) =>
  async () => {
    try {
      let response = await apiModel.get('/demandas/respostas/' + idDemanda, {
        params: { hashLista },
      });
      //Nao faz dispatch para o reducer, pois os dados serao retornados
      //diretamente para quem chamou.
      responseHandler.successCallback(response.data);
    } catch (error) {
      if (responseHandler.errorCallback) {
        responseHandler.errorCallback();
      }
    }
  };

/**
 * Para os casos de demanda do tipo Lista e que permita Respostas Infinitas, busca as respostas já dadas anteriormente
 * @param {String} idDemanda - id da demanda (hash)
 * @param {Object} responseHandler - (object) - objeto contendo as chaves
 *                          successCallback e errorCallback referentes as
 *                          funcoes de tratamento do resultado do envio da solicitacao.
 *
 */

export const fetchRespostasAnteriores =
  ({ idDemanda, responseHandler }) =>
  async (dispatch) => {
    try {
      let response = await apiModel.get(
        '/demandas/respostas-anteriores/' + idDemanda,
      );
      //Nao faz dispatch para o reducer, pois os dados serao retornados
      //diretamente para quem chamou.
      responseHandler.successCallback(response.data);
    } catch (error) {
      if (responseHandler.errorCallback) {
        responseHandler.errorCallback();
      }
    }
  };

/**
 * Action responsável por salvar as repostas e finalizar o preenchimento do formulário.
 * As repostas serão salvas em definitivo, não podendo o usuário editá-las posteriormente,
 * apenas visualizá-las.
 *
 * @param {String} idDemanda - id da demanda
 * @param {Object} respostas - objeto com os dados de resposta por questao (apenas as respostas)
 * @param {Object} responseHandler - objeto com as callbacks de sucesso e erro.
 */
export const registrarRespostas =
  ({ idDemanda, respostas, responseHandler, hashLista }) =>
  async () => {
    try {
      const response = await apiModel.post('/demandas/respostas/' + idDemanda, {
        respostas,
        hashLista,
      });
      responseHandler.successCallback(response.data);
    } catch (error) {
      if (responseHandler && responseHandler.errorCallback) {
        responseHandler.errorCallback();
      }
    }
  };

/**
 * Action responsável por salvar o rascunho das respostas a fim de que o usuário possa
 * retomar o preenchimento do formulario em momento posterior sem perder o trabalho ja
 * feito.
 *
 * @param {String} idDemanda - id da demanda
 * @param {Object} respostas - objeto com os dados de resposta por questao (apenas as respostas)
 * @param {Object} responseHandler - objeto com as callbacks de sucesso e erro.
 */
export const salvarRascunhoRespostas =
  ({ idDemanda, respostas, idRascunho, responseHandler, hashLista }) =>
  async () => {
    try {
      const response = await apiModel.post(
        '/demandas/respostas/rascunho/' + idDemanda,
        { respostas, idRascunho, hashLista },
      );
      responseHandler.successCallback(response.data);
    } catch (error) {
      if (responseHandler && responseHandler.errorCallback) {
        responseHandler.errorCallback();
      }
    }
  };

/**
 * Busca os dados da demanda com o id informado.
 * Este metodo nao retorna os dados do historico e verifica se o
 * usuario logado eh publico alvo da demanda solicitada.
 *
 * @param idDemanda - (string) id da demanda (hash)
 * @param responseHandler - (object) - objeto contendo as chaves
 *                          successCallback e errorCallback referentes as
 *                          funcoes de tratamento do resultado do envio da solicitacao.
 *
 */

export const fetchResponderDemanda =
  ({ idDemanda, responseHandler }) =>
  async (dispatch) => {
    console.log('this.state.idDemanda');
    console.log(idDemanda);
    console.log(responseHandler);
    try {
      let response = await apiModel.get('/demandas/responder/' + idDemanda);
      dispatch({ type: types.FETCH_DEMANDA, payload: response.data });
      responseHandler.successCallback();
    } catch (error) {
      console.log('error');
      console.log(error);
      let what =
        error.response && error.response.data ? error.response.data : null;
      responseHandler.errorCallback(what);
    }
  };

/**
 * Faz o download das respostas de uma determinada demanda em CSV.
 * Já abre a janela de salvar download direto na tela, sem ter que abrir uma nova aba
 * gracas ao metodo utilitario DownloadFileUtil.
 */
export const fetchDownloadRespostas =
  ({ idDemanda, fileName, apenasFinalizadas, responseHandler }) =>
  async () => {
    try {
      let response = await apiModel.get('/demandas/respostas/csv', {
        params: { idDemanda, apenasFinalizadas },
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

/**
 * Faz o download do público-alvo que já respondeu uma determinada demanda em CSV.
 */
export const downloadPublicoAlvoRespostas =
  ({ idDemanda, type, fileName, responseHandler }) =>
  async () => {
    try {
      let response = await apiModel.get('/demandas/publicoalvo/csv', {
        responseType: 'blob',
        params: { idDemanda, type },
      });
      DownloadFileUtil(fileName, response.data);
      responseHandler.successCallback();
    } catch (error) {
      let what =
        error.response && error.response.data ? error.response.data : null;
      responseHandler.errorCallback(what);
    }
  };

/**
 * Exclui respostas de uma determinada demanda.
 * Caso seja passado o flag excluirTodas - todas as respostas serao excluidas da demanda.
 * Caso seja passado apenas o idResposta, apenas um registro sera removido.
 */
export const excluirRespostas =
  ({ idDemanda, idResposta, excluirTodas, responseHandler }) =>
  async () => {
    try {
      const response = await apiModel.post(
        '/demandas/respostas/excluir/' + idDemanda,
        { idResposta: idResposta, excluirTodas: excluirTodas },
      );
      responseHandler.successCallback(response.data);
    } catch (error) {
      if (responseHandler && responseHandler.errorCallback) {
        let what =
          error.response && error.response.data ? error.response.data : null;
        responseHandler.errorCallback(what);
      }
    }
  };

/**
 * Exclui uma resposta referente a uma ocorrencia de uma determinada demanda (uso exclusido do modulo Lista)
 */
export const excluirOcorrencia =
  ({ idDemanda, hashLista, responseHandler }) =>
  async () => {
    try {
      const response = await apiModel.post(
        '/demandas/respostas/excluir-ocorrencia/' + idDemanda,
        { hashLista: hashLista },
      );
      responseHandler.successCallback(response.data);
    } catch (error) {
      if (responseHandler && responseHandler.errorCallback) {
        let what =
          error.response && error.response.data ? error.response.data : null;
        responseHandler.errorCallback(what);
      }
    }
  };
