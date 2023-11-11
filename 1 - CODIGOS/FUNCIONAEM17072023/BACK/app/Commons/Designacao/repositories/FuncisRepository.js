"use strict";

const _ = require('lodash');
const moment = require('moment');
const { isFunciIncorporado, isNomeacaoPendente, getDadosComissaoCompleto } = require('../../Arh');

const { arrayToString } = require('../../ArrayUtils');
const { DATABASE_DATE_INPUT } = require('../Constants');
const pretifyFunci = require('../../Arh/pretifyFunci');

const getDestino = require("../getDestino");
const getOrigem = require("../getOrigem");

const funciModel = use('App/Models/Mysql/Funci');
const Funci = use('App/Models/Mysql/Arh/Funci');
const Superadm = use("App/Models/Mysql/Superadm");
const { executeDB2Query } = use("App/Models/DB2/DB2Utils");

const { BD, TIPOS, LISTA_CPA } = use("App/Commons/Designacao/Constants");

const { getCursosEtica, getTreinamentosFunci, getCPAFunci } = use("App/Commons/Arh");

class FuncisRepository {
  async getMatchedFuncis(filtro) {
    const { funcionario, tipo } = filtro;

    // Verificar prefixos teste
    const funcs = Funci.query()
      .where("matricula", 'like', `%${funcionario}%`)
      .orWhere("nome", 'like', `%${funcionario}%`)
      .with("nomeGuerra")
      .with("agLocaliz", (query) => query.sb00())
      .with("depLotacao", (query) => query.sb00());

    if (tipo === TIPOS.ADICAO) {
      funcs
        .join('superadm.cargos_e_comissoes', 'arhfot01.funcao_lotacao', 'cargos_e_comissoes.cd_funcao')
        .where('cargos_e_comissoes.permiteAdicao', BD.SIM);
    }

    const funcis = await funcs.fetch();

    const funcionarios = funcis.toJSON().map((funci) => {
      const prettyFunci = pretifyFunci(funci, { editNomeGuerra: "" });
      return {
        ...prettyFunci,
        prefixoSuper: prettyFunci.agenciaLocalizacao === prettyFunci.prefixoLotacao
          ? funci.depLotacao.cd_super_juris
          : funci.agLocaliz.cd_super_juris
      }
    });

    return funcionarios;
  }

  async getFunciDestino(matricula) {
    const funci = await Funci.query()
      .with("agLocaliz", (query) => query.sb00())
      .with("prefixoLotacao", (query) => query.sb00())
      .with("codUorLocalizacao")
      .with("codUorLocalizacao2")
      .with("uorTrabalho")
      .with("codUorTrabalho")
      .where('matricula', matricula)
      .first();

    return funci.toJSON();
  }

  async getDadosOrigem(origem) {
    return await getOrigem(origem);
  }

  async getDadosDestino(destino) {
    return await getDestino(destino);
  }

  async getCPAFuncao(funcao, cd_diretor_juris) {
    cd_diretor_juris = cd_diretor_juris + '';
    const cpa = await Superadm.query()
      .distinct()
      .from('app_designacao_publico_alvo_certif_pref')
      .where('cod_comissao', funcao)
      .whereIn("prefixo", [cd_diretor_juris, '0000'])
      .fetch();

    const cpaLista = cpa.toJSON();

    let cpaListaFinal = cpaLista.map(elem => parseInt(elem.cod_cert_arh, 10));

    let cpaExig = cpaLista.filter(elem => elem.prefixo !== '0000');

    if (_.isEmpty(cpaExig)) {
      cpaExig = [...new Set(cpaLista)];
    } else {
      const listaCpa = Object.keys(LISTA_CPA).map(cpa => parseInt(cpa));
      cpaListaFinal = cpaExig.map(elem => (
        listaCpa.includes(parseInt(elem.cod_cert_arh)) ? LISTA_CPA[parseInt(elem.cod_cert_arh)] : ""));
    }

    return { cpa: cpaExig, cpaLista: cpaListaFinal };
  }

  async getFunciOrigem(matricula) {
    const origem = await Funci.query()
      .with('prefixoLotacao', (dbQuery) => {
        dbQuery
          .with('dadosDiretoria')
          .with('dadosSuper')
          .with('dadosGerev')
          .sb00()
      })
      .with('codUorLocalizacao', (dbQuery) => {
        dbQuery
          .with('dadosDiretoria')
          .with('dadosSuper')
          .with('dadosGerev')
      })
      .with('funcaoLotacao')
      .with('ddComissaoFot06')
      .with('ddComissaoFot05')
      .with('gfm')
      .where('matricula', matricula)
      .first();

    return origem.toJSON();
  }



  async getTreinamentosRealizados(matricula) {
    const treinam = await getTreinamentosFunci(matricula);

    const treinamentos = treinam.map(elem => parseInt(elem.cod_curso, 10));

    const listaCursosEtica = await getCursosEtica();

    const etica = listaCursosEtica.map(elem => parseInt(elem.cd_curso, 10));

    const trilhaEtica = listaCursosEtica.filter((curso) => !treinamentos.includes(parseInt(curso.cd_curso, 10))); //listaCursosEtica.every(i => treinamentos.includes(i));

    const cursosTrilhaEticaNaoRealizados = trilhaEtica ? (listaCursosEtica.filter((curso) => !treinamentos.includes(parseInt(curso.cd_curso, 10)))).sort((atual, ant) => parseInt(atual.cd_curso, 10) - parseInt(ant.cd_curso, 10)) : [];

    // const stringCursosTrilhaEticaNaoRealizados = trilhaEtica.length
    //   ? arrayToString(cursosTrilhaEticaNaoRealizados, true)
    //   : '';

    const stringCursosTrilhaEticaNaoRealizados = trilhaEtica.length
      ? arrayToString(cursosTrilhaEticaNaoRealizados.map((item2) => `${parseInt(item2.cd_curso)} - ${item2.nm_curso}`), true)
      : '';

    const cpaFunci = await getCPAFunci(matricula);

    return ({ treinamentos, trilhaEtica, cpaFunci, cursosTrilhaEticaNaoRealizados, stringCursosTrilhaEticaNaoRealizados });

  }

  async getAusenciasProgramadas(matricula) {
    let query = `SELECT t1.CD_MTC_FUN as matricula,
                   t1.NR_SEQL_PLNJ_FUN as seq_planej,
                   t1.DT_INC_AUSC as inicio_aus,
                   t1.DT_FIM_AUSC as fim_aus,
                   t1.CD_TIP_EST_FUNL as cod_motivo_ausencia,
                   TRIM(T2.NM_TIP_EST_FUNL) as motivo_ausencia,
                   t1.CD_EST_PLNJ as cod_estado_planej,
                   (CASE
                     WHEN T1.CD_EST_PLNJ = '1' THEN 'REGISTRADO'
                     WHEN T1.CD_EST_PLNJ = '2' THEN 'DESPACHADO'
                     WHEN T1.CD_EST_PLNJ = '3' THEN 'PROCESSADO'
                     WHEN T1.CD_EST_PLNJ = '4' THEN 'UTILIZADO'
                     ELSE 'NAO IDENTIFICADO'
                   END) AS ESTADO_PLANEJ,
                   (CASE
                     WHEN T1.CD_EST_PLNJ IN ('2', '3') THEN '#1890FF'
                     ELSE '#CCCCCC'
                   END) AS BG_COR,
                   t1.CD_UOR_DEPE_FUN as uor_funci,
                   t1.CD_UOR_TRB as uor_trab_funci
                 FROM DB2ARH.PLNJ_AUSC t1
                 LEFT JOIN DB2ARH.TIP_EST_FUNL T2
                   ON T1.CD_TIP_EST_FUNL = T2.CD_TIP_EST_FUNL
                 WHERE t1.CD_MTC_FUN = ${matricula}
                 AND T1.DT_FIM_AUSC >= '${moment().startOf('day').format(DATABASE_DATE_INPUT)}'
                 AND T1.DT_FIM_AUSC < '${moment().startOf('day').add(90, 'day').format(DATABASE_DATE_INPUT)}'
                 AND T1.CD_EST_PLNJ IN (1, 2, 3)
                 ORDER BY t1.CD_MTC_FUN,
                          t1.NR_SEQL_PLNJ_FUN DESC;`;

    let dados = await executeDB2Query(query);
    if (dados.length === 0) {
      return [];
    }
    return dados;
  }

  async ehFunciIncorporado(matricula) {
    const consulta = await isFunciIncorporado(matricula);
    return consulta;
  }

  async ehNomeacaoPendente(matricula) {
    const consulta = await isNomeacaoPendente(matricula);
    return consulta;
  }

  async obterDadosComissaoCompleto(cod_comissao) {
    const consulta = await getDadosComissaoCompleto(cod_comissao);
    return consulta;
  }
}

module.exports = FuncisRepository;
