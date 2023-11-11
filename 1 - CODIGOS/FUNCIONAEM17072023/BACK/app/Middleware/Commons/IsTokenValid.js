'use strict';
const Env = use('Env');

const https = require('https');
const axios = require('axios').create({
  baseURL: Env.get('AUTHENTICATION_ENDPOINT'),
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

class IsTokenValid {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle(ctx, next, properties) {

    const { request, response, session } = ctx;
    let { token } = request.allParams();

    if (!token) {
      if (process.env.NODE_ENV !== 'development') {
        return response.status(401).send({ errorType: 'invalid_token' });
      }
    }

    let verify_endpoint = '/verify/' + token;

    if (properties.includes('withRoles')) {
      verify_endpoint += '/withRoles';
    }

    try {
      if ((!session.get('currentUserAccount') || session.get('lastAuthToken') !== token)
        || properties.includes('withRoles')) {
        //se nao estiver logado na sessao, obtem os dados do funci
        const verifyResponse = await axios.get(verify_endpoint);
        //limpa os arquivos de sessao
        this.clearSession(session);

        //inclui os novos dados na sessao
        session.put('currentUserAccount', verifyResponse.data);
        session.put('lastAuthToken', token);

      }
    } catch (error) {
      this.clearSession(session);
      if (process.env.NODE_ENV !== 'development') {
        return response.status(401).send({ errorType: 'invalid_token' });
      }
    }

    if (session.get('currentUserAccount')) {
      ctx.usuarioLogado = session.get('currentUserAccount');
      //insere a matricula do usuario dono da requisicao para identificar no log de erros.
      request.matriculaRequisicao = session.get('currentUserAccount').chave;
    }
    await next();
  }

  clearSession(session) {
    session.forget('currentUserAccount');
    session.forget('lastAuthToken');
    session.clear();
  }
}

module.exports = IsTokenValid;
