"use strict";
const UCIndicadores = use("App/Commons/PainelGestor/UseCases/UCIndicadores");
const FatoPainelRepository = use(
  "App/Commons/PainelGestor/Repositories/FatoPainelRepository"
);
const UCListaSubordinadas = use(
  "App/Commons/PainelGestor/UseCases/UCListaSubordinadas"
);
const ListaPrefixosRepository = use(
  "App/Commons/PainelGestor/Repositories/ListaPrefixosRepository"
);
const UCAcesso = use("App/Commons/PainelGestor/UseCases/UCAcesso");
const AcessoRepository = use(
  "App/Commons/PainelGestor/Repositories/AcessoRepository"
);
const {handleAbstractUserCaseError} = use('App/Commons/AbstractUserCase')
class PainelGestorController {
  async verificaAcesso({ response, session }) {

    const usuario = session.get("currentUserAccount");
    const ucAcesso = new UCAcesso({repository: new AcessoRepository()});

    const { error, payload } = await ucAcesso.run(usuario);
    handleAbstractUserCaseError(error);
    response.ok(payload);
  }

  async getSubordinadasByPrefixo({ request, response }) {
    const { prefixo } = request.allParams();
    const ucListaSubordinadas = new UCListaSubordinadas({ repository: new ListaPrefixosRepository()}
    );
    const { error, payload } = await ucListaSubordinadas.run(prefixo);
    handleAbstractUserCaseError(error);

    response.ok(payload);
  }

  async getIndicadores({ request, response, transform }) {
    const { prefixo, subord } = request.allParams();

    const ucIndicadores = new UCIndicadores({repository: new FatoPainelRepository(), functions: {transform}});
    const { error, payload } = await ucIndicadores.run({ prefixo, subord });
    handleAbstractUserCaseError(error);

    response.ok(payload);
  }
}

module.exports = PainelGestorController;
