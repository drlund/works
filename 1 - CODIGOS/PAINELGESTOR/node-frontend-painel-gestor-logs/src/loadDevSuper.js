/* eslint-disable no-console */
import types from './services/actions/commons/types';
import { FETCH_METHODS, fetch } from './services/apis/GenericFetch';

export function loadDevSuper(/** @type {*} */ store) {
  if (process.env.NODE_ENV === 'development') {
    console.group('DEV TOOLS: mudanças rápidas de usuario logado direto pelo console.');

    const getData = () => store.getState().app.authState.sessionData;

    const initialSessionData = getData();

    const doChange = (/** @type {*} */ newSessionData, updatePermission = false) => {
      store.dispatch({
        type: types.AUTH_STATE_CHANGE,
        payload: {
          ...store.getState().app.authState,
          sessionData: {
            ...getData(),
            ...newSessionData
          },
          perms: updatePermission ? null : store.getState().app.authState.perms
        }
      });

      if (updatePermission) {
        return fetch(FETCH_METHODS.GET, '/acessos/permissoes')
          .then((response) => {
            store.dispatch({
              type: types.AUTH_STATE_CHANGE,
              payload: {
                ...store.getState().app.authState,
                perms: response
              }
            });

            return getData();
          });
      }

      return Promise.resolve(getData());
    };

    console.info('changeMatricula -> muda apenas a matricula do usuario logado');
    const changeMatricula = (/** @type {string} */ matricula) =>
      doChange({ matricula, chave: matricula })
        .then(console.log)
        .catch(console.error);

    console.info('changePrefixo -> muda apenas o prefixo do usuario logado');
    const changePrefixo = (/** @type {string|number} */ prefixo) =>
      doChange({ prefixo: String(prefixo), prefixo_efetivo: String(prefixo) })
        .then(console.log)
        .catch(console.error);

    console.info('impersonate -> altera totalmente o usuário e permissoes');
    const impersonate = (/** @type {string} */ matricula) =>
      fetch(FETCH_METHODS.POST, '/dev/change', { matricula })
        .then((resp) => doChange(resp, true))
        .then(console.log)
        .then(() => console.info('Alteração válida até recarregar a página.'))
        .catch(console.error);

    console.info('reset -> volta para o usuário inicial');
    const reset = () => fetch(FETCH_METHODS.GET, '/dev/reset')
      .then(() => doChange(initialSessionData, true))
      .then(() => console.info('Redefinido para usuário inicial.'))
      .catch((err) => console.error(err));

    console.info('getUser -> retorna dados do user logado');
    const getUser = () => fetch(FETCH_METHODS.GET, '/dev/user')
      .then(console.info)
      .catch((err) => console.error(err));

    // @ts-expect-error
    window.devSuper = ({
      changeMatricula,
      changePrefixo,
      getUser,
      impersonate,
      reset,
    });

    // @ts-expect-error
    console.info('Acesse o objeto `devSuper` para alterar as informações.', window.devSuper);
    console.groupEnd();
  }
}
