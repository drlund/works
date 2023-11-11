const exception = use("App/Exceptions/Handler");
const _ = require("lodash");
const HorasExtras = use("App/Models/Mysql/HorasExtras/HorasExtras");
const Solicitacoes = use("App/Models/Mysql/HorasExtras/Solicitacoes");
const Realizado = use("App/Models/Mysql/HorasExtras/Realizado");
const BaseHorasExtras = use("App/Models/Mysql/HorasExtras/BaseHorasExtras");
const Superadm = use("App/Models/Mysql/Superadm");
const MestreSas = use("App/Models/Mysql/MestreSas");
const JurisdicoesSubordinadas = use('App/Models/Mysql/JurisdicoesSubordinadas');
const getDadosSolicitacao = use("App/Commons/HorasExtras/getDadosSolicitacao");
const Constants = use("App/Commons/HorasExtras/Constants");
const isPrefixoSuperAdm = use("App/Commons/HorasExtras/isPrefixoSuperAdm");
const inicioFimMes = use("App/Commons/HorasExtras/funcoesHora");
const {funciPossuiPerfil} = use("App/Commons/ServiceProvider");
const moment = require('moment');
const Dipes = use("App/Models/Mysql/Dipes");
const Prefixo = use("App/Models/Mysql/Arh/Prefixo");
const {isPrefixoUN, isPrefixoUT} = use("App/Commons/Arh");
const { executeDB2Query } = use('App/Models/DB2/DB2Utils');

const round = (num, dec = 0) => {
  let num_sign = num >= 0 ? 1 : -1;
  return parseFloat((Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec));
}

async function getResumoGeral (user, tipo, idSolicitacao = null, prefixo = null) {
  try {

    let resultadoFinal = {};
    let visoes = [];
    let solicitacao = null;
    let solictProprioMes = true;
    let prefixoSolicitado, realizadoAg, visaoAgencia, visaoRegional, visaoSuper, visaoDir;

    if (_.isNil(idSolicitacao)) {
      prefixoSolicitado = prefixo || user.prefixo;
    } else {
      const tmpData = await getDadosSolicitacao(user, idSolicitacao);

      prefixoSolicitado = tmpData.pref_dep;
      solictProprioMes = moment(tmpData.data_evento).isSame(moment(), 'month');
      solicitacao = {...tmpData};

      if (!_.isNil(tmpData.foto_resumo_geral)) {

        const resumoGeral = JSON.parse(tmpData.foto_resumo_geral);
        visoes = resumoGeral.visoes.filter(resumo => resumo.nomeVisao !== "Visão Funcionário");
      }
    }

    if (!_.isEmpty(visoes)) return [visoes, solictProprioMes, solicitacao];

    const isPrefUN = await isPrefixoUN(prefixoSolicitado);

    const isPerfilUN = await isPrefixoUN(user.prefixo);
    const isPrefUT = !isPerfilUN && await isPrefixoUT(user.prefixo);
    const isPerfilSuperAdm = isPrefUT && await isPrefixoSuperAdm(user.prefixo);
    const isPerfilRegional = !isPerfilSuperAdm && (user.gerev !== '0000');
    const isPerfilSuper = !isPerfilRegional && !isPerfilSuperAdm && isPrefUT;

    const {inicioMes, fimMes} = inicioFimMes(moment());

    if (isPrefUN || prefixo !== user.pref_super) {

      const hERealizadoAg = await Dipes.query()
        .select('he_pr_diu as he_diurna', 'he_pr_not as he_noturna')
        .from('arh7966')
        .where('prefixo_localizacao', prefixoSolicitado)
        .where('data_jornada', '>=', inicioMes)
        .where('data_jornada', '<=', fimMes)
        .fetch();

      const resultRealizadoAg = hERealizadoAg.toJSON();

      const valorRealizadoAg = resultRealizadoAg.map(real => {
        const diu = parseFloat(real.he_diurna.replace(",", "."));
        const not = parseFloat(real.he_noturna.replace(",", "."));

        const valDiu = diu > 0 ? diu : 0;
        const valNot = not > 0 ? not : 0;

        return valDiu + valNot;
      });

      realizadoAg = {
        Realizado : round(valorRealizadoAg),
        posicao: moment().format(Constants.DATABASE_DATE_OUTPUT)
      }

      let solicitacoes = await Solicitacoes.query()
        .where('pref_dep', prefixoSolicitado)
        .where('data_evento', '>=', inicioMes)
        .where('data_evento', '<=', fimMes)
        .fetch();

      solicitacoes = solicitacoes.toJSON();

      let bcohora = await BaseHorasExtras.query()
        .table("app_horas_extras")
        .where("prefixo", prefixoSolicitado)
        .fetch();

      bcohora = bcohora.toJSON();

      const Solicitado = solicitacoes.map(solic => solic.qtd_horas_sol).reduce(((prevValor, curValor) => prevValor + curValor), 0);
      const Autorizado = solicitacoes.map(solic => solic.qtd_horas_aut).reduce(((prevValor, curValor) => prevValor + curValor), 0);
      const mesAtualAg = bcohora.map(bh => bh.mes_0).reduce(((prevValor, curValor) => prevValor + curValor), 0);
      const proximoMesAg = bcohora.map(bh => bh.mes_1).reduce(((prevValor, curValor) => prevValor + curValor), 0);
      const horasAcumuladasTotalAg = bcohora.map(bh => bh.total_horas).reduce(((prevValor, curValor) => prevValor + curValor), 0);

      visaoAgencia = {
        visao: "Dependência",
        NomeVisao: `Dependência (${prefixoSolicitado})`,
        Realizado: round(realizadoAg.Realizado),
        Solicitado: Solicitado,
        Autorizado: Autorizado,
        mesAtual: mesAtualAg,
        proximoMes: proximoMesAg,
        horasAcumuladasTotal: horasAcumuladasTotalAg
      };

      visoes.push(visaoAgencia);
      resultadoFinal.posicao = realizadoAg.posicao;
    }

    if (isPrefUT) {

      let uor_trabalho;

      if (isPrefUN) {
        uor_trabalho = await MestreSas.query()
          .select("uor_pai as uor", "prefixo_pai as prefixo")
          .table("tb_jurisdicoes")
          .where("prefixo_filha", prefixoSolicitado)
          .first();
      }

      if (!isPrefUN) {
        const uor_gerev = await MestreSas.query()
          .select("uor_gerev as uor")
          .table("vinculo_gerev")
          .where("uor_trabalho", user.uor_trabalho)
          .first();

        if (uor_gerev && uor_gerev.uor) {
          uor_trabalho = await MestreSas.query()
            .select("uor_pai as uor", "prefixo_pai as prefixo")
            .table("tb_jurisdicoes")
            .where("uor_pai", uor_gerev.uor)
            .first();
        }
      }

      const uor_gerev = uor_trabalho && uor_trabalho.uor;
      const pref_reg = uor_trabalho && uor_trabalho.prefixo;
      const temReg = !_.isNil(uor_gerev) && uor_gerev !== "0000";

      let uor_sup = null;
      let pref_sup = null;
      let temSup = false;

      let uor_dir = null;
      let pref_dir = null;

      if (temReg) {
        uor_super = await MestreSas.query()
          .select("uor_pai as uor", "prefixo_pai as prefixo")
          .table("tb_jurisdicoes")
          .where("uor_filha", uor_gerev)
          .first();

        uor_sup = uor_super && uor_super.uor;
        pref_sup = uor_super && uor_super.prefixo;
        temSup = !_.isNil(pref_sup) && pref_sup !== "0000";

        uor_diretoria = await MestreSas.query()
          .select("uor_pai as uor", "prefixo_pai as prefixo")
          .table("tb_jurisdicoes")
          .where("uor_filha", uor_sup)
          .first();

        uor_dir = uor_diretoria && uor_diretoria.uor;
        pref_dir = uor_diretoria && uor_diretoria.prefixo;
      }

      const prefSubs = Prefixo.query()
        .where("cd_subord", "00")
        .where("dt_encerramento", "9999-12-31")
        .whereNotIn("tip_dep", [Constants.TIP_DEP_SUPER_REGIONAL, Constants.TIP_DEP_SUPER_ESTADUAL]);

      if (isPerfilSuper) {
        prefSubs.where(builder => {
          builder.where('cd_super_juris', pref_sup);
        })
      }

      if (isPerfilSuperAdm) {
        prefSubs.where(builder => {
          builder.whereIn("cd_diretor_juris", [Constants.DIVAR, Constants.DIRAV]);
        })
      }

      const prefixosSubordinadas = await prefSubs.fetch();

      const prefixos = prefixosSubordinadas.toJSON();
      const prefixosTodos = prefixos.map(item => item.prefixo) || [];

      const prefixosSuper = temSup ? prefixos.filter(prefixo => prefixo.cd_super_juris === pref_sup) : [];
      const prefsSuper = temSup ? prefixosSuper.map(item => item.prefixo) : [];

      const prefixosReg = temReg ? prefixos.filter(prefixo => prefixo.cd_gerev_juris === pref_reg) : [];
      const prefsReg = temReg ? prefixosReg.map(item => item.prefixo) : [];

      /**
       * início Realizado
       */

      /**
       * Como calcular as horas utilizadas no mês?
       * *  DB2?
       * *  Base_Horas_Extras?
       */
      const realizadoPrefs = Dipes.query()
        .select('a.codigo as id', 'a.matricula as matricula', 'a.data_jornada as data_jornada')
        .select('a.he_pr_diu as he_diurna', 'a.he_pr_not as he_noturna', 'a.prefixo_localizacao as prefixo')
        .select('m.cd_gerev_juris as gerev', 'm.cd_super_juris as super', 'm.cd_diretor_juris as diretoria')
        .from('arh7966 as a')
        .leftJoin('mst606 as m', 'a.prefixo_localizacao', 'm.prefixo')
        .where('m.cd_subord', '00')
        .where(subQuery => {
          subQuery.whereNot('a.he_pr_diu', '00,0')
            .orWhereNot('a.he_pr_not', '00,0');
        })
        .whereNot('m.cd_gerev_juris', '0000')
        .whereNotIn('m.tip_dep', [
          Constants.TIP_DEP_SUPER_ESTADUAL,
          Constants.TIP_DEP_SUPER_REGIONAL
        ])
        .whereIn('m.tip_dep', [
          Constants.TIP_DEP_AGENCIA,
          Constants.TIP_DEP_PAA,
          Constants.TIP_DEP_ESTILO,
          Constants.TIP_DEP_POSTO,
          Constants.TIP_DEP_ESCRITORIO
        ])
        .where('a.data_jornada', '>=', inicioMes)
        .where('a.data_jornada', '<=', fimMes);

      if (isPerfilSuperAdm)
        realizadoPrefs.whereIn('m.cd_diretor_juris', [Constants.DIVAR, Constants.DIRAV]);

      if (isPerfilSuper) {
        realizadoPrefs.where('m.cd_super_juris', pref_sup);
      }

      if (isPerfilRegional) {
        realizadoPrefs.where('m.cd_gerev_juris', pref_reg);
      }

      let realizado = await realizadoPrefs.fetch();

      const tablRealizado = realizado.toJSON();

      _.isEmpty(tablRealizado) && tablRealizado.push(
          {
            id: 1,
            matricula: "",
            data_jornada: moment(),
            he_diurna: "00,0",
            he_noturna: "00,0",
            prefixo: prefixoSolicitado,
            gerev: pref_reg,
            super: pref_sup,
            diretoria: pref_dir,
          }
        );

      const tabelaRealizado = tablRealizado.map(linha => ({...linha, he_diurna: parseFloat(linha.he_diurna.replace(",", ".")), he_noturna: parseFloat(linha.he_noturna.replace(",", "."))}))
      /**
       *  fim Realizado
       */

      /**
       * início mesAtual, proximoMes e horasAcumuladasTotal
       */
      const bcoHora = await BaseHorasExtras.query()
        .table('app_horas_extras')
        .whereIn('prefixo', prefixos.map(prefixo => prefixo.prefixo))
        .fetch();

      const dadosSubordReg = bcoHora.toJSON();

      /**
       * fim mesAtual, proximoMes e horasAcumuladasTotal
       */

      /**
       *  início Solicitado / Autorizado
       */
      const dadosAppHE = Solicitacoes.query()
        .where(builder => {
          builder.where('data_evento', '>', inicioMes)
            .where('data_evento', '<', fimMes)
        });


      if (isPerfilSuper) {
        prefSubs.where(builder => {
          builder.where('pref_sup', pref_sup);
        })
      }

      const dadosAPP = await dadosAppHE.fetch();

      const solicitFunci = dadosAPP.toJSON();

      _.isEmpty(solicitFunci) && solicitFunci.push({pref_dep: prefixoSolicitado, pref_sup: pref_sup, pref_regional: pref_reg, qtd_horas_sol: 0, qtd_horas_aut: 0})

      /**
       *  fim Solicitado / Autorizado
       */

      // Super Regional
      if (temReg) {
        const dadosSuperReg = {
          prefixos: prefsReg,
          realizado: _.reduce(tabelaRealizado
            .filter(linha => linha.PrefReg === pref_reg)
            .map(linha => ({he_diurna: linha.he_diurna, he_noturna: linha.he_noturna}))
            .reduce((accumulator, item) => {
              Object.keys(item).forEach(key => {
                accumulator[key] = (accumulator[key] || 0) + item[key]});
                return accumulator
            }, {Realizado: 0}), (accumulator, item) => {
              Object.keys(item).forEach(key => {
                accumulator[key] = (accumulator[key] || 0) + item[key]});
                return accumulator;
            }),
          bancoHoras: dadosSubordReg
            .filter(item => prefsReg.includes(item.prefixo))
            .map(item => ({mesAtual: item.mes_0, proximoMes: item.mes_1, saldoTotal: item.total_horas}))
            .reduce((accumulator, item) => {
              Object.keys(item).forEach(key => {
                accumulator[key] = (accumulator[key] || 0) + item[key]});
                return accumulator
          }, {mesAtual: 0, proximoMes: 0, saldoTotal: 0}),
          solicAut: solicitFunci
            .filter(item => item.pref_regional === pref_reg)
            .map(item => ({Solicitado: item.qtd_horas_sol, Autorizado: item.qtd_horas_aut}))
            .reduce((accumulator, item) => {
              Object.keys(item).forEach(key => {
                accumulator[key] = (accumulator[key] || 0) + item[key]});
                return accumulator;
            }, {Solicitado: 0, Autorizado: 0})
        }

        visaoRegional = {
          visao: "Regional",
          NomeVisao: `Regional (${pref_reg})`,
          Realizado: round(dadosSuperReg.realizado),
          Solicitado: dadosSuperReg.solicAut.Solicitado,
          Autorizado: dadosSuperReg.solicAut.Autorizado,
          mesAtual: dadosSuperReg.bancoHoras.mesAtual,
          proximoMes: dadosSuperReg.bancoHoras.proximoMes,
          horasAcumuladasTotal: dadosSuperReg.bancoHoras.saldoTotal
        };

        visoes.push(visaoRegional);
      }

      // Super Estadual
      if (temSup) {
        const dadosSuperEst = {
          prefixos: prefsSuper,
          realizado: _.reduce(tabelaRealizado
            .filter(linha => linha.PrefSup === pref_sup)
            .map(linha => ({he_diurna: linha.he_diurna, he_noturna: linha.he_noturna}))
            .reduce((accumulator, item) => {
              Object.keys(item).forEach(key => {
                accumulator[key] = (accumulator[key] || 0) + item[key]});
                return accumulator;
          }, {Realizado: 0}), (accumulator, item) => {
            Object.keys(item).forEach(key => {
              accumulator[key] = (accumulator[key] || 0) + item[key]});
              return accumulator;
          }),
          bancoHoras: dadosSubordReg
            .filter(item => prefsSuper.includes(item.prefixo))
            .map(item => ({mesAtual: item.mes_0, proximoMes: item.mes_1, saldoTotal: item.total_horas}))
            .reduce((accumulator, item) => {
              Object.keys(item).forEach(key => {
                accumulator[key] = (accumulator[key] || 0) + item[key]});
                return accumulator;
        }, {mesAtual: 0, proximoMes: 0, saldoTotal: 0}),
          solicAut: solicitFunci
            .filter(item => item.pref_sup === pref_sup)
            .map(item => ({Solicitado: item.qtd_horas_sol, Autorizado: item.qtd_horas_aut}))
            .reduce((accumulator, item) => {
              Object.keys(item).forEach(key => {
                accumulator[key] = (accumulator[key] || 0) + item[key]});
                return accumulator;
          }, {Solicitado: 0, Autorizado: 0})
        }

        visaoSuper = {
          visao: "Estadual",
          NomeVisao: `Estadual (${pref_sup})`,
          Realizado: round(dadosSuperEst.realizado),
          Solicitado: dadosSuperEst.solicAut.Solicitado,
          Autorizado: dadosSuperEst.solicAut.Autorizado,
          mesAtual: dadosSuperEst.bancoHoras.mesAtual,
          proximoMes: dadosSuperEst.bancoHoras.proximoMes,
          horasAcumuladasTotal: dadosSuperEst.bancoHoras.saldoTotal
        };

        visoes.push(visaoSuper);
      }

      // SuperAdm
      if (isPerfilSuperAdm) {
        const dadosSuperAdm = {
          prefixos: prefixos,
          realizado: _.reduce(tabelaRealizado
            .map(linha => ({he_diurna: linha.he_diurna, he_noturna: linha.he_noturna}))
            .reduce((accumulator, item) => {
              Object.keys(item).forEach(key => {
                accumulator[key] = (accumulator[key] || 0) + item[key]});
                return accumulator;
            }, {he_diurna: 0, he_noturna: 0}), (accumulator, item) => {
              Object.keys(item).forEach(key => {
                accumulator[key] = (accumulator[key] || 0) + item[key]});
                return accumulator;
            }),
          bancoHoras: dadosSubordReg
            .map(item => ({mesAtual: item.mes_0, proximoMes: item.mes_1, saldoTotal: item.total_horas}))
            .reduce((accumulator, item) => {
              Object.keys(item).forEach(key => {
                accumulator[key] = (accumulator[key] || 0) + item[key]});
                return accumulator;
          }, {mesAtual: 0, proximoMes: 0, saldoTotal: 0}),
          solicAut: solicitFunci
            .map(item => ({Solicitado: item.qtd_horas_sol, Autorizado: item.qtd_horas_aut}))
            .reduce((accumulator, item) => {
              Object.keys(item).forEach(key => {
                accumulator[key] = (accumulator[key] || 0) + item[key]});
                return accumulator;
            }, {Solicitado: 0, Autorizado: 0})
        }

        visaoDir = {
          visao: "DIVAR/DIRAV",
          NomeVisao: "DIVAR/DIRAV",
          Realizado: round(dadosSuperAdm.realizado),
          Solicitado: dadosSuperAdm.solicAut.Solicitado,
          Autorizado: dadosSuperAdm.solicAut.Autorizado,
          mesAtual: dadosSuperAdm.bancoHoras.mesAtual,
          proximoMes: dadosSuperAdm.bancoHoras.proximoMes,
          horasAcumuladasTotal: dadosSuperAdm.bancoHoras.saldoTotal
        }

        visoes.push(visaoDir);
      }
    }

    return [visoes, solictProprioMes, solicitacao];
  } catch (err) {
    throw new exception(err, 404);
  }
}

async function _calculoRegional () {

}

async function _calculoEstadual () {

}

async function _calculoDiretoria () {

}

module.exports = getResumoGeral;