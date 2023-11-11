"use strict";

const moment = require('moment');
const logsAusenciasModel = use("App/Models/Postgres/LogsAusencias");

const logAusencias = async (
  dataAusencia,
  matricula,
  { finalSemana, feriadoNacional, feriadoPrefixo, funciAusente },
  trx = null
) => {
  const log = {
    matricula,
    data_verificacao: moment().format("YYYY-MM-DD"),
    data_verificada: moment(dataAusencia).format("YYYY-MM-DD"),
    final_semana: finalSemana,
    feriado_nacional: feriadoNacional,
    feriado_prefixo: feriadoPrefixo,
    funci_ausente: funciAusente,
  };
  trx === null
    ? await logsAusenciasModel.create(log)
    : await logsAusenciasModel.create(log, trx);
};

module.exports = logAusencias;
