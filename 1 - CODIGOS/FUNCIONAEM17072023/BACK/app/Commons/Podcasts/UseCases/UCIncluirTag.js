"use strict";
const { AbstractUserCase } = require('../../AbstractUserCase');

class UCIncluirTag extends AbstractUserCase {
  async _checks({ nome, user }) {
    const isAdministradorTags = await this.functions.hasPermission({
      nomeFerramenta: "Podcasts",
      dadosUsuario: user,
      permissoesRequeridas: ["GERENCIAR"],
    });

    if (!isAdministradorTags) {
      throw new Error(
        "Você não tem permissão para acessar esta funcionalidade. Solicite ao administrador acesso ao aplicativo: Podcasts > GERENCIAR"
      );
    }
  }

  async _action({ nome, user }) {
    const nomeMaiusculo = removeCaracteresEspeciais(nome.toUpperCase());
    const jaExisteTag = await this.repository.getTagsByName(nomeMaiusculo);

    if (jaExisteTag) {
      this._throwExpectedError("Já existe uma tag com esse nome")
    }

    const corSorteada = sorteiaCor();

    return this.repository.postTag({ nomeMaiusculo, corSorteada });

  }
}

function sorteiaCor(){
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

function removeCaracteresEspeciais(string) {
  return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

module.exports = UCIncluirTag;
