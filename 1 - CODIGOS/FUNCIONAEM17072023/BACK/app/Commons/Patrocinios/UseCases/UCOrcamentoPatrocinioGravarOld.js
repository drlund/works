"use strict";

const moment = require ("moment");

class UCOrcamentoPatrocinioGravar {
  constructor(GestaoDetalhePatrociniosRepository, GravarOrcamentoDetalhePatrocinioFactory) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.GravarOrcamentoDetalhePatrocinioFactory = GravarOrcamentoDetalhePatrocinioFactory;
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

    // Spread nos dados que chegam do formulário juntamente com as demais informações já recebidas:
    const orcamentoGravado = await this.GestaoDetalhePatrociniosRepository.gravarOrcamento({...this.dataOrcamento, matricula: this.usuario.matricula, nome_usuario: this.usuario.nome_usuario });
    const dadosOrcados = await this.GravarOrcamentoDetalhePatrocinioFactory.gravarDetalheOrcamento({...this.dataOrcamento, matricula: this.usuario.matricula, nome_usuario: this.usuario.nome_usuario } );
    // const isOrcamentosGravados = await this.GestaoDetalhePatrociniosRepository.gravarOrcamentoDePatrocinios(dadosOrcados);
    const isOrcamentosGravados = await this.GestaoDetalhePatrociniosRepository.gravarOrcamento(orcamentoGravado);

    return isOrcamentosGravados;
  }
}

module.exports = UCOrcamentoPatrocinioGravar;
