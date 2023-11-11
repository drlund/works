const exception = use("App/Exceptions/Handler");
const moment = require("moment");
const _ = require("lodash");
const Superadm = use("App/Models/Mysql/Superadm");
const Solicitacoes = use("App/Models/Mysql/HorasExtras/Solicitacoes");
const Constants = use("App/Commons/HorasExtras/Constants");
const podeRealizarDespacho = use("App/Commons/HorasExtras/podeRealizarDespacho");
const getSaldoBHAtual = use("App/Commons/HorasExtras/getSaldoBHAtual");
const updateSaldoBH = use("App/Commons/HorasExtras/updateSaldoBH");
const getTotalAutorizadoMes = use("App/Commons/HorasExtras/getTotalAutorizadoMes");

async function getDadosSolicitacao(user, idSolicitacao = null, protocolo = null) {
  try {
    if (_.isNil(idSolicitacao) && _.isNil(protocolo)) throw new exception();

    const result = Solicitacoes.query()
      .with("compensacao")
      .with("estado")
      .leftJoin('relatorio', 'solicitacoes.pref_dep', 'relatorio.prefixo');

    if (idSolicitacao) result.where('id', idSolicitacao);
    if (!idSolicitacao && protocolo) result.where('protocolo', protocolo);

    result.orderBy('relatorio.posicao', 'desc')
    const resultado = await result.first();

    const dataResult = resultado.toJSON();

    dataResult.num_despacho_autorizado = null;
    dataResult.compensacao = JSON.parse(dataResult.compensacao.compensacao);

    if (dataResult.status === Constants.AGUARDANDO_SUPER_ESTADUAL) {
        if (podeRealizarDespacho(user, dataResult.pref_sup, "1") &&
            moment(dataResult.data_evento).isSame(moment(), 'month')) {
            dataResult.num_despacho_autorizado = 1;
        }
    }

    if (dataResult.status === Constants.AGUARDANDO_SUPER_ADM) {
        if (podeRealizarDespacho(user, null, "2") &&
            moment(dataResult.data_evento).isSame(moment(), 'month')) {
            dataResult.num_despacho_autorizado = 2;
        }
    }

    if ([Constants.AGUARDANDO_SUPER_ESTADUAL, Constants.AGUARDANDO_SUPER_ADM].includes(dataResult.status) &&
        dataResult.adesao_banco_horas === "SIM") {

        dataResult.saldo_banco_horas = await getSaldoBHAtual(dataResult.mat_dest);
    }

    dataResult.total_aut_mes = await getTotalAutorizadoMes(dataResult.pref_dep, moment(dataResult.data_evento));

    return dataResult;
  } catch (err) {
    throw new exception(err, 404);
  }
}

module.exports = getDadosSolicitacao;
