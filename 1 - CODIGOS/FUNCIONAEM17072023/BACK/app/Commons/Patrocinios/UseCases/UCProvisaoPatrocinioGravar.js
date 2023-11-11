"use strict";

const moment = require ("moment");

class UCProvisaoPatrocinioGravar {
  constructor(GestaoDetalhePatrociniosRepository, GravarProvisaoPatrocinioFactory) {
    this.GestaoDetalhePatrociniosRepository = GestaoDetalhePatrociniosRepository;
    this.GravarProvisaoPatrocinioFactory = GravarProvisaoPatrocinioFactory;
    this.validated = false;
  }

  async validate(usuario, dataProvisao) {
    this.dataProvisao = dataProvisao;
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

    const dadosProvisionados = {...this.dataProvisao, competenciaProvisao: moment(this.dataProvisao.competenciaProvisao).format("YYYY-MM-DD h:mm:ss"), matricula: this.usuario.matricula, nome_usuario: this.usuario.nome_usuario }
    const dadosPreparados = await this.GravarProvisaoPatrocinioFactory.gravarDetalheProvisao(dadosProvisionados);
    const isProvisaoGravadas = await this.GestaoDetalhePatrociniosRepository.gravarProvisao(dadosPreparados);

    return isProvisaoGravadas;
  }
}

module.exports = UCProvisaoPatrocinioGravar;
