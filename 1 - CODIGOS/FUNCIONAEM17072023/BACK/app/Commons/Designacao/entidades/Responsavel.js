"use strict"

class Responsavel {
  transform(dados, user) {
    return {
      responsavel: dados.responsavel,
      funcionarioLogado: user.chave,
      permissaoRegistro: dados.registro,
      prefixoDestino: dados.pref_dest,
      funciOuPrefixoSolicitante: dados.matr_solicit === user.chave || dados.pref_dest === user.prefixo
    }
  }
}

module.exports = Responsavel;