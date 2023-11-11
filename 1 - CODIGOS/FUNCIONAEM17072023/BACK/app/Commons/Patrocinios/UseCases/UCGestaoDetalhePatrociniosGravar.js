"use strict";

const moment = require ("moment");

class UCGestaoDetalhePatrociniosGravar {
  constructor(GestaoDetalhePatrociniosRepository, GravarGestaoDetalhePatrocinioFactory) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.GravarGestaoDetalhePatrocinioFactory = GravarGestaoDetalhePatrocinioFactory;
    this.validated = false;
  }

  async validate(usuario, dataGestao) {
    this.dataGestao = dataGestao;
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

    const dadosSolicitados = {...this.dataGestao, dataSac: moment(this.dataGestao.dataSac).format("YYYY-MM-DD h:mm:ss"), matricula: this.usuario.matricula, nome_usuario: this.usuario.nome_usuario }
    const dadosPreparados = await this.GravarGestaoDetalhePatrocinioFactory.gravarDetalheGestao(dadosSolicitados);

    const isDadosGravados = await this.GestaoDetalhePatrociniosRepository.gravarDetalheGestaoDePatrocinios(dadosPreparados);

    return isDadosGravados;
  }
}

module.exports = UCGestaoDetalhePatrociniosGravar;
