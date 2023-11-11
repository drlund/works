"use strict";
const visao = use("App/Commons/Mtn/ComiteMtn/Constants");
const exception = use("App/Exceptions/Handler");

class UcGetDadosMonitoramento {
  constructor(Visoesrepository) {
    this.visoesRepository = Visoesrepository;
  }

  async validate(idMonitoramento) {
    const existeMonitoramento = await this.visoesRepository.existeMonitoramento(
      idMonitoramento
    );
    if (existeMonitoramento === false) {
      throw new exception("Id do monitoramento inválido!", 400);
    }
    this.idMonitoramento = idMonitoramento;
  }

  async run() {
    const fetchedVisao = await this.visoesRepository.getDadosMonitoramento(
      this.idMonitoramento
    );

    
    return fetchedVisao;
  }
}

module.exports = UcGetDadosMonitoramento;
