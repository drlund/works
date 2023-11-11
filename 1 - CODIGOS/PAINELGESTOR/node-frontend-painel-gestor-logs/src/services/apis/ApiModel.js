/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable max-classes-per-file */
import https from 'https-browserify';
import axios from 'axios';
import {
  getSessionState,
  verifyUnauthorizedStatus,
  verifyAuthState,
  addListenCallback,
  isLoggedIn
} from '../../components/authentication/Authentication';

class Axios {
  constructor() {
    // eslint-disable-next-line no-constructor-return
    return axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
  }
}

export const { CancelToken, isCancel } = axios;

class ApiModel extends Axios {
  logInPoll = null;

  constructor() {
    super();
    this.cbkNumber = Math.random() * 5000;
    this.defaults.baseURL = process.env.REACT_APP_ENDPOINT_API_URL;
    this.defaults.params = {};
    this.defaults.withCredentials = true;

    if (window.bbapi) {
      const sessionState = getSessionState();
      this.defaults.params.token = sessionState.token;
      this.callbackId = `axios_cbk_${this.cbkNumber}`;
      addListenCallback(this.callbackId, this.onAuthStateChange);
    }

    // obtem a referencia da instancia para usar no promisse
    // eslint-disable-next-line no-underscore-dangle
    var _this = this;

    // interceptor da requisicao antes da mesma ser enviada
    this.interceptors.request.use(function (config) {
      // verifica o estado da autenticacao do usuario
      verifyAuthState();

      if (!isLoggedIn()) {
        return new Promise((resolve) => {
          // loop de espera pelo login do usuario
          _this.logInPoll = setInterval(() => {
            if (isLoggedIn()) {
              clearInterval(_this.logInPoll);
              // apos o login com sucesso, pega o novo token.
              const sessionState = getSessionState();
              _this.defaults.params.token = sessionState.token;
              resolve(config);
            }
          }, 500);
        });
      }

      // ja esta logado.
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });

    // interceptor da resposta
    this.interceptors.response.use(function (response) {
      return Promise.resolve(response);
    }, function (error) {
      // verifica o codigo de erro (status) da resposta
      verifyUnauthorizedStatus(error.response);
      return Promise.reject(error);
    });
  }

  onAuthStateChange = (sessionState) => {
    this.defaults.params.token = sessionState.token;
  };
}

export default new ApiModel();
