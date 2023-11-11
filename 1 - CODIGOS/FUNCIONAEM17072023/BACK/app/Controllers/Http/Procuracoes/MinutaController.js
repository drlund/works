"use strict";

const { handleAbstractUserCaseError } = require('../../../Commons/AbstractUserCase');
const getOneFunci = require('../../../Commons/Arh/getOneFunci');
const MinutaRepository = require('../../../Commons/Procuracao/repositories/MinutaRepository');
const {
  UcGetFluxoMinuta,
  UcGetListaMinuta,
  UcGetMinuta,
  UcGetMinutaTemplate,
  UcRegenerateMinuta,
  UcSaveMinuta,
  UcSoftDeleteMinuta
} = require('../../../Commons/Procuracao/useCases/minuta');
const PesquisaController = require('./PesquisaController');

class MinutaController {
  /**
   * @param {ControllerRouteProps<unknown>} props
   */
  async saveMinuta({ request, response, usuarioLogado }) {
    const params = request.allParams();

    const { payload, error } = await new UcSaveMinuta({
      repository: new MinutaRepository(),
      functions: {
        getOneFunci,
        getProcuracao: new PesquisaController()._getProcuracao,
      }
    }).run({
      ...params,
      matriculaRegistro: usuarioLogado.matricula,
    });

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  /**
   * @param {ControllerRouteProps<{id: string, prefixo: string, matricula: string}>} props
   */
  async getMinuta({ request, response }) {
    const { id, prefixo, matricula } = request.allParams();

    if (id) {
      return response.ok(await this.#getOneMinuta(id));
    }

    const { payload, error } = await new UcGetListaMinuta({
      repository: new MinutaRepository(),
    }).run({ matricula, prefixo });

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  /**
   * @param {ControllerRouteProps<{id: string}>} props
   */
  async getMinutaTemplate({ request, response }) {
    const { id } = request.allParams();

    const { payload, error } = await new UcGetMinutaTemplate({
      repository: new MinutaRepository(),
    }).run(id);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  /**
   * @param {ControllerRouteProps<{id: string}>} props
   */
  async getFluxosMinuta({ request, response }) {
    const { id } = request.allParams();

    const { payload, error } = await new UcGetFluxoMinuta({
      repository: new MinutaRepository(),
    }).run(id);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  /**
   * @param {ControllerRouteProps<{id: string}>} props
   */
  async regenerateMinuta({ request, response }) {
    const { id } = request.allParams();

    const { payload, error } = await new UcRegenerateMinuta({
      repository: new MinutaRepository(),
      functions: {
        getOneFunci,
        getProcuracao: new PesquisaController()._getProcuracao,
      }
    }).run(id);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  /**
   * @param {ControllerRouteProps<{id: string}>} props
   */
  async softDeleteMinutaCadastrada({ request, response }) {
    const { id } = request.allParams();

    const { error } = await new UcSoftDeleteMinuta({ repository: new MinutaRepository() }).run(id);

    handleAbstractUserCaseError(error);

    return response.noContent();
  }

  /**
   * @param {string} id
   */
  async #getOneMinuta(id) {
    const { payload, error } = await new UcGetMinuta({
      repository: new MinutaRepository()
    }).run(id);

    handleAbstractUserCaseError(error);

    return payload;
  }
}

module.exports = MinutaController;
