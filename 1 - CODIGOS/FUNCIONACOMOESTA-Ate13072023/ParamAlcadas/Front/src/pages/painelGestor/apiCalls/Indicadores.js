import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

/* ------------ API CALLS -------------- */

export const getSubordinadasByPrefixo = (prefixo) => fetch(FETCH_METHODS.GET, '/painel/lista-subordinadas', {prefixo});
export const getIndicadores = (prefixo, subord) => fetch(FETCH_METHODS.GET, '/painel/indicadores/', {prefixo, subord});