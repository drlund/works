import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

const getListaSubsidiarias = () => fetch(FETCH_METHODS.GET, 'procuracoes/cadastro/lista-subsidiarias');

export default getListaSubsidiarias;
