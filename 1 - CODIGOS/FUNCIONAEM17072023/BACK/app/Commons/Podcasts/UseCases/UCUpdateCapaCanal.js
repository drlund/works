"use strict";
const { AbstractUserCase } = require('../../AbstractUserCase');

class UCUpdateCanal extends AbstractUserCase {

  async _checks(id, user) {
    if (!this.repository.files.formatoValidoCapa) {
      throw new Error("Formato do arquivo inválido");
    }

    if (await this.repository.files.isSalvo()) {
      throw new Error("Já existe um arquivo com este nome");
    }

    const isAdministradorCanais = await this.functions.hasPermission({
      nomeFerramenta: 'Podcasts',
      dadosUsuario: user,
      permissoesRequeridas: ['GERENCIAR'],
    });

    if (!isAdministradorCanais) {
      throw new Error("Você não tem permissão para acessar esta funcionalidade.");
    }
  }

  async _action(id, user) {

    const isArquivoSalvo = await this.repository.files.salvarArquivo();
    const novaImagem = this.repository.files.nomeArquivo;

    if (isArquivoSalvo.type !== 'success') {
      this._throwExpectedError("Erro ao gravar o arquivo", 500);
    }

    return this.repository.canais.updateCapaCanal(id, novaImagem);

  }

}

module.exports = UCUpdateCanal