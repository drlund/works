"use strict";

const moment = require("moment");
const _ = require("lodash");
const { default: axios } = require("axios");

const { executeDB2Query } = use("App/Models/DB2/DB2Utils");

const { TP_IMPEDIMENTO, LISTA_CPA } = require("../Constants");

const getLatLong = use("App/Commons/Arh/getLatLong");
const getRotaRodoviaria = use("App/Commons/Arh/getRotaRodoviaria");
const getRotaLinear = use("App/Commons/Arh/getRotaLinear");
const limitrofes = use("App/Commons/Mst/limitrofes");

const Superadm = use("App/Models/Mysql/Superadm");
const Funci = use("App/Models/Mysql/Arh/Funci");
const Prefixo = use("App/Models/Mysql/Arh/Prefixo");
const CargosComissoes = use("App/Models/Mysql/Arh/CargosComissoes");
const ComissoesFot05 = use("App/Models/Mysql/Arh/ComissoesFot05");
const ComissoesFot06 = use("App/Models/Mysql/Arh/ComissoesFot06");
const ComissoesFot09 = use("App/Models/Mysql/Arh/ComissoesFot09");

class ArhMst {
  async obterDadosFunci(matricula) {
    const [consulta, qualificacoes] = await Promise.all([
      Funci.query()
        .where("matricula", matricula)
        .with("prefixoLotacao", (intQuery) => {
          intQuery
            .sb00()
            .with("dadosGerev", (int2Query) => {
              int2Query.sb00();
            })
            .with("dadosSuper", (int2Query) => {
              int2Query.sb00();
            })
            .with("dadosDiretoria", (int2Query) => {
              int2Query.sb00();
            })
            .with("dotacao", (int3Query) => {
              int3Query.whereRaw(
                "(qtde_dotacao + qtde_lotacao + qtde_existencia) > ?",
                0
              );
            });
        })
        .with("funcaoLotacao")
        .first(),
      this._obterDadosQualificacaoByFunci(matricula),
    ]);

    const funci = consulta?.toJSON() ?? null;

    if (!funci) return funci;

    funci.qualificacoes = qualificacoes;

    return funci;
  }

  async obterDadosPrefixo(prefixo) {
    const consulta = await Prefixo.query()
      .with("dadosGerev", (intQuery) => {
        intQuery.sb00();
      })
      //ALTERAR AQUI
      .with("dadosSuper", (intQuery) => {
        intQuery.sb00();
      })
      .with("dadosDiretoria", (intQuery) => {
        intQuery.sb00();
      })
      .with("dotacao", (int2Query) => {
        int2Query.whereRaw(
          "(qtde_dotacao + qtde_lotacao + qtde_existencia) > ?",
          0
        );
      })
      .sb00()
      .where("prefixo", prefixo)
      .first();

    return consulta?.toJSON() ?? null;
  }

  async obterDadosFuncao(funcao) {
    const consulta = await ComissoesFot06.query()
      .where("cod_comissao", funcao)
      .first();

    return consulta?.toJSON() ?? null;
  }

  async _obterDadosQualificacaoByFunci(matricula) {
    const chave = parseInt(matricula.replace(/\D/, ""), 10);
    const query = `SELECT
                    t1.NR_MTC_FUN,
                    t1.CD_TIP_CTFC,
                    t1.CD_CNH_CTFC_FUN,
                    t1.DT_CTFC_FUN,
                    t1.CD_OPT_CTFC_FUN,
                    t1.CD_CSO_CTFC_FUN,
                    t1.CD_EST_CTFC,
                    t1.DT_EXPC_CTFC
                  FROM DB2TAO.CTFC_FUN t1

                  WHERE t1.NR_MTC_FUN = ${chave}
                    AND COALESCE(t1.DT_EXPC_CTFC, DATE('0001-01-01')) >= CURRENT_DATE;`;

    const dadosComite = await executeDB2Query(query);

    return dadosComite;
  }

  async obterInabilitadosTCU(cpf) {
    try {
      const consulta = await axios.get(
        `https://contas.tcu.gov.br/ords/condenacao/consulta/inabilitados/${cpf}`
      );

      const resultado = consulta.data?.items ?? [];

      return Boolean(resultado.length)
        ? TP_IMPEDIMENTO.IMPEDIDO
        : TP_IMPEDIMENTO.SEM_IMPEDIMENTO;
    } catch (err) {
      throw new Error("Problema com a API do TCU");
    }
  }

  async obterDadosGeograficos(origem, destino) {
    const [saoLimitrofes, latLongitude] = await Promise.all([
      limitrofes(origem, destino),
      getLatLong(origem, destino),
    ]);

    const rotaRodoviaria = await getRotaRodoviaria(latLongitude);
    const rotaLinear = await getRotaLinear(latLongitude);

    return {
      limitrofes: saoLimitrofes,
      rotaRodoviaria,
      rotaLinear,
    };
  }

  async getDadosPrefixoDestino(prefixo) {
    const consulta = await Prefixo.query()
      .with("dadosSuper", (intQuery) => {
        intQuery.sb00();
      })
      .with("dadosDiretoria", (intQuery) => {
        intQuery.sb00();
      })
      .with("dadosGerev", (intQuery) => {
        intQuery.sb00();
      })
      .with("uor500g")
      .where("prefixo", String(prefixo).padStart(4, "0"))
      .sb00()
      .first();

    const destino = consulta?.toJSON() ?? null;

    if (!destino) {
      throw new Error("Problema ao receber dados do prefixo de destino");
    }

    destino.municipioUf = destino.municipio + "/" + destino.nm_uf;
    destino.cd_municipio_ibge_dv =
      destino.cd_municipio_ibge + destino.dv_municipio_ibge;

    return destino;
  }

  async getDadosFuncaoDestino(funcao, prefixoDiretoria) {
    const consulta = await ComissoesFot05.query()
      .with("fot06")
      .with("gfm")
      .where("cod_comissao", String(funcao).padStart(5, "0"))
      .first();

    const dadosFuncao = consulta?.toJSON() ?? null;

    if (!dadosFuncao) {
      throw new Error("Problema ao receber dados da função de destino");
    }

    const { cpa, cpaLista } = await this.getCPAFuncao(funcao, prefixoDiretoria);

    dadosFuncao.cpa = cpa;
    dadosFuncao.cpaLista = cpaLista;

    return dadosFuncao;
  }

  async getCPAFuncao(funcao, cd_diretor_juris) {
    cd_diretor_juris = (cd_diretor_juris + "").padStart(4, "0");
    const cpa = await Superadm.query()
      .distinct()
      .from("app_designacao_publico_alvo_certif_pref")
      .where("cod_comissao", String(funcao).padStart(5, "0"))
      .whereIn("prefixo", [cd_diretor_juris, "0000"])
      .fetch();

    const cpaLista = cpa.toJSON();

    let cpaListaFinal = cpaLista.map((elem) => parseInt(elem.cod_cert_arh, 10));

    let cpaExig = cpaLista.filter((elem) => elem.prefixo !== "0000");

    if (_.isEmpty(cpaExig)) {
      cpaExig = [...new Set(cpaLista)];
    } else {
      const listaCpa = Object.keys(LISTA_CPA).map((cpa) => parseInt(cpa));
      cpaListaFinal = cpaExig.map((elem) =>
        listaCpa.includes(parseInt(elem.cod_cert_arh))
          ? LISTA_CPA[parseInt(elem.cod_cert_arh)]
          : ""
      );
    }

    return { cpa: cpaExig, cpaLista: cpaListaFinal };
  }

  async getFuncaoAdmDiretoria(prefixo) {
    const consulta = await ComissoesFot09.query()
      .select("cod_cargo")
      .where("cod_dependencia", prefixo)
      .where("qtde_lotacao", ">", 0)
      .fetch();

    const comissoes = consulta?.toJSON() ?? null;
    const comissoesLista = comissoes.map((item) => parseInt(item.cod_cargo));

    const consultaII = await CargosComissoes.query()
      .whereIn("cd_funcao", comissoesLista)
      .where({ flag_administrador: 1 })
      .first();

    const informacao = consultaII?.toJSON() ?? null;

    return {
      funcao: String(informacao.cd_funcao).padStart(5, "0"),
      nomeFuncao: informacao.nome_funcao,
    };
  }
}

module.exports = ArhMst;
