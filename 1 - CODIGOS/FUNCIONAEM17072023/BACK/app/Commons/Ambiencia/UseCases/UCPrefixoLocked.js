'use strict';

const exception = use("App/Exceptions/Handler");

class UCPrefixoLocked {
  constructor(PrefixosLockRepository) {
    this.prefixosLockRepository = PrefixosLockRepository;
    this.validated = false;
  }

  async validate(idEvento, matricula) {
    if (!idEvento) {
      throw new exception("É obrigatório informar o id do Evento!", 400);
    }
    if(!matricula) {
      throw new exception("Não foi possível identificar a matrícula do usuário!", 400);
    }

    // adicionar os valores como parâmetro da classe
    // permite usar os parametros já recebidos no método run
    // para evitar enviar novamente os mesmos parâmetros
    this.idEvento = JSON.parse(idEvento);
    this.matricula = matricula;
    this.validated = true;
  }

  async run() {
    if(this.validated === false){
      throw new exception(`O método validate() deve ser chamado antes do run()`, 500);
    }
    const prefixoLocked = await this.prefixosLockRepository.getPrefixoLockedByUserEvento(this.idEvento, this.matricula);
    return prefixoLocked;
  }
}

module.exports = UCPrefixoLocked;