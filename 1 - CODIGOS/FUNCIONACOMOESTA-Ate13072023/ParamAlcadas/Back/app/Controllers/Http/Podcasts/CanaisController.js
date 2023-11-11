"use strict";

const UCCanais = require("../../../Commons/Podcasts/UseCases/UCCanais");
const UCIncluirCanal = require("../../../Commons/Podcasts/UseCases/UCIncluirCanal");
const UCUpdateCanal = require("../../../Commons/Podcasts/UseCases/UCUpdateCanal");
const UCUpdateCapaCanal = require("../../../Commons/Podcasts/UseCases/UCUpdateCapaCanal");
const UCDeleteCanal = require("../../../Commons/Podcasts/UseCases/UCDeleteCanal");
const CanaisRepository = require("../../../Commons/Podcasts/Repositories/CanaisRepository");
const FileRepository = require("../../../Commons/Podcasts/Repositories/FileRepository");
const UcGetCanalById = require('../../../Commons/Podcasts/UseCases/UCGetCanalById');

const hasPermission = use("App/Commons/HasPermission");

const { handleAbstractUserCaseError } = use("App/Commons/AbstractUserCase");

class CanaisController {
  async getCanais({ response, session }) {
    const ucCanais = new UCCanais({
      repository: new CanaisRepository(),
      functions: { hasPermission },
    });

    const { error, payload } = await ucCanais.run();
    handleAbstractUserCaseError(error);
    response.ok(payload);
  }

  async getCanalById({ request, response }) {
    const { id } = request.allParams();

    const ucGetCanalById = new UcGetCanalById({
      repository: new CanaisRepository(),
    });

    const { error, payload } = await ucGetCanalById.run(id);
    handleAbstractUserCaseError(error);
    response.ok(payload);
  }

  async postCanal({ request, response, session }) {
    const user = session.get("currentUserAccount");
    const { nome, descricao } = request.allParams();

    const ucIncluirCanal = new UCIncluirCanal({
      repository: {
        canais: new CanaisRepository(),
        files: new FileRepository(request),
      },
      functions: { hasPermission },
    });
    const { error, payload } = await ucIncluirCanal.run({
      nome,
      descricao,
      user,
    });
    handleAbstractUserCaseError(error);
    response.ok(payload);
  }

  async updateCanal({ request, response, session }) {
    const user = session.get("currentUserAccount");
    const { id, novoNome, novaDescricao } = request.allParams();

    const ucUpdateCanal = new UCUpdateCanal({
      repository: {
        canais: new CanaisRepository(),
      },
      functions: { hasPermission },
    });

    const { error, payload } = await ucUpdateCanal.run({
      id,
      novoNome,
      novaDescricao,
      user,
    });
    handleAbstractUserCaseError(error);
    response.ok(payload);
  }

  async updateCapaCanal({ request, response, session }) {
    const user = session.get("currentUserAccount");
    const { id } = request.allParams();

    const ucUpdateCapaCanal = new UCUpdateCapaCanal({
      repository: {
        canais: new CanaisRepository(),
        files: new FileRepository(request),
      },
      functions: { hasPermission },
    });

    const { error, payload } = await ucUpdateCapaCanal.run(id, user);
    handleAbstractUserCaseError(error);
    response.ok(payload);
  }

  async deleteCanal({ request, response, session }) {
    const { id } = request.allParams();
    const user = session.get("currentUserAccount");

    const ucDeleteCanal = new UCDeleteCanal({
      repository: new CanaisRepository(),
      functions: { hasPermission },
    });

    const { error, payload } = await ucDeleteCanal.run(id, user);

    handleAbstractUserCaseError(error);

    response.ok(payload);
  }

}

module.exports = CanaisController;
