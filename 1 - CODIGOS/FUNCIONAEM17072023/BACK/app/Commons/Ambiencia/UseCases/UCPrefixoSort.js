'use strict';

const PrefixosSortRepository = use("App/Commons/Ambiencia/Repositories/PrefixosSortRepository");
const exception = use("App/Exceptions/Handler");

class UCPrefixoSort {
  async validate(evento) {
    const camposObrigatorios = ['idEvento', 'usuario'];
    const { idEvento, usuario } = evento;

    for (const campoObrigatorio of camposObrigatorios) {
      if (evento[campoObrigatorio] === undefined) {
        throw new exception("Campos obrigatórios não foram informados!", 400);
      }
    }
    // adicionar os valores como parâmetro da classe
    // permite usar os parametros já recebidos no método run
    // para evitar enviar novamente os mesmos parâmetros
    this.idEvento = JSON.parse(idEvento);
    this.matricula = usuario.chave;
    this.validated = true;
  }

  async run() {
    if(this.validated === false){
      throw new exception(`O método validate() deve ser chamado antes do run()`, 500);
    }
    const prefixosSortRepository = new PrefixosSortRepository();
    const evento = await prefixosSortRepository.getPrefixoSort(this.evento);
    return evento;
  }
}

module.exports = UCPrefixoSort;