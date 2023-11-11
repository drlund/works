"use strict";

const _ = require("lodash");
const moment = require("moment");

const { isFunciIncorporado, isNomeacaoPendente, getDadosComissaoCompleto } =
  use("App/Commons/Arh");

const { arrayToString } = use("App/Commons/ArrayUtils");

const getDestino = use("App/Commons/Designacao/getDestino");
const getOrigem = use("App/Commons/Designacao/getOrigem");

const Funci = use("App/Models/Mysql/Arh/Funci");
const { executeDB2Query } = use("App/Models/DB2/DB2Utils");

const pretifyFunci = use("App/Commons/Arh/pretifyFunci");
const { BD, TIPOS, LISTA_CPA } = use("App/Commons/Designacao/Constants");
const { DATABASE_DATE_INPUT, DATA_REGEX } = use(
  "App/Commons/FlexCriterios/Constants"
);

const { getCursosEtica, getTreinamentosFunci, getCPAFunci } =
  use("App/Commons/Arh");

class Funcis {
  async getMatchedFuncis(filtro) {
    const { funcionario, tipo } = filtro;

    // Verificar prefixos teste
    const funcs = Funci.query()
      .where("matricula", "like", `%${funcionario}%`)
      .orWhere("nome", "like", `%${funcionario}%`)
      .with("nomeGuerra")
      .with("agLocaliz", (query) => query.sb00())
      .with("depLotacao", (query) => query.sb00());

    if (tipo === TIPOS.ADICAO) {
      funcs
        .join(
          "superadm.cargos_e_comissoes",
          "arhfot01.funcao_lotacao",
          "cargos_e_comissoes.cd_funcao"
        )
        .where("cargos_e_comissoes.permiteAdicao", BD.SIM);
    }

    await funcs.fetch();
    const funcis = funcs?.toJSON() ?? null;

    if (funcis === null) return funcis;

    const funcionarios = funcis.toJSON().map((funci) => {
      funci.nomeGuerra = funci.nomeGuerra
        ? funci.nomeGuerra.NOME_GUERRA_215.trim()
        : "";
      const prettyFunci = pretifyFunci(funci);
      return {
        ...prettyFunci,
        prefixoSuper:
          prettyFunci.agenciaLocalizacao === prettyFunci.prefixoLotacao
            ? funci.depLotacao.cd_super_juris
            : funci.agLocaliz.cd_super_juris,
      };
    });

    return funcionarios;
  }

  async getFunciDestino(matricula) {
    const consulta = await Funci.query()
      .with("agLocaliz", (query) => query.sb00())
      .with("prefixoLotacao", (query) => query.sb00())
      .with("codUorLocalizacao")
      .with("codUorLocalizacao2")
      .with("uorTrabalho")
      .with("codUorTrabalho")
      .where("matricula", matricula)
      .first();

    return consulta?.toJSON() ?? null;
  }

  async getDadosOrigem(origem) {
    return await getOrigem(origem);
  }

  async getFunciOrigem(matricula) {
    const consulta = await Funci.query()
      .with("prefixoLotacao", (dbQuery) => {
        dbQuery
          .with("dadosDiretoria", (intQuery) => {
            intQuery.sb00();
          })
          .with("dadosSuper", (intQuery) => {
            intQuery.sb00();
          })
          .with("dadosGerev", (intQuery) => {
            intQuery.sb00();
          })
          .sb00();
      })
      .with("codUorLocalizacao", (dbQuery) => {
        dbQuery
          .with("dadosDiretoria", (intQuery) => {
            intQuery.sb00();
          })
          .with("dadosSuper", (intQuery) => {
            intQuery.sb00();
          })
          .with("dadosGerev", (intQuery) => {
            intQuery.sb00();
          });
      })
      .with("funcaoLotacao")
      .with("ddComissaoFot06")
      .with("ddComissaoFot05")
      .with("gfm")
      .with("uor500g")
      .with("uorLocaliz500g")
      .where("matricula", matricula)
      .first();

    const origem = consulta?.toJSON() ?? null;

    if (!origem) {
      throw new Error("Problema ao receber dados do funcionário");
    }

    origem.treinamentos = await this.getTreinamentosRealizados(matricula);

    return origem;
  }

  async getTreinamentosRealizados(matricula) {
    const treinam = await getTreinamentosFunci(matricula);

    const treinamentos = treinam.map((elem) => parseInt(elem.cod_curso, 10));

    const listaCursosEtica = await getCursosEtica();

    const trilhaEtica = listaCursosEtica.filter(
      (curso) => !treinamentos.includes(parseInt(curso.cd_curso, 10))
    ); //listaCursosEtica.every(i => treinamentos.includes(i));

    const cursosTrilhaEticaNaoRealizados = trilhaEtica
      ? listaCursosEtica
          .filter(
            (curso) => !treinamentos.includes(parseInt(curso.cd_curso, 10))
          )
          .sort(
            (atual, ant) =>
              parseInt(atual.cd_curso, 10) - parseInt(ant.cd_curso, 10)
          )
      : [];

    // const stringCursosTrilhaEticaNaoRealizados = trilhaEtica.length
    //   ? arrayToString(cursosTrilhaEticaNaoRealizados, true)
    //   : '';

    const stringCursosTrilhaEticaNaoRealizados = trilhaEtica.length
      ? arrayToString(
          cursosTrilhaEticaNaoRealizados.map(
            (item2) => `${parseInt(item2.cd_curso)} - ${item2.nm_curso}`
          ),
          true
        )
      : "";

    const cpaFunci = await getCPAFunci(matricula);

    return {
      treinamentos,
      trilhaEtica,
      cpaFunci,
      cursosTrilhaEticaNaoRealizados,
      stringCursosTrilhaEticaNaoRealizados,
    };
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
                 AND T1.DT_FIM_AUSC >= '${moment()
                   .startOf("day")
                   .format(DATABASE_DATE_INPUT)}'
                 AND T1.DT_FIM_AUSC < '${moment()
                   .startOf("day")
                   .add(90, "day")
                   .format(DATABASE_DATE_INPUT)}'
                 AND T1.CD_EST_PLNJ IN (1, 2, 3)
                 ORDER BY t1.CD_MTC_FUN,
                          t1.NR_SEQL_PLNJ_FUN DESC;`;

    const dados = await executeDB2Query(query);
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

  impedimentoInstRel(dtImpedInstRel) {
    const dataImpedimento = dtImpedInstRel.match(DATA_REGEX);
    if (["", null, undefined].includes(dataImpedimento)) {
      return {
        relac: false,
        instit: false,
      };
    }

    const dataLimiteRel = moment(dataImpedimento[0], "DD/MM/YYYY").subtract(
      1,
      "year"
    );

    return {
      institucional: dataLimiteRel
        .startOf("day")
        .isSameOrAfter(moment().startOf("day")),
      relacionamento: true,
    };
  }
}

module.exports = Funcis;
