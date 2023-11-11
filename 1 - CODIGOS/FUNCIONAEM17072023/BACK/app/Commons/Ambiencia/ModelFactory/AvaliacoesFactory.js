"use strict";

class AvaliacoesFactory {
  transformToDatabase(avaliacoes, lock, usuario) {
    return avaliacoes.map((avaliacao) => {
      return {
        uor: lock.uor,
        prefixo: lock.prefixo,
        cd_subord: lock.cd_subord,
        idEvento: lock.idEvento,
        idImagemTipo: avaliacao.ambienteTipo,
        matriculaAvaliador: usuario.chave,
        nomeAvaliador: usuario.nome_usuario,
        nota: avaliacao.nota,
        idRegraAmbiente: avaliacao.idRegraAmbiente,
      };
    });
  }
}

module.exports = AvaliacoesFactory;
