"use strict";
const { AbstractUserCase } = require('../../AbstractUserCase');

class UCIncluirCanal extends AbstractUserCase {
  async _checks({nome, descricao, user}) {

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
    if(!isAdministradorCanais) {
      throw new Error("Você não tem permissão para acessar esta funcionalidade.");
    }
  }

  async _action({ nome, descricao, user }) {
    const isArquivoSalvo = await this.repository.files.salvarArquivo();
    const imagem = this.repository.files.nomeArquivo;

    if (isArquivoSalvo.type !== 'success') {
      this._throwExpectedError("Erro ao gravar o arquivo", 500);
    }

    return this.repository.canais.postCanal(
      nome,
      descricao,
      user.uor_trabalho,
      user.prefixo,
      user.dependencia,
      user.nome_usuario,
      user.chave,
      imagem,
    );
  }


}

module.exports = UCIncluirCanal;
