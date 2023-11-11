import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';
import { validarMatricula } from './validarMatricula';

const pesquisarOutorgado = (matricula, idFluxo) => {
  const termoPesquisa = `${matricula.length < 8 ? 'f' : ''}${matricula}`;
  const isTermoValido = validarMatricula(termoPesquisa);

  if (!isTermoValido) {
    return Promise.reject('Digite uma matrícula.');
  }

  return fetch(FETCH_METHODS.GET, 'procuracoes/cadastro/pesquisar-outorgado', {
    termoPesquisa,
    idFluxo,
  });
};

export default pesquisarOutorgado;
