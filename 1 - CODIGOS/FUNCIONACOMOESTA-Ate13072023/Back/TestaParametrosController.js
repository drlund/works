// @ts-nocheck
"use strict";
const moment = require("moment");
const UcTestaParametros = use(
  "App/Commons/Movimentacoes/UseCases/UcTestaParametros"
);
const UcExcluirParametro = use(
  "App/Commons/Movimentacoes/UseCases/UcExcluirParametro"
);
const TestaParametrosRepository = use(
  "App/Commons/Movimentacoes/Repositories/TestaParametrosRepository"
);
const ParamAlcadasIncluirFactory = use(
  "App/Commons/Movimentacoes/Factories/ParamAlcadasIncluirFactory"
);
const UcGravarParametro = use(
  "App/Commons/Movimentacoes/UseCases/UcGravarParametro"
);
const UcAlterarParametros = require("../../../Commons/Movimentacoes/UseCases/UcAlterarParametros");
const UcCargosComissoes = use(
  "App/Commons/Movimentacoes/UseCases/UcCargosComissoes"
);
const UcJurisdicoesSubordinadas = use(
  "App/Commons/Movimentacoes/UseCases/UcJurisdicoesSubordinadas"
);
const UcPrefixoBySubordinada = use(
  "App/Commons/Movimentacoes/UseCases/UcPrefixoBySubordinada"
);
const UcComites = use("App/Commons/Movimentacoes/UseCases/UcComites");
const UcVerificarStatusParametro = use(
  "App/Commons/Movimentacoes/UseCases/UcVerificarStatusParametro"
);
const UcAtualizarStatusParametro = use(
  "App/Commons/Movimentacoes/UseCases/UcAtualizarStatusParametro"
);

const ParamAlcadas = use("App/Models/Mysql/movimentacoes/ParamAlcadas");

const { getListaComitesAdm } = use("App/Commons/Arh/dadosComites");

class TestaParametrosController {
  async getParametros({ response, request }) {
    const { id } = request.allParams();
    const ucTestaParametros = new UcTestaParametros(
      new TestaParametrosRepository()
    );
    await ucTestaParametros.validate(id);
    const listaParametros = await ucTestaParametros.run();

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
    parametroExistente.save();

    const ucExcluirParametro = new UcExcluirParametro(
      new TestaParametrosRepository()
    );
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

    const ucGravarParametro = new UcGravarParametro(
      new TestaParametrosRepository(),
      new ParamAlcadasIncluirFactory()
    );
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
    const ucAlterarParametros = new UcAlterarParametros(
      new TestaParametrosRepository()
    );
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
    const ucCargosComissoes = new UcCargosComissoes(
      new TestaParametrosRepository()
    );
    await ucCargosComissoes.validate(cod_dependencia);
    const listaCargosComissoes = await ucCargosComissoes.run();

    response.ok(listaCargosComissoes);
  }

  async getJurisdicoesSubordinadas({ response, request }) {
    const { prefixo } = request.allParams();
    const ucJurisdicoesSubordinadas = new UcJurisdicoesSubordinadas(
      new TestaParametrosRepository()
    );
    await ucJurisdicoesSubordinadas.validate(prefixo);
    const listaJurisdicoesSubordinadas = await ucJurisdicoesSubordinadas.run();

    response.ok(listaJurisdicoesSubordinadas);
  }

  async getPrefixoBySubordinada({ response, request }) {
    const { prefixo_subordinada } = request.allParams();
    const ucPrefixoBySubordinada = new UcPrefixoBySubordinada(
      new TestaParametrosRepository()
    );
    await ucPrefixoBySubordinada.validate(prefixo_subordinada);
    const listaPrefixoBySubordinada = await ucPrefixoBySubordinada.run();

    response.ok(listaPrefixoBySubordinada);
  }

  async listaComiteParamAlcadas({ response, request }) {
    const { prefixo } = request.allParams();
    const ucComites = new UcComites(new TestaParametrosRepository());
    await ucComites.validate(prefixo);
    const listaComites = await ucComites.run();

    response.ok(listaComites);
  }

  async verificarStatusParametro({ response, request }) {
    const { prefixo } = request.allParams();
    const ucVerificarStatusParametro = new UcVerificarStatusParametro(
      new TestaParametrosRepository()
    );
    await ucVerificarStatusParametro.validate(prefixo);
    const statusDoParametro = await ucVerificarStatusParametro.run();

    response.ok(statusDoParametro);
  }

  async atualizarStatusParametro({ response, request }) {
    const { prefixoDestino, comissaoDestino, ativo } = request.allParams();
    const ucAtualizarStatusParametro = new UcAtualizarStatusParametro(
      new TestaParametrosRepository()
    );
    await ucAtualizarStatusParametro.validate(
      prefixoDestino,
      comissaoDestino,
      ativo
    );
    const atualizaParametro = await ucAtualizarStatusParametro.run();

    response.ok(atualizaParametro);
  }
}

module.exports = TestaParametrosController;