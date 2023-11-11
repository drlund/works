import types from 'services/actions/commons/types';

const defaultAppState = {
  sideBarCollapsed: false,
  fullScreenMode: false,
  reloadPermissions: false,
  authState: {
    isLoggedIn: false
  }
};

/**
 * Reducer geral que trata todas as actions comuns que envolvem o estado da aplicação como um todo.
 */
export default (state = defaultAppState, action) => {
  switch (action.type) {
    case types.TOGGLE_SIDEBAR:
      //se passar um boolean no payload, obedece o valor deste, senao apenas
      //inverte o valor de sideBarCollapsed do estado.
      return { ...state, sideBarCollapsed: (action.payload ? action.payload : !state.sideBarCollapsed) };

    case types.TOGGLE_FULLSCREEN:
      return { ...state, fullScreenMode: action.payload, sideBarCollapsed: action.payload };

    case types.AUTH_STATE_CHANGE:
      return { ...state, authState: action.payload };
  
    case types.UPDATE_PERMISSIONS:
      
      return { ...state, reloadPermissions: false, authState: {...state.authState, perms: action.payload }}

    case types.RELOAD_USER_PERMISSIONS:
      return { ...state, reloadPermissions: true }
    default:
      return state;
  }
}