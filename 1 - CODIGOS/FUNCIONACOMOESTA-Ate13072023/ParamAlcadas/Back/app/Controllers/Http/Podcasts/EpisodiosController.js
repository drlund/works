"use strict";

const UCEpisodios = require("../../../Commons/Podcasts/UseCases/UCEpisodios");
const UCIncluirEpisodio = require("../../../Commons/Podcasts/UseCases/UCIncluirEpisodio");
const UCUpdateEpisodio = require("../../../Commons/Podcasts/UseCases/UCUpdateEpisodio");
const UCDeleteEpisodio = require("../../../Commons/Podcasts/UseCases/UCDeleteEpisodio");
const UCLikesEpisodio = require("../../../Commons/Podcasts/UseCases/UCLikesEpisodio");
const UCCurtir = require("../../../Commons/Podcasts/UseCases/UCCurtir");
const EpisodiosRepository = require("../../../Commons/Podcasts/Repositories/EpisodiosRepository");
const FileRepository = require("../../../Commons/Podcasts/Repositories/FileRepository");
const TagsRepository = require('../../../Commons/Podcasts/Repositories/TagsRepository');
const EpisodioTagRepository = require('../../../Commons/Podcasts/Repositories/EpisodioTagRepository');
const UcGetEpisodioById = require('../../../Commons/Podcasts/UseCases/UCGetEpisodioById');

const hasPermission = use("App/Commons/HasPermission");

const { handleAbstractUserCaseError } = use("App/Commons/AbstractUserCase");
class EpisodiosController {

  async getEpisodios({ response, session }) {
    const user = session.get("currentUserAccount");
    const ucEpisodios = new UCEpisodios({
      repository: new EpisodiosRepository(),
    });

    const { error, payload } = await ucEpisodios.run(user);
    handleAbstractUserCaseError(error);
    response.ok(payload);
  }

  async postEpisodio({ request, response, session }) {
    const { nomeEpisodio, idCanal, tags } = request.allParams();
    const user = session.get("currentUserAccount");
    const Database = use('Database');
    const trx = await Database.connection("podcasts").beginTransaction();

    const ucIncluirEpisodio = new UCIncluirEpisodio({
      repository: {
        episodios: new EpisodiosRepository(),
        tags: new TagsRepository(),
        episodioTags: new EpisodioTagRepository(),
        files: new FileRepository(request),
      },
      trx,
      functions: { hasPermission },
    });

    const { error, payload } = await ucIncluirEpisodio.run({
      nomeEpisodio,
      idCanal,
      tags: JSON.parse(tags),
      user,
    });

    handleAbstractUserCaseError(error);

    response.ok(payload);
  }

  async getEpisodioById({ request, response }) {
    const { id } = request.allParams();

    const ucEpisodioCanalById = new UcGetEpisodioById({
      repository: new EpisodiosRepository(),
    });

    const { error, payload } = await ucEpisodioCanalById.run(id);
    handleAbstractUserCaseError(error);
    response.ok(payload);
  }


  async updateEpisodio({ request, response, session }) {
    const { id, titulo } = request.allParams();
    const user = session.get("currentUserAccount");
    const ucUpdateEpisodio = new UCUpdateEpisodio({
      repository: new EpisodiosRepository(),
      functions: { hasPermission },
    });

    const { error, payload } = await ucUpdateEpisodio.run(id, titulo, user);

    handleAbstractUserCaseError(error);

    response.ok(payload);
  }

  async deleteEpisodio({ request, response, session }) {
    const { id } = request.allParams();
    const user = session.get("currentUserAccount");

    const ucDeleteEpisodio = new UCDeleteEpisodio({
      repository: new EpisodiosRepository(),
      functions: { hasPermission },
    });

    const { error, payload } = await ucDeleteEpisodio.run(id, user);

    handleAbstractUserCaseError(error);

    response.ok(payload);
  }

  async getLikesEpisodios({ response }) {
    const ucLikesEpisodio = new UCLikesEpisodio({
      repository: new EpisodiosRepository(),
    });

    const { error, payload } = await ucLikesEpisodio.run();
    handleAbstractUserCaseError(error);

    response.ok(payload);
  }

  async toggleCurtir({ request, response, session }) {
    const user = session.get("currentUserAccount");
    const { idEpisodio } = request.allParams();

    const ucCurtir = new UCCurtir({
      repository: new EpisodiosRepository(),
    });
    const { error, payload } = await ucCurtir.run(idEpisodio, user);
    handleAbstractUserCaseError(error);

    response.ok(payload);
  }


}

module.exports = EpisodiosController;
