"use strict";

const _ = require("lodash");

class UCGestaoPatrociniosOpcoes {
  constructor(GestaoDetalhePatrociniosRepository, ) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.validated = false;
  }

  async validate(id) {
    this.id = id;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const opcoesFormGestao = await this.GestaoDetalhePatrociniosRepository.getOpcoesFormGestao();
    const opcoesFormProvisao = await this.GestaoDetalhePatrociniosRepository.getOpcoesFormProvisao();
    const nomeEvento = await this.GestaoDetalhePatrociniosRepository.getSolicitacaoById(this.id)

    const listaDeOpcoesDoFormulario = {opcoesFormGestao, opcoesFormProvisao, nomeEvento}

    return listaDeOpcoesDoFormulario;
  }
}

module.exports = UCGestaoPatrociniosOpcoes;
