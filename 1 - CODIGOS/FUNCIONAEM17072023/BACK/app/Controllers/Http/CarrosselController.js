'use strict';


const UCVideo = use("App/Commons/Carrossel/UseCases/UCVideo");
const UCVideos = use("App/Commons/Carrossel/UseCases/UCVideos");
const { handleAbstractUserCaseError } = require("../../Commons/AbstractUserCase");
const FileRepository = require('../../Commons/Carrossel/Repositories/FileRepository');
const VideosRepository = require("../../Commons/Carrossel/Repositories/VideosRepository");
const UCDeleteVideo = require("../../Commons/Carrossel/UseCases/UCDeleteVideo");
const UCIncluirVideo = require("../../Commons/Carrossel/UseCases/UCIncluirVideo");
const UCUpdateVideo = require("../../Commons/Carrossel/UseCases/UCUpdateVideo");
const hasPermission = use("App/Commons/HasPermission");

class CarrosselController {

  async getVideo({ response }) {
    const ucVideo = new UCVideo({
      repository: new VideosRepository(),
    });
    const { error, payload } = await ucVideo.run();
    handleAbstractUserCaseError(error);
    response.header('Access-Control-Allow-Origin', 'http://localhost:3000').ok(payload);
  }

  async getVideos({ response, session }) {
    const user = session.get("currentUserAccount");
    const ucVideos = new UCVideos({
      repository: new VideosRepository(),
      functions: { hasPermission },
    });
    const { error, payload } = await ucVideos.run(user);
    handleAbstractUserCaseError(error);
    response.ok(payload);
  }

  async postVideo({ request, response, session }) {
    const user = session.get("currentUserAccount");
    const { dataInicioReproducao } = request.allParams();

    const ucIncluirVideo = new UCIncluirVideo({
      repository: {
        videos: new VideosRepository(),
        files: new FileRepository(request),
      },
      functions: {
        hasPermission
      },
    });
    const { error, payload } = await ucIncluirVideo.run({
      dataInicioReproducao,
      user,
    });
    handleAbstractUserCaseError(error);
    response.ok(payload);
  }

  async deleteVideo({ request, response, session }) {
    const { id } = request.allParams();
    const user = session.get("currentUserAccount");
    const ucDeleteVideo = new UCDeleteVideo(
      {
        repository: new VideosRepository(),
        functions: { hasPermission },
      });
    const { error, payload } = await ucDeleteVideo.run(id, user);
    handleAbstractUserCaseError(error);
    response.ok(payload);
  }

  async updateVideo({ request, response, session }) {
    const { id, novaDataInicioReproducao } = request.allParams();
    const user = session.get("currentUserAccount");
    const ucUpdateVideo = new UCUpdateVideo(
      {
        repository: new VideosRepository(),
        functions: { hasPermission },
      });

    const { error, payload } = await ucUpdateVideo.run(id, novaDataInicioReproducao, user);
    handleAbstractUserCaseError(error);
    response.ok(payload);
  }
}

module.exports = CarrosselController;
