"use strict";

const moment = require ("moment");

class UCPagamentoPatrocinioGravar {
  constructor(GestaoDetalhePatrociniosRepository, GravarPagamentoPatrocinioFactory) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.GravarPagamentoPatrocinioFactory = GravarPagamentoPatrocinioFactory;
    this.validated = false;
  }

  async validate(usuario, dataPagamento) {
    this.dataPagamento = dataPagamento;
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

    const dadosDoPagamento = {...this.dataPagamento, dataDoPagamento: moment(this.dataPagamento.dataDoPagamento).format("YYYY-MM-DD h:mm:ss"),  matricula: this.usuario.matricula, nome_usuario: this.usuario.nome_usuario }
    const dadosPreparados = await this.GravarPagamentoPatrocinioFactory.gravarDetalhePagamento(dadosDoPagamento);
    const pagamentoGravado = await this.GestaoDetalhePatrociniosRepository.gravarPagamento(dadosPreparados);

    return pagamentoGravado;
  }
}

module.exports = UCPagamentoPatrocinioGravar;
