import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

/* ------------ API CALLS -------------- */

export const fetchAcesso = () => fetch(FETCH_METHODS.GET, '/painel/acesso');

