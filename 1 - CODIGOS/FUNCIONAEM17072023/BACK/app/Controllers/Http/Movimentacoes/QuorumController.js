"use strict";

const UcAlterarQuorumMeuPrefixo = require("../../../Commons/Movimentacoes/UseCases/UcAlterarQuorumMeuPrefixo");
const UcAlterarQuorumQualquerPrefixo = require("../../../Commons/Movimentacoes/UseCases/UcAlterarQuorumQualquerPrefixo");
const UcCriarQuorumMeuPrefixo = require("../../../Commons/Movimentacoes/UseCases/UcCriarQuorumMeuPrefixo");
const UcCriarQuorumQualquerPrefixo = require("../../../Commons/Movimentacoes/UseCases/UcCriarQuorumQualquerPrefixo");
const UcExcluirQuorumMeuPrefixo = require("../../../Commons/Movimentacoes/UseCases/UcExcluirQuorumMeuPrefixo");
const UcExcluirQuorumQualquerPrefixo = require("../../../Commons/Movimentacoes/UseCases/UcExcluirQuorumQualquerPrefixo");
const UcRecuperarQuorumMeuPrefixo = require("../../../Commons/Movimentacoes/UseCases/UcRecuperarQuorumMeuPrefixo");
const UcRecuperarQuorumTodosPrefixos = require("../../../Commons/Movimentacoes/UseCases/UcRecuperarQuorumTodosPrefixos");

const QuorumRepository = require("../../../Commons/Movimentacoes/Repositories/QuorumRepository");

const checkAcessosMovimentacao = use(
  "App/Commons/Movimentacoes/Utils/CheckAcessosMovimentacao"
);

const {
  handleAbstractUserCaseError,
} = require("../../../Commons/AbstractUserCase");

const typeDefs = require("../../../Types/TypeUsuarioLogado");

class QuorumController {
  async getQuorumProprio({ response, session }) {
    /** @type {typeDefs.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    const quorumRepository = new QuorumRepository();
    const ucRecuperarQuorumMeuPrefixo = new UcRecuperarQuorumMeuPrefixo({
      repository: {
        quorumRepository,
      },
      functions: { checkAcessosMovimentacao },
    });

    const { error, payload } = await ucRecuperarQuorumMeuPrefixo.run(
      dadosUsuario
    );

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async updateQuorumProprio({ request, response, session }) {
    const { quorum } = request.allParams();

    /** @type {typeDefs.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    const quorumRepository = new QuorumRepository();
    const ucAlterarQuorumMeuPrefixo = new UcAlterarQuorumMeuPrefixo({
      repository: {
        quorumRepository,
      },
      functions: { checkAcessosMovimentacao },
    });

    const { error, payload } = await ucAlterarQuorumMeuPrefixo.run(
      quorum,
      dadosUsuario
    );

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async createQuorumProprio({ request, response, session, transform }) {
    /** @type {typeDefs.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    const { quorum } = request.allParams();

    const quorumRepository = new QuorumRepository();
    const ucCriarQuorumMeuPrefixo = new UcCriarQuorumMeuPrefixo({
      repository: {
        quorumRepository,
      },
      functions: { checkAcessosMovimentacao },
    });

    const { error, payload } = await ucCriarQuorumMeuPrefixo.run(
      quorum,
      dadosUsuario
    );

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async deleteQuorumProprio({ response, session }) {
    /** @type {typeDefs.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    const quorumRepository = new QuorumRepository();
    const ucExcluirQuorumMeuPrefixo = new UcExcluirQuorumMeuPrefixo({
      repository: {
        quorumRepository,
      },
      functions: { checkAcessosMovimentacao },
    });

    const { error, payload } = await ucExcluirQuorumMeuPrefixo.run(
      dadosUsuario
    );

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async getQuorumTodos({ response, session }) {
    /** @type {typeDefs.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    const quorumRepository = new QuorumRepository();
    const ucRecuperarQuorumTodosPrefixos = new UcRecuperarQuorumTodosPrefixos({
      repository: {
        quorumRepository,
      },
      functions: { checkAcessosMovimentacao },
    });

    const { error, payload } = await ucRecuperarQuorumTodosPrefixos.run(
      dadosUsuario
    );

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async updateQuorumQualquer({ request, response, session }) {
    /** @type {typeDefs.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    const { prefixo, quorum } = request.allParams();

    const quorumRepository = new QuorumRepository();
    const ucAlterarQuorumQualquerPrefixo = new UcAlterarQuorumQualquerPrefixo({
      repository: {
        quorumRepository,
      },
      functions: { checkAcessosMovimentacao },
    });

    const { error, payload } = await ucAlterarQuorumQualquerPrefixo.run(
      prefixo,
      quorum,
      dadosUsuario
    );

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async createQuorumQualquer({ request, response, session }) {
    /** @type {typeDefs.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    const { prefixo, quorum } = request.allParams();

    const quorumRepository = new QuorumRepository();
    const ucCriarQuorumQualquerPrefixo = new UcCriarQuorumQualquerPrefixo({
      repository: {
        quorumRepository,
      },
      functions: { checkAcessosMovimentacao },
    });

    const { error, payload } = await ucCriarQuorumQualquerPrefixo.run(
      prefixo,
      quorum,
      dadosUsuario
    );

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async deleteQuorumQualquer({ request, response, session }) {
    /** @type {typeDefs.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    const { prefixo } = request.allParams();

    const quorumRepository = new QuorumRepository();
    const ucExcluirQuorumQualquerPrefixo = new UcExcluirQuorumQualquerPrefixo({
      repository: {
        quorumRepository,
      },
      functions: { checkAcessosMovimentacao },
    });

    const { error, payload } = await ucExcluirQuorumQualquerPrefixo.run(
      prefixo,
      dadosUsuario
    );

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }
}

module.exports = QuorumController;
