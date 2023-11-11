import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

const getPrefixoAvaliavel = async (idEvento) => {
  
  return fetch(FETCH_METHODS.GET, `/ambiencia/prefixo-avaliavel/`, {
    idEvento,
  });
};

export default getPrefixoAvaliavel;
