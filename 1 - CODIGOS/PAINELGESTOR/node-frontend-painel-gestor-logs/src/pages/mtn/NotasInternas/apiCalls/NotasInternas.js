import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

/* ------------ API CALLS -------------- */

export const novaNota = (notaInterna) => fetch(FETCH_METHODS.POST, '/mtn/adm/nova-nota', {notaInterna});
export const getNotasByEnvolvido = (idEnvolvido, idMtn) => fetch(FETCH_METHODS.GET, '/mtn/adm/notas-internas', {idEnvolvido});
export const gravarLeituraNota = (leituraNota) => fetch(FETCH_METHODS.POST, '/mtn/adm/leitura-nota', {leituraNota})