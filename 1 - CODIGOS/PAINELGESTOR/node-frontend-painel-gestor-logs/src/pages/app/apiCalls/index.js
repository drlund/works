import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const getTiposAcesso = () => fetch(FETCH_METHODS.GET, '/acessos/tipos');
