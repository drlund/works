import types from './types';

/**
 * Action para indicar a mudanca de estado na largura da sidebar.
 * Caso seja passado o parametro collapsed, faz a sidebar obedecer
 * este valor: true - barra minimizada, false - barra exibida completa.
 * Se nao for passado o parametro, simplesmente inverte o estado da
 * sidebar.
 */
export const toggleSideBar = (collapsed = null) => ({
  type: types.TOGGLE_SIDEBAR,
  payload: collapsed,
});

/**
 * Action para indicar a mudanda de estado da aplicacao para
 * fullscreen. No caso de ativado, reduz a sidebar e oculta a
 * navbar.
 * @param {*} active
 */
export const toggleFullScreen = (active = false) => ({
  type: types.TOGGLE_FULLSCREEN,
  payload: active,
});

/**
 * Action para atualiza os dados de sessao de login da aplicacao.
 *
 * @param {*} authState
 */
export const authStateChange = (authState = {}) => ({
  type: types.AUTH_STATE_CHANGE,
  payload: authState,
});

/**
 * Action para atualizar a lista de permissoes do usuario.
 *
 * @param {*} cryptoList - string criptografada com as lista das permissoes do
 *                         usuario por ferramenta.
 */
export const updateUserPermissions = (cryptoList = '') => ({
  type: types.UPDATE_PERMISSIONS,
  payload: cryptoList,
});

/**
 * Action para recarregar a lista de permissoes do usuario.
 */
export const reloadUserPermissions = () => ({
  type: types.RELOAD_USER_PERMISSIONS,
});
