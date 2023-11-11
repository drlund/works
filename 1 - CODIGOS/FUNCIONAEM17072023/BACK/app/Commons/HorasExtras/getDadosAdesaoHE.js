const exception = use("App/Exceptions/Handler");
const MestreSas = use("App/Models/Mysql/MestreSas");
const Funci = use('App/Models/Mysql/Arh/Funci');
const Solicitacoes = use("App/Models/Mysql/HorasExtras/Solicitacoes");
const BaseHorasExtras = use("App/Models/Mysql/HorasExtras/BaseHorasExtras");
const CargosComissoes = use("App/Models/Mysql/Arh/CargosComissoes");
const _ = require("lodash");
const moment = require("moment");

const inicioFimMes = use("App/Commons/HorasExtras/funcoesHora");

const round = (num, dec = 0) => {
  let num_sign = num >= 0 ? 1 : -1;
  return parseFloat((Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec));
}


async function getDadosAdesaoHE(matricula) {
  try {
    let funci, dadosFunci, dadosAdesao, Solicitado = 0, Autorizado = 0, Realizado = 0, mesAtual = 0, proximoMes = 0, saldoTotal = 0;

    const {inicioMes, fimMes} = inicioFimMes(moment());

    if (matricula) {
      dadosAdesao = {
        adesao: 0,
        aderiu: 'NÃO',
        saldo_horas: 0,
      };

      const funciNario = await Funci.query()
        .with("ddComissao")
        .with("funcaoLotacao")
        .where("matricula", matricula)
        .first();

      if (funciNario) {
        funci = funciNario.toJSON();

        if (_.isNil(funci.ddComissao)) {
          const ddComissao = await CargosComissoes.query()
            .where('cd_funcao', parseInt(funci.comissao))
            .first();

          funci.ddComissao = ddComissao.toJSON();
        }

        if (_.isNil(funci.funcaoLotacao)) {
          const funcaoLotacao = await CargosComissoes.query()
            .where('cd_funcao', parseInt(funci.funcao_lotacao))
            .first();

          funci.funcaoLotacao = funcaoLotacao.toJSON();
        }
      }

      const adesaoHR = await MestreSas.query()
        .select("matricula")
        .from("arh_adesao_bh")
        .where("matricula", matricula)
        .where("cd_estado", 2)
        .first();

      if (adesaoHR) {
        dadosAdesao.adesao = 1;
        dadosAdesao.aderiu = 'SIM';
      }

      let bcoHora = await BaseHorasExtras.query()
        .table('app_horas_extras')
        .where('matricula', matricula)
        .first();

      if (!_.isEmpty(bcoHora)) {
        dadosFunci = bcoHora.toJSON();

        mesAtual = dadosFunci.mes_0 || 0;
        proximoMes = dadosFunci.mes_1 || 0;
        saldoTotal = dadosFunci.total_horas || 0;
      }

      const dadosAppHE = await Solicitacoes.query()
        .where(builder => {
          builder.where('data_evento', '>', inicioMes)
            .where('data_evento', '<', fimMes)
        })
        .where('mat_dest', matricula)
        .fetch();

      if (dadosAppHE) {
        const solicitFunci = dadosAppHE.toJSON();
        Solicitado = solicitFunci.map(item => item.qtd_horas_sol).reduce((acc,prox) => acc + prox, 0);
        Autorizado = solicitFunci.map(item => item.qtd_horas_aut).reduce((acc,prox) => acc + prox, 0);
      }

      const horasFunci = await BaseHorasExtras.query()
        .from('he_jornada')
        .where('matricula', matricula)
        .where(bld => {
          bld.where('data_jornada', '>', inicioMes)
            .where('data_jornada', '<', fimMes)
        })
        .where('hr_utiliz', '<>', '00,0')
        .fetch();

      const heFunci = horasFunci.toJSON();

      Realizado = heFunci.map(elem => parseFloat(elem.hr_utiliz.replace(',', '.'))).reduce((acc, prox) => acc + prox, 0.0);

      dadosAdesao = {...dadosAdesao, saldoTotal, Solicitado: round(Solicitado), Autorizado: round(Autorizado), Realizado: round(Realizado), mesAtual, proximoMes, nome: funci.nome.split(" ")[0]};
    }

    return {dadosAdesao: dadosAdesao, ddComissao: funci.ddComissao};
  } catch (err) {
    throw new exception(err, 404);
  }
}

module.exports = getDadosAdesaoHE;
