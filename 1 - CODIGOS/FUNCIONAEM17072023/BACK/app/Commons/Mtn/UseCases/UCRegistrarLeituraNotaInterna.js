"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");

class UCRegistrarLeituraNotaInterna extends AbstractUserCase {
  async _checks(idEnvolvido, idNotaInterna, usuario) {
    if (!idEnvolvido || typeof idEnvolvido !== 'number') {
      throw new Error("Não é possível registrar a leitura sem o envolvido.");
    }
    
    const isEnvolvidoExiste = await this.repository.envolvido.isEnvolvidoExiste(idEnvolvido);
    if(!isEnvolvidoExiste) {
      throw new Error("O envolvido informado não consta no banco de dados.");
    }
    
    const isAdministradorMtn = await this.functions.hasPermission({
      nomeFerramenta: 'MTN',
      dadosUsuario: usuario,
      permissoesRequeridas: ['ANALISAR'],
      verificarTodas: true
    });
    if(!isAdministradorMtn) {
      throw new Error("Você não tem permissão para acessar esta funcionalidade.");
    }

    const isLida = await this.repository.notaInterna.isNotaLida(idNotaInterna, usuario.chave);
    this.isLida = isLida;    
  }

  async _action(idEnvolvido, idNotaInterna, usuarioLogado) {

    if(this.isLida === true){
      return;
    }

    const gravou = await this.repository.notaInterna.gravarLeituraDaNota(
      idEnvolvido,
      idNotaInterna,
      usuarioLogado
    );

    if (gravou) {
      const listaAtualizada = await this.repository.notaInterna.getNotasLidasByEnvolvidoEUsuario(
        idEnvolvido,
        usuarioLogado.chave
      );
      return listaAtualizada;
    }
  }
}

module.exports = UCRegistrarLeituraNotaInterna;
