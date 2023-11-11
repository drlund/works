"use strict";
class UCOrcamentoPatrocinioEditar {
  constructor(GestaoDetalhePatrociniosRepository) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.validated = false;
  }

  async validate(dataOrcamento) {
    this.dataOrcamento = dataOrcamento;
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

    const orcamentoEditado = await this.GestaoDetalhePatrociniosRepository.patchOrcamento(this.dataOrcamento );

    return orcamentoEditado;
  }
}

module.exports = UCOrcamentoPatrocinioEditar;
