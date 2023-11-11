"use strict";

const FuncionarioRepository = use(
  "App/Commons/Arh/Funcionario/FuncionarioRepository"
);
const moment = require("moment");
const { getOneFunci } = use("App/Commons/Arh");

class Funcionario {
  constructor(matricula, receivedFuncionarioRepository = null) {
    this.matricula = matricula;
    this.repository =
      receivedFuncionarioRepository === null
        ? new FuncionarioRepository()
        : new receivedFuncionarioRepository();
  }

  async getOneFunci() {
    const funci = await getOneFunci(this.matricula);
    return funci;
  }

  async getDadosFunciComAusencias(
    matricula,
    dataInicioRecebida,
    dataFimRecebida
  ) {
    const dataInicio = moment(dataInicioRecebida);
    const dataFim = dataFimRecebida ? moment(dataFimRecebida) : moment();

    if (!dataInicio.isValid() || !dataFim.isValid()) {
      throw "Data Inválida";
    }

    const ausencias = await this.getAusencias(
      moment(dataInicio).format("YYYY-MM-DD"),
      dataFim
        ? moment(dataFim).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD")
    );

    const funci = await this.getOneFunci(matricula);
    funci.ausencias = ausencias;

    return funci;
  }

  async getAusencias(dataInicio, dataFim) {
    const agencias = await this.repository.getAusencias(
      this.matricula,
      dataInicio,
      dataFim
    );
    return agencias;
  }
}

module.exports = Funcionario;
