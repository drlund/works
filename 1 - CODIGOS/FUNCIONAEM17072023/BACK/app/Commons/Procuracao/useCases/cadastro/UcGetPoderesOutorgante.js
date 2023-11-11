"use strict";

const { REGEX_MATRICULA } = require("../../../Regex");

class UcGetPoderesOutorgante {
  constructor(procuracoesRepository) {
    this.procuracoesRepository = procuracoesRepository;
    this.validated = false;
    this.error = /** @type {false|{ msg: string, code: number }} */ (false);
    this.payload = null;
  }

  validate({ matriculaPesquisa }) {
    const isMatriculaValida = REGEX_MATRICULA.test(matriculaPesquisa);
    if (!isMatriculaValida) {
      this.error = { msg: "Matrícula inválida!", code: 400 };
      return;
    }

    this.matriculaPesquisa = matriculaPesquisa;
    this.validated = true;
  }

  async run() {
    if (this.error) {
      return { payload: null, error: this.error };
    }

    if (this.validated !== true) {
      return {
        payload: null,
        error: {
          msg: "Dados devem ser validados através do método validate()",
          code: 500,
        },
      };
    }

    try {
      const poderes = await this.procuracoesRepository.getPoderesByOutorgante(
        this.matriculaPesquisa
      );

      const payload = Array.isArray(poderes) ? poderes : [];
      return { payload, error: null };
    } catch (error) {
      return { error, payload: null };
    }
  }
}

module.exports = UcGetPoderesOutorgante;
