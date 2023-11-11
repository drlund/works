
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const getLogAcessos = (/** @type {any} */ id) => fetch(FETCH_METHODS.GET, '/painel/logAcesso?page=2&pageSize=10/', id);
export const getLogAtualizacoes = (/** @type {any} */ id) => fetch(FETCH_METHODS.GET, '/painel/logAtualizacoes?page=2&pageSize=10/', id);
