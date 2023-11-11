"use strict";

const exception = use("App/Exceptions/Handler");
const { TIPOS_VOTOS } = use(
  "App/Commons/Mtn/ComiteMtn/Constants"
);

class UcGetDadosVersao {
  constructor(versoesRepository) {
    this.versoesRepository = versoesRepository;
  }

  async validate(idVersao) {
    const dadosVersao = await this.versoesRepository.getDadosVersao(
      idVersao
    );
    if (!dadosVersao) {
      throw new exception("Id da versão inválido!", 400);
    }

    this.dadosVersao = dadosVersao;
  }

  async run() {
    const votoParaAlteracao = this._getVotoParaAlteracao();
    return { ...this.dadosVersao, votoParaAlteracao };
  }

  _getVotoParaAlteracao() {
    for (const votoComite of this.dadosVersao.comite) {
      if (votoComite.tipo_voto_id === TIPOS_VOTOS.ALTERAR) {
        return votoComite;
      }
    }
    return null;
  }
}

module.exports = UcGetDadosVersao;
