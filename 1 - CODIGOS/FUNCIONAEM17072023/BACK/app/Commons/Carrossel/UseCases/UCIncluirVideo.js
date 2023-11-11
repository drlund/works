"use strict";

const moment = require("../../MomentZone");
const { AbstractUserCase } = require('../../AbstractUserCase');

class UCIncluirVideo extends AbstractUserCase {
  async _checks({ dataInicioReproducao, user }) {
    // da maneira que estava e da maneira que está,
    // caso não se passe a data, ele vai voltar a data de hoje
    if (!moment(dataInicioReproducao).isValid()) {
      throw new Error("Data inválida");
    }

    if (!this.repository.files.formatoValido) {
      throw new Error("Formato do arquivo inválido");
    }

    if (await this.repository.files.isSalvo()) {
      throw new Error("Já existe um arquivo com este nome");
    }

    const isAdministradorVideos = await this.functions.hasPermission({
      nomeFerramenta: 'Carrossel de Notícias',
      dadosUsuario: user,
      permissoesRequeridas: ['GERENCIAR'],

    });
    if (!isAdministradorVideos) {
      throw new Error("Você não tem permissão para acessar esta funcionalidade. Solicite ao administrador acesso no aplicativo: Carrossel de Notícias > GERENCIAR");
    }
  }

  async _action({ dataInicioReproducao, user }) {
    const dataInicioReproducaoParseada = moment(dataInicioReproducao).format("YYYY-MM-DD");

    const isArquivoSalvo = await this.repository.files.salvarArquivo();
    const url = this.repository.files.url;

    if (isArquivoSalvo.type !== 'success') {
      this._throwExpectedError("Erro ao gravar o arquivo", 500);
    }

    return this.repository.videos.postVideo(
      url,
      dataInicioReproducaoParseada,
      dataInicioReproducaoParseada,
      user.chave,
      user.nome_usuario
    );
  }

}
module.exports = UCIncluirVideo;
