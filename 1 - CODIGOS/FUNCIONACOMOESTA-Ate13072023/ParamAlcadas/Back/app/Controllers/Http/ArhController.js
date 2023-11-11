"use strict";

const isComissaoNivelGerencial = require("../../Commons/Arh/isComissaoNivelGerencial");

const {
  getOneFunci,
  getOneDependencia,
  getManyFuncis,
  getManyDependencias,
  getMatchedDependencias,
  getListaComites,
  getComposicaoComite,
  getMatchedFuncis,
  getDotacaoDependencia,
  getListaComitesByMatricula,
  getMatchedFuncisLotados,
  getDepESubord,
} = use("App/Commons/Arh");
const Funcionario = use("App/Commons/Arh/Funcionario/Funcionario");
const Database = use("Database");
const exception = use("App/Exceptions/Handler");
const cargosComissoesModel = use("App/Models/Mysql/Arh/CargosComissoes");
const commonsTypes = require("../../Types/TypeUsuarioLogado");
const moment = require("moment");

class ArhController {
  /**
   *  Método que retorna os dados de um funcinário, pesquisando pela sua matrícula
   * @param {*} param0
   */

  async findFunci({ request, response }) {
    const { matricula } = request.params;
    if (!matricula || matricula.length < 8 || !matricula.startsWith("F")) {
      throw new exception("Matrícula do funci não informada!", 400);
    }

    var patt = /^F\d{7}/i;

    if (matricula.length < 8 || !patt.exec(matricula)) {
      throw new exception("Formato incorreto da matrícula do funci!", 400);
    }

    const funci = await getOneFunci(matricula);

    if (!funci) {
      response.notFound("Funcionário não encontrado");
      return;
    }

    response.ok(funci);
  }

  async isNivelGerencial({ request, response, session }) {
    /** @type {commonsTypes.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    const isNivelGerencial = await isComissaoNivelGerencial(
      dadosUsuario.cod_funcao
    );

    return response.ok(isNivelGerencial);
  }

  async findFuncis({ request, response }) {
    const { matriculas } = request.all();
    if (!matriculas) {
      response.badRequest("Matrículas não informadas!");
      return;
    }

    const funcis = await getManyFuncis(matriculas);

    if (!funcis) {
      response.notFound("Funcionários não encontrados");
      return;
    }

    response.ok(funcis);
  }

  async findMatchedFuncis({ request, response }) {
    const { funci, buscaSimplificada } = request.allParams();

    if (!funci) {
      response.badRequest("Funcionário não informado!");
      return;
    }

    const funcis = await getMatchedFuncis(funci, buscaSimplificada);

    if (!funcis) {
      response.notFound("Funcionários não encontrados");
      return;
    }

    response.ok(funcis);
  }

  async findDependencia({ request, response }) {
    const { prefixo } = request.params;

    if (!prefixo) {
      response.badRequest("Prefixo não informado!");
      return;
    }

    const dependencia = await getOneDependencia(prefixo);

    if (!dependencia) {
      response.notFound("Dependência não encontrada");
      return;
    }

    response.ok(dependencia);
  }

  async findDependencias({ request, response }) {
    const { prefixos } = request.all();

    if (!prefixos) {
      response.badRequest("Lista de prefixos não informada!");
      return;
    }

    const dependencias = await getManyDependencias(prefixos);

    if (!dependencias) {
      response.notFound("Dependências não encontrada");
      return;
    }

    response.ok(dependencias);
  }

  /**
   * Método que retorna array de dependência, após consulta por nome ou prefixo.
   * @param {*} param0
   */
  async findMatchedDependencias({ request, response }) {
    const { prefixo } = request.allParams();
    const dependencias = await getMatchedDependencias(prefixo);

    if (!dependencias) {
      response.notFound("Dependências não encontrada");
      return;
    }

    response.ok(dependencias);
  }

  /**
   * Método que retorna array de dependência, após consulta por nome ou prefixo.
   * @param {*} param0
   */
  async findDepESubord({ request, response, session }) {
    const usuario = session.get("currentUserAccount");

    const { prefixo } = request.allParams();

    const dependencias = await getDepESubord(prefixo, usuario);

    if (!dependencias) {
      response.notFound("Dependências não encontrada");
      return;
    }

    response.ok(dependencias);
  }

  /**
   * Obtem a lista de todas as comissoes disponiveis na
   * tabela cargos_e_comissoes seguindo o padrao do
   * disparador de e-mails.
   * Obs.: Para outros tipos de filtros, favor passar os parametros
   * via request e preservar a consulta atual via expressao condicional.
   */
  async findComissoes({ request, response }) {
    let query = cargosComissoesModel
      .query()
      .distinct("nome_funcao")
      .where("flag_disparador", 1);

    let listaComissoes = await query.fetch();
    response.ok(listaComissoes.toJSON());
  }

  /**
   * Obtem todas as comissoes de uma dependencia.
   */
  async findComissoesByPrefixo({ request, response }) {
    let { prefixo } = request.allParams();
    prefixo = String(prefixo).padStart(4, "0");

    //busca os codigos dos cargos na tabela DIPES.arhfot09
    let arrFuncoes = await Database.connection("dipes")
      .select("cod_cargo")
      .from("arhfot09")
      .where("cod_dependencia", prefixo)
      .whereRaw("(qtde_dotacao + qtde_lotacao + qtde_existencia) > ?", 0);

    //convert o array de objetos para array de inteiros a partir do cod_cargo
    arrFuncoes = arrFuncoes.map((elem) => parseInt(elem.cod_cargo));

    //obtem os nomes da tabela cargos e comissoes para retornar
    //estes sao os nomes unificados e centralizados que devem ser utilizados
    //por todas as aplicacoes.
    let query = cargosComissoesModel
      .query()
      .distinct("nome_funcao")
      .whereIn("cod_funcao", arrFuncoes);

    let listaComissoes = await query.fetch();
    response.ok(listaComissoes.toJSON());
  }

  /**
   * Busca todos os comites do prefixo informado.
   */
  async findComites({ request, response, transform }) {
    let { prefixo } = request.allParams();
    let listaComites = await getListaComites(prefixo);
    listaComites = await transform.collection(
      listaComites,
      "arh/GetListaComitesTransformer"
    );
    response.send(listaComites);
  }

  /**
   * Busca todos os funcis de um comite de um determinado prefixo.
   */
  async findFunciComites({ request, response, transform }) {
    let { prefixo, codigoComite } = request.allParams();
    let funcisComite = await getComposicaoComite(prefixo, codigoComite);
    funcisComite = await transform.collection(
      funcisComite,
      "arh/GetMembrosComiteTransformer"
    );
    response.send(funcisComite);
  }

  /**
   * Busca todos os comitês de um determinado funci.
   */
  async findComitesFunci({ request, response, transform }) {
    let { funci } = request.allParams();
    let comites = await getListaComitesByMatricula(funci);
    // comites = await transform.collection(funcisComite, 'arh/GetMembrosComiteTransformer');
    response.send(comites);
  }

  /**
   * Busca a dotação de um prefixo, retornando apenas as funções com dotação > 0
   */
  async findDotacaoDependencia({ session, request, response }) {
    let { prefixo, ger, gest } = request.allParams();

    if (!prefixo) {
      const usuario = session.get("currentUserAccount");
      prefixo = usuario.prefixo;
    }

    ger = ger === "true" || false;
    gest = gest === "true" || false;

    let dotacao = await getDotacaoDependencia(prefixo, ger, gest);

    if (!dotacao) {
      response.notFound("Dotações não encontradas");
      return;
    }

    response.ok(dotacao);
  }

  /**
   * Busca os funcis lotados em uma funcao, em um prefixo.
   */
  async findMatchedFuncisLotados({ session, request, response }) {
    let { prefixo, comissao } = request.allParams();

    if (!prefixo) {
      const usuario = session.get("currentUserAccount");
      prefixo = usuario.prefixo;
    }

    let dotacao = await getMatchedFuncisLotados(prefixo, comissao);

    if (!dotacao) {
      response.notFound("Funcis Lotados não encontradas");
      return;
    }

    response.ok(dotacao);
  }

  async findAusenciasByMatricula({ session, request, response, transform }) {
    const { matricula, periodo } = request.allParams();

    try {
      const funcionario = new Funcionario(matricula);
      const funciComAusencias = await funcionario.getDadosFunciComAusencias(
        matricula,
        JSON.parse(periodo[0]),
        JSON.parse(periodo[1])
      );

      const transformed = await transform.item(
        funciComAusencias,
        "arh/FunciComAusenciaTransformer"
      );
      return response.ok(transformed);
    } catch (error) {
      if (typeof error === "string") {
        throw new exception(error, 400);
      } else {
        throw new exception(error.message, 500);
      }
    }
  }
}

module.exports = ArhController;
