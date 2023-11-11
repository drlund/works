/* eslint-disable func-names */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-arrow-callback */
import { message } from 'antd';
import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import {
  authStateChange,
  updateUserPermissions,
  updateAppsStatus,
} from '../../services/actions/commons';
import ModalAuth from './ModalAuth';

const apiService = axios.create();

export const LogIn = () => {
  if (window.bbapi) {
    setTimeout(function () {
      try {
        window.bbapi.logIn();
      } catch (error) {
        message.error('Erro na rede. Verifique sua conexao e tente novamente');
      }
    }, 200);
  }
};

export const LogOut = () => (window.bbapi ? window.bbapi.logOut() : '');

export const getSessionState = () =>
  window.bbapi ? window.bbapi.getState() : {};

export const isLoggedIn = () =>
  window.bbapi ? window.bbapi.isLoggedIn() : false;

export const verifyUnauthorizedStatus = (response) => {
  if (response && response.status === 401 && response.data) {
    if (
      response.data.errorType &&
      response.data.errorType === 'invalid_token'
    ) {
      if (window.bbapi) {
        // token invalido - desloga na api e faz o login novamente
        try {
          // message.error('Falha na autenticação. Efetuando login novamente.');
          window.bbapi.destroySessionData();
          window.bbapi.logIn(true);
        } catch (error) {
          message.error(
            'Erro na rede. Verifique sua conexao e tente novamente',
          );
        }
      }
    }
  }
};

export const verifyAuthState = () => {
  if (window.bbapi) {
    // assegura que o usuario esta autenticado
    try {
      window.bbapi.logIn();
    } catch (error) {
      message.error('Erro na rede. Verifique sua conexao e tente novamente');
    }
  }
};

export const addListenCallback = (callbackId, callbackFunction) => {
  if (window.bbapi) {
    window.bbapi.addListenCallback(callbackId, callbackFunction);
  }
};

const callbackId = 'auth_cbk';

class Authentication extends React.Component {
  componentDidMount() {
    if (window.bbapi) {
      // registra a callback
      window.bbapi.addListenCallback(callbackId, this.onAuthStateChange);

      // inicializa a biblioteca
      try {
        window.bbapi.init();
      } catch (error) {
        message.error('Erro na rede. Verifique sua conexao e tente novamente');
      }
    }
  }

  componentWillUnmount() {
    if (window.bbapi) {
      window.bbapi.logOut();
    }
  }

  onAuthStateChange = (sessionState) => {
    this.props.authStateChange(sessionState);

    // obtem a lista das permissoes do usuario
    if (sessionState.isLoggedIn && !this.props.atualPerms.length) {
      this.getPermissoesUsuario(sessionState.token);
      this.getAppsStatus(sessionState.token);
    }
  };

  getPermissoesUsuario = (token, fromAction) => {
    apiService.defaults.baseURL = process.env.REACT_APP_ENDPOINT_API_URL;
    apiService.defaults.params = { token };
    apiService
      .get('/acessos/permissoes')
      .then((response) => {
        this.props.updateUserPermissions(response.data);
        if (fromAction) {
          message.success('Acessos recarregados com sucesso!');
        }
      })
      .catch((error) => {
        if (error.response) {
          this.props.updateUserPermissions(error.response.data);
        } else {
          this.props.updateUserPermissions('');
        }

        if (fromAction) {
          message.error(
            'Falha ao recarregar os seus acessos. Tente novamente.',
          );
        }
      });
  };

  getAppsStatus = (token, fromAction) => {
    apiService.defaults.baseURL = process.env.REACT_APP_ENDPOINT_API_URL;
    apiService.defaults.params = { token };
    apiService
      .get('/gerenciador-ferramentas')
      .then((response) => {
        this.props.updateAppsStatus(response.data);
        if (fromAction) {
          message.success('Status das aplicações carregados com sucesso!');
        }
      })
      .catch((error) => {
        if (error.response) {
          this.props.updateAppsStatus(error.response.data);
        } else {
          this.props.updateAppsStatus('');
        }

        if (fromAction) {
          message.error(
            'Falha ao recarregar os status das aplicações. Tente novamente.',
          );
        }
      });
  };

  render() {
    const atualToken =
      this.props.atualToken && this.props.atualToken.length
        ? this.props.atualToken
        : null;

    if (this.props.reloadPermissions && atualToken) {
      this.getPermissoesUsuario(atualToken, true);
      this.getAppsStatus(atualToken, true);
    }

    if (this.props.isLoggedIn === false && atualToken) {
      return <ModalAuth visible token={atualToken} />;
    }
    return null;
  }
}

const mapStateToProps = (state) => ({
  reloadPermissions: state.app.reloadPermissions,
  atualToken: state.app.authState.token,
  isLoggedIn: state.app.authState.isLoggedIn,
  atualPerms: state.app.authState.perms || '',
});

export default connect(mapStateToProps, {
  authStateChange,
  updateUserPermissions,
  updateAppsStatus,
})(Authentication);
