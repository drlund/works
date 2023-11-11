"use strict";
const moment = require("moment");

const UcAlterarParametros = require("../../../Commons/Movimentacoes/UseCases/UcAlterarParametros");
const ParametrosAlcadasRepository = require("../../../Commons/Movimentacoes/Repositories/ParametrosAlcadasRepository");
const UcExcluirParametro = require("../../../Commons/Movimentacoes/UseCases/UcExcluirParametro");
const UcGravarParametro = require("../../../Commons/Movimentacoes/UseCases/UcGravarParametro");
const ParamAlcadasIncluirFactory = require("../../../Commons/Movimentacoes/Factories/ParamAlcadasIncluirFactory");
const UcCargosComissoes = require("../../../Commons/Movimentacoes/UseCases/UcCargosComissoes");
const UcJurisdicoesSubordinadas = require("../../../Commons/Movimentacoes/UseCases/UcJurisdicoesSubordinadas");
const UcPrefixoBySubordinada = require("../../../Commons/Movimentacoes/UseCases/UcPrefixoBySubordinada");
const UcComites = require("../../../Commons/Movimentacoes/UseCases/UcComites");
const UcParametrosAlcadas = require("../../../Commons/Movimentacoes/UseCases/UcParametrosAlcadas");

const ParamAlcadas = use("App/Models/Mysql/movimentacoes/ParamAlcadas");

class ParametrosAlcadasController {

  async getParametros({ response, request }) {
    const { id } = request.allParams();
    const ucParametrosAlcadas = new UcParametrosAlcadas(new ParametrosAlcadasRepository());
    await ucParametrosAlcadas.validate(id);
    const listaParametros = await ucParametrosAlcadas.run();

    response.ok(listaParametros);
  }

  async delParametro({ request, response, session }) {
    const { id: idParametro, observacao } = request.allParams();
    const usuario = session.get("currentUserAccount");
    const acao = "Exclusão";
    const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");

    const parametroExistente = await ParamAlcadas.find(idParametro);
    const observacaoAtualizada = `${
      parametroExistente.observacao || ""
    }\nMatrícula: ${
      usuario.matricula
    } - Data: ${dataAtual} - Ação: ${acao} - ${observacao}`;

    parametroExistente.merge({ observacao: observacaoAtualizada });
    parametroExistente.save(observacaoAtualizada);

    const ucExcluirParametro = new UcExcluirParametro(new ParametrosAlcadasRepository());
    await ucExcluirParametro.validate(idParametro);
    const excluiParametro = await ucExcluirParametro.run();

    response.ok(excluiParametro);
  }

  async gravarParametro({ request, response, session }) {
    const dadosDosParametros = request.allParams();
    const usuario = session.get("currentUserAccount");
    const acao = "Inclusão";
    const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
    dadosDosParametros.observacao = `Matrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - ${dadosDosParametros.observacao} `;

    const ucGravarParametro = new UcGravarParametro(new ParametrosAlcadasRepository, new ParamAlcadasIncluirFactory());
    await ucGravarParametro.validate(usuario, dadosDosParametros);
    const parametroGravado = await ucGravarParametro.run();

    response.ok(parametroGravado);
  }

  async patchParametros({ request, response, session }) {
    const dadosParametros = request.allParams();
    const usuario = session.get("currentUserAccount");
    const { id, comite, nomeComite, observacao } = dadosParametros;
    const acao = "Alteracao";
    const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
    const observacaoAtualizada = `Matrícula: ${
      usuario.matricula
    } - Data: ${dataAtual} - Ação: ${acao} - ${
      observacao ? observacao + " " : ""
    }`;
    const ucAlterarParametros = new UcAlterarParametros(new ParametrosAlcadasRepository());

    await ucAlterarParametros.validate({
      id,
      comite,
      nomeComite,
      observacao: observacaoAtualizada,
    });
    await ucAlterarParametros.run();

    response.ok();
  }

  async getCargosComissoesFot09({ response, request }) {
    const { cod_dependencia } = request.allParams();
    const ucCargosComissoes = new UcCargosComissoes(new ParametrosAlcadasRepository());
    await ucCargosComissoes.validate(cod_dependencia);
    const listaCargosComissoes = await ucCargosComissoes.run();

    response.ok(listaCargosComissoes);
  }

  async getJurisdicoesSubordinadas({ response, request }) {
    const { prefixo } = request.allParams();
    const ucJurisdicoesSubordinadas = new UcJurisdicoesSubordinadas(new ParametrosAlcadasRepository());
    await ucJurisdicoesSubordinadas.validate(prefixo);
    const listaJurisdicoesSubordinadas = await ucJurisdicoesSubordinadas.run();

    response.ok(listaJurisdicoesSubordinadas);
  }

  async getPrefixoBySubordinada({ response, request }) {
    const { prefixo_subordinada } = request.allParams();
    const ucPrefixoBySubordinada = new UcPrefixoBySubordinada(new ParametrosAlcadasRepository());
    await ucPrefixoBySubordinada.validate(prefixo_subordinada);
    const listaPrefixoBySubordinada = await ucPrefixoBySubordinada.run();

    response.ok(listaPrefixoBySubordinada);
  }

  async listaComiteParamAlcadas({ response, request }) {
    const { prefixo } = request.allParams();
    const ucComites = new UcComites(new ParametrosAlcadasRepository());
    await ucComites.validate(prefixo);
    const listaComites = await ucComites.run();

    response.ok(listaComites);
  }

}

module.exports = ParametrosAlcadasController;
