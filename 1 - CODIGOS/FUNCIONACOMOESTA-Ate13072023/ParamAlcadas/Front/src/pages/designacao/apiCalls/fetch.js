import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const fetchPrefixosAndSubords = (prefixo, cancelToken = {}) => fetch(FETCH_METHODS.GET, '/desigint/depesubord/', { prefixo }, cancelToken);
export const getOptsBasicas = (dados) => fetch(FETCH_METHODS.GET, '/desigint/optsbasicas', { dados });
export const fetchDotacao = (prefixo, ger = false, gest = false) => fetch(FETCH_METHODS.GET, '/desigint/dotacao/', { prefixo, ger, gest });
export const getDiasNaoUteis = () => fetch(FETCH_METHODS.GET, '/desigint/getDiasNaoUteis/');
export const obterOptionsInstancias = () => fetch(FETCH_METHODS.GET, '/desigint/getoptionsinstancias/');
export const ausProg = (matricula) => fetch(FETCH_METHODS.GET, '/desigint/getausprogr/', { matricula });
export const getPrefixosTeste = () => fetch(FETCH_METHODS.GET, '/desigint/getprefixosteste/');
