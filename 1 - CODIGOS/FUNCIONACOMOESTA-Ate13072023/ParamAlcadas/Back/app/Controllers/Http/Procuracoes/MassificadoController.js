"use strict";

const { handleAbstractUserCaseError } = require('../../../Commons/AbstractUserCase');
const { getDadosFunciDb2 } = require('../../../Commons/Arh/getDadosFunciDb2');
const { getManyFuncis } = require('../../../Commons/Arh/getManyFuncis');
const MinutaRepository = require('../../../Commons/Procuracao/repositories/MinutaRepository');
const PesquisaRepository = require('../../../Commons/Procuracao/repositories/PesquisaRepository');
const UcDeleteManyMinutas = require('../../../Commons/Procuracao/useCases/massificado/UcDeleteManyMinutas');
const UcGetListaOutorgados = require('../../../Commons/Procuracao/useCases/massificado/UcGetListaOutorgados');
const UcRegenerateMassificadoMinuta = require('../../../Commons/Procuracao/useCases/massificado/UcRegenerateMassificadoMinuta');
const UcSaveMinutaBatch = require('../../../Commons/Procuracao/useCases/massificado/UcSaveMinutaBatch');

class MassificadoController {
  /**
   * @param {ControllerRouteProps<{
   *  listaDeMatriculas: string[],
   *  idFluxo: string,
   * }>} props
   */
  async getListaOutorgados({ request }) {
    const { idFluxo, listaDeMatriculas } = request.allParams();

    const { error, payload } = await new UcGetListaOutorgados({
      repository: {
        minutas: new MinutaRepository(),
      },
      functions: {
        getManyFuncis,
        getDadosFunciDb2,
      }
    }).run({
      idFluxo,
      listaDeMatriculas,
    });

    handleAbstractUserCaseError(error);

    return payload;
  }

  /**
   * @param {ControllerRouteProps<Procuracoes.MassificadoMinuta>} props
   */
  async postFinalizarMinuta({ request, usuarioLogado }) {
    const params = request.allParams();
    const { error, payload } = await new UcSaveMinutaBatch({
      repository: {
        minuta: new MinutaRepository(),
        pesquisa: new PesquisaRepository(),
      },
      functions: {
        getManyFuncis,
      }
    }).run({ ...params, matriculaRegistro: usuarioLogado.matricula });

    handleAbstractUserCaseError(error);

    return payload;
  }

  async getListaMinutasMassificado() {
    return new MinutaRepository().getListaMinutaMassificadoWithAtivos();
  }

  /**
   * @param {ControllerRouteProps<{ listaDeMinutas: string[] }>} props
   */
  async deleteManyMinutasMassificado({ request }) {
    const { listaDeMinutas } = request.allParams();
    const { error, payload } = await new UcDeleteManyMinutas({
      repository: {
        minutas: new MinutaRepository(),
      }
    }).run({ listaDeMinutas });

    handleAbstractUserCaseError(error);

    return payload;
  }

  /**
   * @param {ControllerRouteProps<{id: string}>} props
   */
  async regenerateMassificado({ request, response }) {
    const { id } = request.allParams();

    const { error, payload } = await new UcRegenerateMassificadoMinuta({
      repository: {
        minuta: new MinutaRepository(),
        pesquisa: new PesquisaRepository(),
      },
      functions: {
        getManyFuncis,
      },
    }).run(id);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }
}

module.exports = MassificadoController;
