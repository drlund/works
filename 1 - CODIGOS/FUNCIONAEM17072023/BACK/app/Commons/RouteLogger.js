const exception = use("App/Exceptions/Handler");
const md5 = require("md5");
const BasicLoggerModel = use("App/Models/Mysql/RouteLoggers/BasicLogger");

const USUARIO_NAO_LOGADO = {
  celular: "000000000",
  chave: "F0000000",
  cod_funcao: "0000",
  dependencia: "0000",
  email: "NAO_DISPONIVEL",
  matricula: "F0000000",
  nome_funcao: "0000",
  nome_guerra: "USUÁRIO NÃO LOGADO",
  nome_regional: "USUÁRIO NÃO LOGADO",
  nome_super: "USUÁRIO NÃO LOGADO",
  nome_usuario: "USUÁRIO NÃO LOGADO",
  pref_diretoria: "0000",
  pref_regional: "0000",
  pref_super: "0000",
  prefixo: "0000",
  telefone: "000000000",
  uf: "ND",
  uor: "0000",
  uor_trabalho: "0000",
};

/**
 *  Classe abstrata para ser herdada na construção de Loggers de rota.
 *  Caso queira criar um novo logger, os seguintes métodos devem ser implementados
 *
 *  registrarLog
 *  recuperarLogPeloId
 *  recuperarLogsPorMatricula
 *
 *
 *  @property {string} _ip IP da máquina da qual a requisição foi feita
 *  @property {string} _url URL para a qual a requisição foi feita
 *  @property {string} _token Para as requisições logadas, este é o token de login
 *  @property {object} _usuarioLogado Para as requisições logadas, este são os dados do usuário logado
 *
 */

class RouteLogger {
  constructor(routeParams) {
    const { ferramenta, ctx } = routeParams;
    const { request, session } = ctx;

    /** @type {typeDefs.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");
    const { token } = request.allParams();

    this._ip = request.ip();
    this._params = request.allParams();
    this._url = `${request.method()}:${request.url()}`;
    this._token = token ? token : null;
    this._ferramenta = ferramenta ? ferramenta : "N/D";
    this._usuarioLogado = dadosUsuario ? dadosUsuario : USUARIO_NAO_LOGADO;
  }

  getFerramenta() {
    return this._ferramenta;
  }

  getToken() {
    return this._token;
  }

  getIp() {
    return this._ip;
  }

  getUrl() {
    return this._url;
  }

  getParams() {
    return this._params;
  }

  getUsuarioLogado() {
    return this._usuarioLogado;
  }

  getHash(dadosUnicos) {
    if (dadosUnicos.updatedAt) {
      throw new exception(
        "Não utilize o parâmetro updatedAt para gerar o Hash, pois ele pode mudar por questões no banco de dados",
        500
      );
    }
    return md5(JSON.stringify(dadosUnicos));
  }

  getInformacoesBasicas() {
    const informacoesBasicas = {
      matriculaUsuarioLogado: this.getUsuarioLogado().matricula,
      nomeUsuarioLogado: this.getUsuarioLogado().nome_usuario,
      ip: this.getIp(),
      url: this.getUrl(),
      token: this.getToken(),
      ferramenta: this.getFerramenta(),
      params: JSON.stringify(this.getParams()),
    };

    const hash = this.getHash({ ...informacoesBasicas });
    return {
      ...informacoesBasicas,
      hash,
    };
  }

  validarMatricula(matricula) {
    return typeof matricula !== "string" || matricula.length !== 8;
  }

  async recuperarLogPeloId(id) {
    if (!parseInt(id)) {
      throw new exception("Id inválido", 400);
    }

    const log = await BasicLoggerModel.find(id);
    if (!log) {
      throw new exception("Id do log inválido", 400);
    }
    return log;
  }

  async recuperarLogsPorMatricula(matricula) {
    if (this.validarMatricula(matricula)) {
      throw new exception("Matrícula inválida", 400);
    }

    const logs = await BasicLoggerModel.query()
      .where("matriculaUsuarioLogado", matricula)
      .fetch();

    return logs;
  }

  async registrarLog() {
    await BasicLoggerModel.create({
      ...this.getInformacoesBasicas(),
    });
  }
}

module.exports = RouteLogger;
