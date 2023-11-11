"use strict";

const Locks = use("App/Models/Mysql/Ambiencia/EventoPrefixoLock.js");

class LockFactory {
  async lock(prefixo, usuario) {
    const lock = new Locks();
    lock.idEvento = prefixo.idEvento;
    lock.prefixo = prefixo.prefixo;
    lock.cd_subord = prefixo.subord;
    lock.matricula = usuario.chave;
    lock.nome = usuario.nome_usuario;
    lock.uor = prefixo.uor;

    return lock;
  }
}

module.exports = LockFactory;
