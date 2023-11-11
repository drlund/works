"use strict";

class UCOrcamentoPatrocinioGravar {
  constructor(GestaoDetalhePatrociniosRepository, GravarOrcamentoPatrocinioFactory) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.GravarOrcamentoPatrocinioFactory = GravarOrcamentoPatrocinioFactory;
    this.validated = false;
  }

  async validate(usuario, dataOrcamento) {
    this.dataOrcamento = dataOrcamento;
    this.usuario= usuario;
    this.validated = true;
  }

  async run() {
    if (this.validated === false) {
      throw new exception(
        `O método validate() deve ser chamado antes do run()`,
        500
      );
    }

    const dadosOrcados = {...this.dataOrcamento, matricula: this.usuario.matricula, nome_usuario: this.usuario.nome_usuario}
    const dadosPreparados = await this.GravarOrcamentoPatrocinioFactory.gravarDetalheOrcamento(dadosOrcados);
    const orcamentoGravado = await this.GestaoDetalhePatrociniosRepository.gravarOrcamento(dadosPreparados);

    return orcamentoGravado;
  }
}

module.exports = UCOrcamentoPatrocinioGravar;
