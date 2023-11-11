const exception = use("App/Exceptions/Handler");
const Database = use("Database");
const { executeDB2Query } = use('App/Models/DB2/DB2Utils');
const MestreSas = use("App/Models/Mysql/MestreSas");
const Funci = use("App/Models/Mysql/Arh/Funci");
const Solicitacoes = use("App/Models/Mysql/HorasExtras/Solicitacoes");
const hasPermission = use("App/Commons/HasPermission");
const _ = require("lodash");
const { isPrefixoUN, isPrefixoUT, getFuncisByPrefixo, isAdmin } = use("App/Commons/Arh/");
const { addSolicitacao, getDadosAdesaoHE, getDadosSolicitacaoHE, getDadosSolicitacao,
        getResumoGeral, getResumo, obterPeriodos, obterListaSolicitacoes, addParecer,
        obterStatus, obterRegionais, isSuper, isAutorizado, getListaDiasUteis, testes } = use("App/Commons/HorasExtras/");
const moment = require("moment");
const Compensacao = use("App/Models/Mysql/HorasExtras/Compensacao");

class HorasExtrasController {
  async getDadosAdesaoHE({ request, response }) {
    try {
      const { matricula } = request.allParams();

      if (!matricula) {
        response.status(400).send("Favor selecionar matrícula");
      }

      const dadosAdesao = await getDadosAdesaoHE(matricula);

      response.send(dadosAdesao);
    } catch (error) {
        throw new exception("Dados referentes à adesão do funcionário ao BH não encontrados", 400);
    }
  }

  async getDadosSolicitacaoHE({response, session}) {
    try {
      const user = session.get("currentUserAccount");

      const dados = await getDadosSolicitacaoHE(user);

      response.ok(dados);
    } catch (error) {
        throw new exception("Falha ao resolver a consulta dos dados para a solicitação de Horas Extras!", 400)
    }
  }

  async getFuncisPrefixo({request, response}) {
    try {
      const {prefixo} = request.allParams();

      const funcis = await getFuncisByPrefixo(prefixo);

      response.ok(funcis);
    } catch (error) {
      throw new exception("Falha ao resolver a consulta de funcionários no prefixo informado!", 400);
    }
  }

  async getSolicitacao({request, response, session}) {
    try {
      const user = session.get("currentUserAccount");
      const {id} = request.allParams();

      const solicitacao = await getDadosSolicitacao(user, id);
      response.ok(solicitacao);
    } catch (error) {
      throw new exception("Problema ao obter a Solicitação", 400);
    }
  }

  async enviarParecer({request, response, session}) {
    try {
      const user = session.get("currentUserAccount");
      const {parecer} = request.allParams();

      const despacho = await addParecer(user, parecer);

      response.ok(despacho);
    } catch (error) {
      throw new exception("Problema ao gravar o Parecer!", 400);
    }
  }

  async novaSolicitacao({request, response, session}) {
    try {
      const user = session.get("currentUserAccount");
      const {dados} = request.allParams();

      const nova = await addSolicitacao({...dados, user});

      response.ok(nova);
    } catch (error) {
      throw new exception("Problema ao enviar a nova Solicitação de Horas Extras!", 400);
    }
  }

  async getResumoHEGG({request, response, session}) {
    try {
      const user = session.get("currentUserAccount");
      const {idSolicitacao, prefixo, matricula} = request.allParams();

      const usuario = matricula || user.chave;

      const resumo = await getResumo(user, usuario, idSolicitacao, prefixo);

      response.ok(resumo);
    } catch (error) {
      throw new exception("Problema ao acessar o banco de dados de Solicitações", 400);
    }
  }

  async getSolicitacoesAcomp({request, response, session}) {
    let user = session.get("currentUserAccount");

    const {status, periodo, regional} = request.allParams();

    let lista = [];

    try {
      if (status && periodo ) lista = await obterListaSolicitacoes(status, periodo, regional, user);
      response.ok(lista);
    } catch (error) {
      throw new exception("Falha ao obter a lista de Solicitações", 400);
    }
  }

  async getPeriodoEstados ({response, session}) {
    let periodos = [], estados = [], regionais = [];
    let user = session.get("currentUserAccount");

    try {
      periodos = await obterPeriodos(user);
      estados = await obterStatus(user);
      regionais = await obterRegionais(user)
      response.ok({periodos, estados, regionais});
    } catch (error) {
      throw new exception("Falha ao obter as Regionais, os períodos e os possíveis estados!", 400);
    }
  }

  async getPeriodos({response}) {
    let periodos;

    try {
      periodos = await obterPeriodos();
      response.ok(periodos);
    } catch (error) {
      throw new exception("Falha ao obter os períodos", 400);
    }

  }

  async getEstadosSolicitacoes({response}) {
    let estados;

    try {
      estados = await obterStatus();
      response.ok(estados);
    } catch (error) {
      throw new exception("Falha ao obter os possíveis estados", 400);
    }
  }

  async getRegionais({response, session}) {
    let regionais;
    let user = session.get("currentUserAccount");

    try {
      regionais = await obterRegionais(user);
      response.ok(regionais);
    } catch (error) {
      throw new exception("Falha ao obter as Regionais", 400);
    }
  }

  async podeAcessar({response, session}) {
    const user = session.get("currentUserAccount");

    try {

      const acesso = await hasPermission({
        nomeFerramenta: "Horas Extras",
        dadosUsuario: user,
        permissoesRequeridas: ["ACESSO_TESTE", "ACESSO_SUPERADM"]
      });

      const autorizado = await isAutorizado(user);

      response.ok(autorizado || acesso);
    } catch (error) {
      throw new exception("Não autorizado", 403);
    }

  }

  async podeSolicitar({session, response}) {
    const user = session.get("currentUserAccount");

    try {
      const podeSolicitar = await isAdmin(user.chave);

      const autorizado = await hasPermission({
        nomeFerramenta: "Horas Extras",
        dadosUsuario: user,
        permissoesRequeridas: ["ACESSO_SUPERADM"]
      });

      response.ok(podeSolicitar || autorizado);
    } catch (error) {
      throw new exception("Não autorizado", 403);
    }
  }

  async obterListaDiasUteis({request, response}) {
    let {prefixo, inicio, fim} = request.allParams();

    try {
      const datas = await getListaDiasUteis(inicio, fim, prefixo);
      response.ok(datas);
    } catch (error) {
      throw new exception("Não disponível", 400);
    }
  }


  /**
   * Métodos para teste unitário/funcional
   *
  **/

  async teste({request, response, session}) {
    try {
      const teste = await testes();
    } catch (err) {

    }
  }

}

module.exports = HorasExtrasController;
