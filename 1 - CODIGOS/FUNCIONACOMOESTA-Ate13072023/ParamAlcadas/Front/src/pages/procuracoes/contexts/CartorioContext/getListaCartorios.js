import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

const getListaCartorios = () => fetch(FETCH_METHODS.GET, '/procuracoes/cadastro/lista-cartorios');

export default getListaCartorios;
