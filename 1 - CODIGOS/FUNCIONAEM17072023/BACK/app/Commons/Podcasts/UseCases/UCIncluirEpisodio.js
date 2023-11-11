"use strict";
const { AbstractUserCase } = require('../../AbstractUserCase');

class UCIncluirEpisodio extends AbstractUserCase {
  async _checks({ nomeEpisodio, idCanal, tags, user }) {
    if (!this.repository.files.formatoValidoEpisodio) {
      throw new Error("Formato do arquivo inválido");
    }

    if (await this.repository.files.isSalvo()) {
      throw new Error("Já existe um arquivo com este nome");
    }

    const isAdministradorEpisodios = await this.functions.hasPermission({
      nomeFerramenta: "Podcasts",
      dadosUsuario: user,
      permissoesRequeridas: ["GERENCIAR"],
    });

    if (!isAdministradorEpisodios) {
      throw new Error(
        "Você não tem permissão para acessar esta funcionalidade. Solicite ao administrador acesso ao aplicativo: Podcasts > GERENCIAR"
      );
    }
  }

  async _action({ nomeEpisodio, idCanal, tags, user }) {


    const novoEpisodio = await this.salvarEpisodio(idCanal, nomeEpisodio, user);

    const todasTags = await this.salvarTags(tags);

    const episodioTagsSalvos = await this.salvarTagsEpisodio(todasTags, novoEpisodio);

    return { novoEpisodio, todasTags, episodioTagsSalvos };

  }

  async salvarTags(tags) {
    let todasTags = tags.existentes;

    if (tags.novas.length > 0) {
      const tagsTratadas = tags.novas.map((nome) => ({
        nome: tratamentoDeTags(nome),
        cor: sorteiaCor(),
      }));

      const novasTags = await this.repository.tags.criarManyTags(tagsTratadas, this.trx);
      todasTags = todasTags.concat(novasTags.map(nt => nt.id));

    }
    return todasTags;
  }

  async salvarTagsEpisodio(todasTags, novoEpisodio) {
    const episodioTagArr = todasTags.map(idTag => ({ idTag, idEpisodio: novoEpisodio.id }));
    const episodioTagsSalvos = await this.repository.episodioTags.salvarMany(episodioTagArr, this.trx);
    return episodioTagsSalvos;
  }

  async salvarEpisodio(idCanal, nomeEpisodio, user) {
    const isArquivoSalvo = await this.repository.files.salvarArquivo();
    const urlEpisodio = this.repository.files.nomeArquivo;

    if (isArquivoSalvo.type !== "success") {
      this._throwExpectedError("Erro ao gravar o arquivo", 500);
    }

    const novoEpisodio = await this.repository.episodios.criarEpisodio(
      idCanal,
      nomeEpisodio,
      user.chave,
      user.nome_usuario,
      urlEpisodio,
      this.trx
    );
    return novoEpisodio;
  }
}

function sorteiaCor() {
  const colors = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
  ];

  const indiceSorteado = Math.floor(Math.random() * colors.length);
  return colors[indiceSorteado];
}

function tratamentoDeTags(string) {
  return string.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

module.exports = UCIncluirEpisodio;
