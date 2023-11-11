import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

const getCampanhas = async () => {
  
  return fetch(FETCH_METHODS.GET, `/ambiencia/campanhas`);
};

export default getCampanhas;
