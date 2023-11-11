"use strict";
class UCGestaoPatrocinioEditar {
  constructor(GestaoDetalhePatrociniosRepository) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.validated = false;
  }

  async validate(dataGestao) {
    this.dataGestao = dataGestao;
    // this.usuario= usuario;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const gestaoEditada = await this.GestaoDetalhePatrociniosRepository.patchEditaGestao(this.dataGestao);

    return gestaoEditada;
  }
}

module.exports = UCGestaoPatrocinioEditar;
