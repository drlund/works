"use strict";

class Envolvido {
  isFinalizado({ respondido_em, aprovacao_pendente }) {
    if (respondido_em !== null || aprovacao_pendente === true) {
      return true;
    }
    return false;
  }

  isVersionado({versionado, versionado_em}){
    return versionado === true && versionado_em !== null;
  }

  /**
   *
   */
  deveCriarRecurso({ finalizar, cabeRecurso, qtdRecursos }) {
    return finalizar === true && cabeRecurso === true && qtdRecursos === 0;
  }
}

module.exports = Envolvido;
