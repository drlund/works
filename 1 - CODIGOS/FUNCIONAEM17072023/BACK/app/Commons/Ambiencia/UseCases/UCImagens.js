"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");
const AMBIENTE_HUMANOGRAMA = 46;

class UCImagens extends AbstractUserCase {
  async _checks(uor, tipo = AMBIENTE_HUMANOGRAMA) {
    if (!uor) {
      throw new Error("Obrigatório informar a UOR do prefixo.");
    }
    this.uor = uor;
    this.tipo = tipo;
  }

  async _action() {
    const prefixoData = await this.repository.prefixo.getPrefixoDataByUor(this.uor);
    if (!prefixoData) {
      return 'não encontrado';
    }
    const imagem = await this.repository.imagem.getImagemByPrefixoSubordTipo(prefixoData?.prefixo, prefixoData?.subordinada, this.tipo);
    if (!imagem) {
      return 'não permitido';
    }
    const caminho = await this.repository.imagem.getCaminhoAbsoluto(imagem.fullpath);
    const isImagemExistente = await this.repository.imagem.isImagemExistente(caminho);
    return isImagemExistente ? caminho : 'não encontrado';
  }
}

module.exports = UCImagens;