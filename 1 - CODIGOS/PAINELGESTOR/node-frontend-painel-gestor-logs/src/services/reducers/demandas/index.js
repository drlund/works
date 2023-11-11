import demandasTypes from 'services/actions/demandas/types';
import _ from 'lodash';

const defaultErrorStatus = {
  geral: [],
  perguntas: {},
  publicoAlvo: [],
  colaboradores: []
};

const initialState = {
  baseDemandas: [],
  resultado: [],
  demanda_atual: {},
  estatisticasDemanda: {},
  historicoNotificacoes: {},
  statusNotificacoes: {},
  demanda_erros: defaultErrorStatus
}

export default (state = initialState, action) => {
  switch (action.type) {
    case demandasTypes.LIMPAR_PESQUISA:
      return { ...state, resultado: []}

    case demandasTypes.CREATE_DEMANDA:
      return { ...state, demanda_atual: {}, demanda_erros: defaultErrorStatus};

    case demandasTypes.SAVE_DEMANDA:
      return { ...state, demanda_atual: {...state.demanda_atual, ...action.payload} };

    case demandasTypes.FETCH_DEMANDA:
      return { ...state, demanda_atual: action.payload, demanda_erros: defaultErrorStatus };
    
    case demandasTypes.FETCH_DEMANDAS:
      return {...state, baseDemandas: action.payload};

    case demandasTypes.UPDATE_FORM_DATA:
      let propName = action.payload.propName;
      let formData = action.payload.formData;
      let newState = { ...state.demanda_atual }

      if (_.isArray(formData)) {
        //passando um array para isObject retorna true no lodash. :(
        newState[propName] = formData;
      } else if (_.isObject(formData)) {
        newState[propName] = {...newState[propName], ...formData };
      } else {
        newState[propName] = formData;
      }
      
      return { ...state, demanda_atual: newState}

    case demandasTypes.UPDATE_ERROR_MESSAGES:
      return { ...state, demanda_erros: action.payload}

    case demandasTypes.CLEAR_ERROR_MESSAGES:
      return { ...state, demanda_erros: defaultErrorStatus}

    case demandasTypes.CLEAR_QUESTION_MESSAGES:
      return { ...state, demanda_erros: { ...state.demanda_erros, perguntas: {} }}
    case demandasTypes.FETCH_ESTATISTICAS_DEMANDA:
      return {...state, estatisticasDemanda: action.payload};
    case demandasTypes.FETCH_PUBLICO_ALVO:
        return {...state, publicoAlvo: action.payload};      
    case demandasTypes.FETCH_STATUS_NOTIFICACOES:
      return {...state, statusNotificacoes: action.payload};   
    case demandasTypes.ENVIANDO_LEMBRETES:
        return {...state, statusNotificacoes: {...state.statusNotificacoes, lembretes: {...state.statusNotificacoes.lembretes, enviando: true}  }};                    
    case demandasTypes.ENVIANDO_CONVITES:
        return {...state, statusNotificacoes: {...state.statusNotificacoes, convites: {...state.statusNotificacoes.convites, enviando: true}  }};
    case demandasTypes.FETCH_HISTORICO_NOTIFICACOES:
        return {...state, historicoNotificacoes: action.payload};      
    default:
      return state;
  }
}