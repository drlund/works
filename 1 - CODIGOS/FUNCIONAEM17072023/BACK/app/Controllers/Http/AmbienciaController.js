"use strict";

const UCPrefixoAvaliavel = use(
  "App/Commons/Ambiencia/UseCases/UCPrefixoAvaliavel"
);
const UCPermissaoAcesso = use(
  "App/Commons/Ambiencia/UseCases/UCPermissaoAcesso"
);
const UCPrefixoLocked = use("App/Commons/Ambiencia/UseCases/UCPrefixoLocked");
const UCPrefixoToLock = use("App/Commons/Ambiencia/UseCases/UCPrefixoToLock");
const UCRegistrarAvaliacao = use(
  "App/Commons/Ambiencia/UseCases/UCRegistrarAvaliacao"
);
const UCCampanhas = use("App/Commons/Ambiencia/UseCases/UCCampanhas");

const PrefixosRepository = require("../../Commons/Ambiencia/Repositories/PrefixosRepository");
const ImagensRepository = require("../../Commons/Ambiencia/Repositories/ImagensRepository");
const UCImagens = require("../../Commons/Ambiencia/UseCases/UCImagens");

const PrefixosLockRepository = use(
  "App/Commons/Ambiencia/Repositories/PrefixosLockRepository"
);
const EventoRepository = use(
  "App/Commons/Ambiencia/Repositories/EventoRepository"
);
const AcessoMatriculaRepository = use(
  "App/Commons/Ambiencia/Repositories/AcessoMatriculaRepository"
);
const AcessoPrefixoRepository = use(
  "App/Commons/Ambiencia/Repositories/AcessoPrefixoRepository"
);
const AmbientesRepository = use(
  "App/Commons/Ambiencia/Repositories/AmbientesRepository"
);
const AvaliacaoRepository = use(
  "App/Commons/Ambiencia/Repositories/AvaliacaoRepository"
);
const CampanhasRepository = use(
  "App/Commons/Ambiencia/Repositories/CampanhasRepository"
);
const { handleAbstractUserCaseError } = use("App/Commons/AbstractUserCase");

class AmbienciaController {
  constructor() {
    this.imagensRepository = new ImagensRepository();
    this.prefixosRepository = new PrefixosRepository();
  }

  async getPrefixoAvaliavel({ request, response, session }) {
    const usuario = session.get("currentUserAccount");
    const { idEvento } = request.allParams();

    const ucPrefixoAvaliavel = new UCPrefixoAvaliavel(
      new UCPermissaoAcesso(
        new AcessoMatriculaRepository(),
        new AcessoPrefixoRepository(),
        new EventoRepository()
      ),
      new UCPrefixoLocked(new PrefixosLockRepository()),
      new UCPrefixoToLock(new PrefixosLockRepository(), new EventoRepository()),
      new EventoRepository(),
      new AmbientesRepository(),
      new AvaliacaoRepository()
    );
    await ucPrefixoAvaliavel.validate(parseInt(idEvento), usuario);
    const prefixoAvaliavel = await ucPrefixoAvaliavel.run();
    response.ok(prefixoAvaliavel);
  }

  async registrarAvaliacao({ request, response, session }) {
    const usuario = session.get("currentUserAccount");
    const { idLock, avaliacoes } = request.allParams();
    const ucRegistrarAvaliacao = new UCRegistrarAvaliacao(
      PrefixosLockRepository,
      AvaliacaoRepository,
      AmbientesRepository
    );

    await ucRegistrarAvaliacao.validate(idLock, avaliacoes, usuario);
    await ucRegistrarAvaliacao.run();
    response.ok(avaliacoes);
  }

  async getCampanhas({ request, response, session }) {
    const usuario = session.get("currentUserAccount");
    const ucCampanhas = new UCCampanhas(new CampanhasRepository());
    await ucCampanhas.validate();
    const campanhas = await ucCampanhas.run();
    response.ok(campanhas);
  }

  async getImagemApi({ request, response }) {
    const { uor, tipo } = request.allParams();

    const ucImagens = new UCImagens({
      repository: {
        imagem: this.imagensRepository,
        prefixo: this.prefixosRepository,
      },
    });

    const { error, payload } = await ucImagens.run(uor, tipo);
    handleAbstractUserCaseError(error);
    response.download(payload);
  }
}

module.exports = AmbienciaController;
