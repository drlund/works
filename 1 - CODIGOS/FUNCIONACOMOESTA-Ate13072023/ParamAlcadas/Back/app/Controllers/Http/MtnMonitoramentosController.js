"use strict";

const VisoesRepository = use("App/Commons/Mtn/ComiteMtn/VisoesRepository");
const ComiteVotacaoRepository = use(
  "App/Commons/Mtn/ComiteMtn/ComiteVotacaoRepository"
);
const VersoesRepository = use("App/Commons/Mtn/ComiteMtn/VersoesRepository");
const mtnVisoesVersaoDocumentos = use(
  "App/Models/Postgres/MtnVisoesVersoesDocumentos"
);

const {
  UcGetMonitoramentosEmVotacao,
  UcGetMonitoramentosFinalizados,
  UcGetMonitoramentosParaNovaVersao,
  UcIncluirMonitoramento,
  UcGetDadosMonitoramento,
  UcIncluirVotacaoVersao,
  UcGetMonitoramentosParaVotacao,
  UcVotar,
  UcGetPermissaoVisualizarVotacoes,
  UcGetAlteracoesParaTratamento,
  UcGetDadosVersao,
  UcTratarAlteracao,
} = use("App/Commons/Mtn/UseCases");

const { getComposicaoComite, getOneFunci } = use("App/Commons/Arh");
var fs = require("fs");
const UcExcluirVotacao = require("../../Commons/Mtn/UseCases/UcExcluirVotacao");

const Helpers = use("Helpers");
class MtnMonitoramentosController {
  constructor() {
    this.visoesRepository = new VisoesRepository();
    this.versoesRepository = new VersoesRepository();
    this.comiteVotacaoRepository = new ComiteVotacaoRepository();
  }

  async podeVisualizarVotacoes({ response, request, session, transform }) {
    const ucGetPermissaoVisualizarVotacoes =
      new UcGetPermissaoVisualizarVotacoes(
        this.visoesRepository,
        this.comiteVotacaoRepository
      );

    const dadosUsuario = session.get("currentUserAccount");

    await ucGetPermissaoVisualizarVotacoes.validate(dadosUsuario.chave);

    const permissao = ucGetPermissaoVisualizarVotacoes.run();
    return permissao;
  }

  async excluirVotacao({ response, request, session, transform }) {
    const { idMonitoramento } = request.allParams();

    const ucExcluirVotacao = new UcExcluirVotacao(
      this.visoesRepository,
      this.versoesRepository
    );

    await ucExcluirVotacao.validate(idMonitoramento);
    await ucExcluirVotacao.run();

    return response.ok("Excluído com sucesso");
  }

  async getMonitoramentosParaNovaVersao({
    response,
    request,
    session,
    transform,
  }) {
    const ucGetMonitoramentosParaNovaVersao =
      new UcGetMonitoramentosParaNovaVersao(this.visoesRepository);
    const monitoramentos = await ucGetMonitoramentosParaNovaVersao.run();
    const transformed = await transform.collection(
      monitoramentos,
      "MtnMonitoramentos/ListaMonitoramentos.pendentesVotacao"
    );
    return response.ok(transformed);
  }

  async getMonitoramentosEmVotacao({ response, request, session, transform }) {
    const ucGetMonitoramentosEmVotacao = new UcGetMonitoramentosEmVotacao(
      this.visoesRepository
    );
    const monitoramentos = await ucGetMonitoramentosEmVotacao.run();
    const transformed = await transform.collection(
      monitoramentos,
      "MtnMonitoramentos/ListaMonitoramentos.emVotacao"
    );
    return response.ok(transformed);
  }

  async getDadosMonitoramento({ response, request, session, transform }) {
    const { idMonitoramento } = request.allParams();

    const ucGetDadosMonitoramento = new UcGetDadosMonitoramento(
      this.visoesRepository
    );
    await ucGetDadosMonitoramento.validate(idMonitoramento);
    const dadosMonitoramento = await ucGetDadosMonitoramento.run();
    const transformed = await transform
      .include("versaoAtual.comite")
      .item(dadosMonitoramento, "MtnMonitoramentos/Monitoramento");
    return response.ok(transformed);
  }

  async getAlteracaoParaTratamento({ request, response, session, transform }) {
    const { idVersao } = request.allParams();
    const ucGetDadosVersao = new UcGetDadosVersao(this.versoesRepository);
    await ucGetDadosVersao.validate(idVersao);
    const dadosVersao = await ucGetDadosVersao.run();

    const transformed = await transform.item(
      dadosVersao,
      "MtnMonitoramentos/VersaoTransformer.tratarAlteracao"
    );

    return response.ok(transformed);
  }

  async tratarAlteracao({ response, request, session }) {
    const { idVersao, justificativa, acao } = request.allParams();
    const { documento } = request.files();
    const dadosUsuario = session.get("currentUserAccount");
    const ucTratarAlteracao = new UcTratarAlteracao(
      this.versoesRepository,
      this.visoesRepository,
      getComposicaoComite,
      getOneFunci,
      this.comiteVotacaoRepository
    );
    await ucTratarAlteracao.validate({
      idVersao,
      justificativa,
      acao,
      documento,
      dadosUsuario,
    });
    await ucTratarAlteracao.run();

    return response.ok(
      `Pedido para alterar versão ${idVersao} tratado com sucesso`
    );
  }

  async getMonitoramentosFinalizadas({
    response,
    request,
    session,
    transform,
  }) {
    const ucGetMonitoramentosFinalizados = new UcGetMonitoramentosFinalizados(
      this.visoesRepository
    );
    const monitoramentos = await ucGetMonitoramentosFinalizados.run();
    const transformed = await transform.collection(
      monitoramentos,
      "MtnMonitoramentos/ListaMonitoramentos.finalizados"
    );
    return response.ok(transformed);
  }

  async incluirMonitoramento({ request, response, session }) {
    const { ativa, descricao, nomeReduzido, nomeVisao } = request.allParams();
    const dadosUsuario = session.get("currentUserAccount");

    const ucIncluirMonitoramento = new UcIncluirMonitoramento(
      this.visoesRepository
    );

    await ucIncluirMonitoramento.validate(
      {
        ativa,
        descricao,
        nomeReduzido,
        nomeVisao,
      },
      dadosUsuario
    );

    await ucIncluirMonitoramento.run();

    return response.ok();
  }

  async incluirVersao({ request, response, session }) {
    const { motivacao, idVisao, tipoVotacao } = request.allParams();
    const { documento, anexos } = request.files();

    const dadosUsuario = session.get("currentUserAccount");

    const ucIncluirVotacaoVersao = new UcIncluirVotacaoVersao(
      getComposicaoComite,
      getOneFunci,
      this.versoesRepository,
      this.visoesRepository,
      this.comiteVotacaoRepository
    );

    await ucIncluirVotacaoVersao.validate({
      tipoVotacao,
      motivacao,
      documento,
      anexos,
      idVisao,
      dadosUsuario,
    });
    await ucIncluirVotacaoVersao.run();

    return response.ok("Incluído com sucesso");
  }

  async downloadDocumentoVersao({ request, response }) {
    const { idDocumento, hashDocumento } = request.allParams();
    const anexo = await mtnVisoesVersaoDocumentos.find(idDocumento);

    let tmpFileName =
      Helpers.appRoot("/cache/") + anexo.nome_arquivo + "." + anexo.extensao;
    let bufferFile = new Buffer.from(anexo.base64, "base64");
    fs.writeFileSync(tmpFileName, bufferFile);
    return response.attachment(tmpFileName);
  }

  async getAlteracoesParaTratamento({ request, response, session, transform }) {
    const ucGetAlteracoesParaTratamento = new UcGetAlteracoesParaTratamento(
      this.versoesRepository
    );
    const versoesParaAlteracao = await ucGetAlteracoesParaTratamento.run();

    const transformed = await transform.collection(
      versoesParaAlteracao,
      "MtnMonitoramentos/VersaoTransformer.paraAlteracao"
    );
    return response.ok(transformed);
  }

  async getMonitoramentosParaVotacao({
    request,
    response,
    session,
    transform,
  }) {
    const dadosUsuario = session.get("currentUserAccount");

    const ucGetMonitoramentosParaVotacao = new UcGetMonitoramentosParaVotacao(
      this.visoesRepository,
      this.comiteVotacaoRepository
    );
    await ucGetMonitoramentosParaVotacao.validate(dadosUsuario);
    const monitoramentosParaVotacao =
      await ucGetMonitoramentosParaVotacao.run();
    const transformed = await transform.collection(
      monitoramentosParaVotacao,
      "MtnMonitoramentos/ListaMonitoramentos.paraVotacao"
    );
    return response.ok(transformed);
  }

  async votar({ request, response, session, transform }) {
    const { tipoVoto, justificativa, idVisao } = request.allParams();
    const { anexos } = request.files();
    const dadosUsuario = session.get("currentUserAccount");
    const ucVotar = new UcVotar(this.versoesRepository, this.visoesRepository);

    await ucVotar.validate(
      {
        idVisao,
        tipoVoto: parseInt(tipoVoto),
        justificativa,
        anexos: anexos ? anexos : [],
      },
      dadosUsuario
    );
    await ucVotar.run();

    return response.ok("Registrado com sucesso");
  }
}

module.exports = MtnMonitoramentosController;
