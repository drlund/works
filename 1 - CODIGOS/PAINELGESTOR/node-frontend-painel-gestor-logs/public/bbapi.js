/**
 *    @author Andrew Yuri (F0742889) e Elvis Cunha (F2877688)
 *    @since 13/05/2019
 *
 *
 *    Classe para encapsular comportamento de Login na intranet do BB
 *
 */

var bbapi = (function () {
  
  let baseURL = '';
  if (window.location.toString().includes('localhost')) {
    baseURL = 'http://localhost/superadm/api/';
  } else if (window.location.toString().includes('desenv01')) {
    baseURL = 'https://desenv01adm.intranet.bb.com.br/superadm/api/';
  } else {
    baseURL = 'https://super.intranet.bb.com.br/superadm/api/';
  }

  /**
   * Concatena o endpoint com a url principal.
   */
  function create_api_url(endpoint) {
    return baseURL + endpoint;
  }

  var endPointURL = {
    login: create_api_url('login'),
    logout: create_api_url('logout'),
    pollURL: create_api_url('verify'),
    registerURL: create_api_url('register'),
  };

  //callback do usuario da bbapi
  var listenCallbackList = {};
  var initialized = false;
  var withPopup = false;
  var popupInstance = null;
  var intervalInstance = null;
  var popupTick = null;
  var tokenKey = '_bbapik';
  var maxPollingTries = 120;
  var countPollingTries = 0;

  var state = {
    isLoggedIn: false,
    token: '',
    sessionData: {},
  };

  /**
   * Funcoes auxiliares de verificacao de cookies.
   */

  function setCookie(cname, cvalue, exhours) {
    var d = new Date();
    d.setTime(d.getTime() + exhours * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  function cloneObj(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Fim das funcoes auxiliares.
   */

  /**
   * Verifica se o token passado ainda eh valido no servidor de autenticacao.
   * Caso esteja expirado, solicita um novo token e atualiza o state.
   * @param {*} token
   */
  function verify_local_token_valid(token) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', endPointURL.pollURL + '/' + token, false);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var userData = JSON.parse(xhr.response);
        if (userData) {
          setSessionData(userData);
        }
      } else {
        setCookie(tokenKey, '', 1);
        state.token = '';
        request_new_token();
      }
    };

    xhr.onerror = function () {
      request_new_token();
    };

    xhr.send();
  }

  /**
   * Solicita um novo token de registro ao servidor de autenticacao.
   */
  function request_new_token() {
    //cria um novo token chamando o register
    var xhr = new XMLHttpRequest();
    xhr.open('GET', endPointURL.registerURL, false);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var data = JSON.parse(xhr.response);

        if (data.error) {
          //nao conseguiu registrar um token para o usuario
          console.error(data.errorMessage);
        } else {
          //novo token recebido - seta o cookie para 02h e atualiza o state
          setCookie(tokenKey, data.bbapiToken, 2);
          state.token = data.bbapiToken;

          check_was_authenticated_on_another_window();

          //chama apenas para notificar os clientes de que
          //um novo token foi registrado.
          setSessionData({});
        }
      }
    };

    xhr.onerror = function () {
      console.error('Erro na rede. Verifique a sua conexão.');
    };

    xhr.send();
  }

  /**
   * Chama a rota de login para verificar se o usuario ja efetuou login
   * em outra janela.
   */
  function check_was_authenticated_on_another_window() {
    var testLoggedframe = document.getElementById('bbapi_test_login_frame');

    if (testLoggedframe) {
      testLoggedframe.remove();
    }

    var element = document.createElement('iframe');
    element.setAttribute('id', 'bbapi_test_login_frame');
    element.style.display = 'none';
    element.setAttribute('src', endPointURL.login + '/' + state.token);
    document.body.appendChild(element);
  }

  /**
   * ROTINA DE INICIALIZACAO DA BIBLIOTECA BBAPI
   * @param {*} showPopup - se true, abre o popup de login, false nao abre.
   *            util em alguns casos especificos que se deseje usar
   *            um iframe.
   */
  function init(showPopup) {
    //verifica se existe o token no cookie
    state.token = getCookie(tokenKey);
    initialized = true;
    countPollingTries = 0;

    if (typeof showPopup !== 'undefined') {
      //abre ou nao o popup de login
      withPopup = showPopup;
    }

    if (state.token === '') {
      request_new_token();
    } else {
      verify_local_token_valid(state.token);
    }
  }

  //FIM DA ROTINA DE INICIALIZACAO

  //configura os dados da sessao do usuario logado
  function setSessionData(sessionData) {
    state.sessionData = sessionData;
    state.isLoggedIn =
      sessionData && Object.keys(sessionData).length ? true : false;

    if (state.isLoggedIn) {
      clearPoll();
    }

    //se o popup de login estiver aberto, fecha-o
    if (popupInstance && !popupInstance.closed) {
      popupInstance.close();
      popupInstance = null;
    }

    var keysToDelete = [];

    //executa as callbacks de listen registradas
    for (var key in listenCallbackList) {
      if (listenCallbackList[key]) {
        listenCallbackList[key](state);
      } else {
        keysToDelete.push(key);
      }
    }

    //remove possiveis funcoes de callback invalidas
    for (var i = 0; i < keysToDelete.length; ++i) {
      delete listenCallbackList[keysToDelete[i]];
    }
  }

  //realiza o polling no servidor remoto de autenticacao
  function pollLoggedState() {
    if (!intervalInstance) {
      intervalInstance = setInterval(function () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', endPointURL.pollURL + '/' + state.token);
        xhr.send();
        countPollingTries++;

        if (countPollingTries >= maxPollingTries) {
          clearPoll();
        }

        xhr.onload = function () {
          if (xhr.status === 200) {
            //usario esta logado no servidor remoto.
            var userData = JSON.parse(xhr.response);
            if (userData) {
              setSessionData(userData);
            }
          }
        };

        xhr.onerror = function () {
          clearPoll();
        };

        //se o usuario nao logou e fechou o popup, cancela o polling.
        if (
          withPopup &&
          !state.isLoggedIn &&
          (!popupInstance || popupInstance.closed)
        ) {
          clearPoll();
        }

        if (!withPopup && state.isLoggedIn) {
          clearPoll();
        }
      }, 1000);
    }
  }

  //cancela a rotina de polling
  function clearPoll() {
    if (intervalInstance) {
      clearInterval(intervalInstance);
      intervalInstance = null;
      countPollingTries = 0;
    }
  }

  //limpa os dados da sessao e o token de autenticacao
  function destroySession() {
    state.token = '';
    setSessionData({});
  }

  return {
    //retorna o objeto contendo as informacoes do status do login.
    getState: function () {
      return cloneObj(state);
    },

    //retorna a situacao do login (true | false)
    isLoggedIn: function () {
      return state.isLoggedIn;
    },

    //retorna os dados da sessao do usuario logado
    getSessionData: function () {
      return cloneObj(state.sessionData);
    },

    //registra callback do usuario que sera chamada a cada mudanca no status do login
    addListenCallback: function (callbackId, fnCallback) {
      if (!(callbackId in listenCallbackList)) {
        listenCallbackList[callbackId] = fnCallback;
      }
    },

    //remove a callback da lista pelo id
    removeListenCallback: function (callbackId) {
      if (callbackId in listenCallbackList) {
        delete listenCallbackList[callbackId];
      }
    },

    init: function (showPopup) {
      init(showPopup);
    },

    //abre o popup para permitir
    logIn: function (openPopup) {
      //se ja estiver logado, apenas retorna.
      if (state.isLoggedIn) return;

      //se nao tiver sido chamado o metodo init, executa-o.
      if (!initialized) {
        this.init();
      }

      if (state.token === '') {
        console.error(
          'Erro: Token nao registrado no servidor de autenticacao.',
        );
        console.error('Tentando registrar novo token.');
        request_new_token();
        this.logIn();
        return;
      }

      //Abre o popup
      if (!popupInstance || popupInstance.closed) {
        if (withPopup || openPopup) {
          popupInstance = window.open(
            endPointURL.login + '/' + state.token,
            'Login Intranet',
            'location=no,toolbar=no,menubar=no,resizable=no,height=580, width=380',
          );

          //verifica se o popup foi fechado
          popupTick = setInterval(function () {
            if (!popupInstance) {
              clearInterval(popupTick);
              clearPoll();
              return;
            }

            if (popupInstance.closed) {
              clearInterval(popupTick);
              clearPoll();

              //IMPORTANTE!
              //caso o login tenha retornado para a pagina da intranet
              //esta chamada via iframe oculto faz com que os cookies de login sejam
              //configurados no servidor (php)
              var testLoggedframe = document.getElementById(
                'bbapi_test_login_frame',
              );

              if (testLoggedframe) {
                testLoggedframe.remove();
              }

              var element = document.createElement('iframe');
              element.setAttribute('id', 'bbapi_test_login_frame');
              element.style.display = 'none';
              element.setAttribute(
                'src',
                endPointURL.login + '/' + state.token,
              );
              document.body.appendChild(element);
            }
          }, 500);
        }

        //inicializa o polling do status do login do servidor.
        pollLoggedState();
      }

      if (withPopup && popupInstance) {
        popupInstance.focus();
      }
    },

    //destroy os dados da sessao
    logOut: function () {
      if (popupInstance && !popupInstance.closed) {
        popupInstance.close();
        popupInstance = null;
      }

      if (!state.isLoggedIn || state.token === '') {
        clearPoll();
        return;
      }

      var popupLogout = window.open(
        endPointURL.logout + '/' + state.token,
        'Logout Intranet',
        'location=no,toolbar=no,menubar=no,resizable=no,height=1, width=1',
      );

      if (popupLogout) {
        setTimeout(function () {
          popupLogout.close();
        }, 2000);
      }

      //limpa os dados da sessao
      destroySession();
    },

    destroySessionData: function () {
      //limpa os dados da sessao
      destroySession();

      if (popupInstance && !popupInstance.closed) {
        popupInstance.close();
        popupInstance = null;
        clearPoll();
      }
    },

    verifyTokenValid: function () {
      var $this = this;

      if (state.isLoggedIn) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', endPointURL.pollURL + '/' + state.token, false);
        xhr.onload = function () {
          if (xhr.status !== 200) {
            setCookie(tokenKey, '', 1);
            state.token = '';
            setSessionData({});
            request_new_token();
            $this.logIn();
          }
        };

        xhr.send();
      }
    },
  };
})();
