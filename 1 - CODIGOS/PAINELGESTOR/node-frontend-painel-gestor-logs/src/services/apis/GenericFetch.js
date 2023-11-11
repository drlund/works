import apiModel from './ApiModel';
import { ExtractErrorMessage } from '../../utils/Commons';

/**
 * Importar os FETCH_METHODS junto do fetch do GenericFetch.
 */
function GenericFetchWrapper() {
  const GET = Symbol('get');
  const POST = Symbol('post');
  const PATCH = Symbol('patch');
  const DELETE = Symbol('delete');

  const FETCH_METHODS = /** @type {const} */ ({
    GET,
    POST,
    PATCH,
    DELETE,
  });


  /**
   * Esta função é um wrapper do apiModel com verificações adicionais
   *
   * Obrigatório usar os métodos em FETCH_METHODS
   * @param {typeof FETCH_METHODS[keyof FETCH_METHODS]} verb
   * @param {string} route
   * @param {Object} [params]
   * @param {Object} [headers]
   * @param {boolean} [returnCode]
   * @param {Object} [extraParamOptions] usado em caso de usar `GET` ou `DELETE`
   */
  async function fetch(
    verb,
    route,
    params,
    headers = {},
    returnCode = false,
    extraParamOptions = {}
  ) {
    const ALOWED_VERBS = [GET, POST, PATCH, DELETE];

    if (!ALOWED_VERBS.includes(verb)) {
      return Promise.reject('Método http não suportado!');
    }

    try {
      let response = {};

      if ([GET, DELETE].includes(verb)) {
        response = await apiModel[verb.description](route, {
          params: { ...params }, ...extraParamOptions
        }, headers);
      } else {
        response = await apiModel[verb.description](route, params, headers);
      }

      return Promise.resolve(response.data);
    } catch (error) {
      const msg = ExtractErrorMessage(error, 'Falha ao obter os dados do servidor!');
      if (returnCode) {
        return Promise.reject({ msg, code: error.response.status });
      }

      return Promise.reject(msg);
    }
  }

  /**
   * Usar os métodos na função fetch.
   */
  return {
    FETCH_METHODS,
    fetch,
  };
}

export const { FETCH_METHODS, fetch } = GenericFetchWrapper();
