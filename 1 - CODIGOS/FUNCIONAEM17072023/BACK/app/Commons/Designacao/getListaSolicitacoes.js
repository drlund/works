const _ = require("lodash");
const moment = require("moment");

const exception = use("App/Exceptions/Handler");

const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");

const { getListaComitesByMatricula } = use("App/Commons/Arh/dadosComites");
const getGerevsPlataforma = use("App/Commons/Designacao/getGerevsPlataforma");
const getPerfilAnalise = use("App/Commons/Designacao/getPerfilAnalise");
const Constants = use("App/Commons/Designacao/Constants");
const { isAdmin, getOneDependencia, getDadosComissaoCompleto, isPrefixoUN, isUsuarioPrefixoGerev } = use(
  "App/Commons/Arh"
);

const Dependencia = use("App/Models/Mysql/Dependencia");

const isPrefixoSuperAdm = (prefixo) => {
  return String(prefixo) ===  Constants.PREFIXO_SUPERADM;
}

async function getListaSolicitacoes(
  id = null,
  params = null,
  user = null,
  tipo = null,
  prefixos = null,
  complemento = null
) {
  try {

    const isUN = await isPrefixoUN(user.prefixo);
    const [isGerev] = await isUsuarioPrefixoGerev(user);
    const isSupAdm = isPrefixoSuperAdm(user.prefixo);
    const [isPlataformaSuperAdm, gerevs] = isSupAdm ? await getGerevsPlataforma(user) : [false, null];
    const isDIVAR = user.prefixo === Constants.PREFIXO_DIVAR;
    const isDIRAV = user.prefixo === Constants.PREFIXO_DIRAV;
    const prefs = [user.prefixo, ...prefixos];
    const comitesFuncionarioLogado = complemento && complemento.comiteAdm ? complemento.comiteAdm : await getListaComitesByMatricula(user.chave);

    /** Início das opções de consulta */
    TIPOS_ACESSO = {
      1: (builder) => {
        if (isUN || isGerev || isDIVAR || isDIRAV) {
          builder.where((builderPref) => {
            builderPref //(t1.pref_orig IN ('2636') OR t1.pref_dest IN ('2636'))
              .whereIn("pref_orig", prefs)
              .orWhereIn("pref_dest", prefs);
          })
        }
        builder.where("id_situacao", 1) //AND t1.id_situacao = 1)
          .orderBy("id");
      },
      2: (builder) => {
        builder
          .where((bld1) => {
            if (isSupAdm && !isPlataformaSuperAdm) {
              bld1.where((builderPref2) => {
                builderPref2.whereNot("encaminhado_para", Constants.PREFIXO_SUPERADM);
              });
            }

            if ((isSupAdm && isPlataformaSuperAdm) || isUN || isGerev) {
              bld1.where((builderPref2) => {
                builderPref2.whereNotIn("encaminhado_para", prefs);
              })
                .where((builderPref) => {
                  builderPref //(t1.pref_orig IN ('2636') OR t1.pref_dest IN ('2636'))
                    .whereIn("pref_orig", prefs)
                    .orWhereIn("pref_dest", prefs);
                })
            }
          })
          .whereNotIn("id_situacao", [1, 5, 6]); //AND t1.id_situacao = 1)
      },
      3: (builder) => {
        builder
          .where((bld1) => {
            bld1
              .where((builderPref) => {
                builderPref.whereIn("encaminhado_para", prefs); //t1.encaminhado_para ='2636'
              });
          })
          .whereNotIn("id_situacao", [1, 5, 6]); //AND t1.id_situacao = 1)
      },
      4: (builder) => {
        builder
          .where("responsavel", user.chave)
          .whereNotIn("id_situacao", [1, 5, 6]);
      },
    };

    const consultas = () => {
      if (params.tipoConsulta === 1) {
        if (params.prefixo) {
          solicit.where((builderPref) => {
            builderPref
              .whereIn("pref_orig", [params.prefixo.prefixo])
              .orWhereIn("pref_dest", [params.prefixo.prefixo]);
          });
        }
        if (!params.prefixo) {
          if (!isSupAdm) {

            solicit.where((builderPref) => {
              builderPref
                .whereIn("pref_orig", prefs)
                .orWhereIn("pref_dest", prefs);
            });
          }
        }

        if (params.funcao) {
          solicit.where((builderPref) => {
            builderPref.where("funcao_dest", params.funcao.funcao);
          });
        }

        if (params.funci) {
          solicit.where((builderPref) => {
            builderPref
              .where("matr_orig", params.funci.funci)
              .orWhere("matr_dest", params.funci.funci);
          });
        }

        if (params.tipo) {
          const tipo = params.tipo.map(tip => tip.tipo);
          solicit.where((builderPref) => {
            builderPref.whereIn("tipo", tipo);
          });
        }

        if (params.status) {
          const status = params.status.map(stat => stat.status);
          solicit.where((builderPref) => {
            builderPref.whereIn("id_status", status);
          });
        }

        if (params.situacao) {
          const situacao = params.situacao.map(sit => sit.situacao);
          solicit.where((builderPref) => {
            builderPref.whereIn("id_situacao", situacao);
          });
        }

        if (params.instancia) {
          const instancia = params.instancia.map(inst => inst.instancia);
          solicit
            .with("historico")
            .has("historico", qry => {
              qry.whereIn('id_historico', instancia);
            });
        }

        if (params.periodo) {
          solicit.where((builderPref) => {
            builderPref
              .where("dt_ini", ">=", moment(params.periodo.inicio).format(Constants.DATABASE_DATETIME_INPUT))
              .where("dt_fim", "<=", moment(params.periodo.fim).format(Constants.DATABASE_DATETIME_INPUT));
          });
        }

        if (params.dataSolicitacao) {
          solicit.where((builderPref) => {
            builderPref
              .where("dt_solicitacao", ">=", moment(params.dataSolicitacao.inicio).format(Constants.DATABASE_DATETIME_INPUT))
              .where("dt_solicitacao", "<=", moment(params.dataSolicitacao.fim).format(Constants.DATABASE_DATETIME_INPUT));
          });
        }
      } else {
        if (params.protocolo) {
          solicit.where((builderPref) => {
            builderPref.where("protocolo", params.protocolo.protocolo);
          });
        }
      }
    };

    /** Fim das opções */

    const solicit = Solicitacao.query()
      .with("prefixo_orig")
      .with("prefixo_dest")
      .with("matricula_orig")
      .with("matricula_dest")
      .with("matricula_solicit")
      .with("matricula_resp")
      .with("optBasica")
      .with("situacao")
      .with("status")
      .with("tipoDemanda")
      .with("analise")
      .with("prefixo_encaminhado_para")
      .with("funcaoOrigem")
      .with("funcaoDestino")
      .has("analise")
      .orderBy("dt_solicitacao", "desc");

    if (!_.isNil(tipo) && ["pendentes", "concluidos"].includes(tipo.tipo)) {
      if (!_.isNil(params)) {
        params = Object.entries(params);
        for (const [key, value] of params) {
          if (key === "ids") {
            solicit.whereIn(key, value);
          } else {
            solicit.where(key, value);
          }
        }
      }
      tipo.tipo === "pendentes" && solicit.where(TIPOS_ACESSO[parseInt(tipo.valor)]);
    }

    if (!_.isNil(tipo) && tipo.tipo === "consultas") {
      consultas();
    }

    let solicitacoes = await solicit.fetch();

    solicitacoes = solicitacoes.toJSON();

    if (isPlataformaSuperAdm) {
      solicitacoes = solicitacoes.filter(solicitacao => gerevs.includes(solicitacao.prefixo_orig.cd_gerev_juris) || gerevs.includes(solicitacao.prefixo_dest.cd_gerev_juris));
    }

    solicitacoes = solicitacoes.map(async (solicitacao) => {
      solicitacao.key = solicitacao.id;

      solicitacao.analise.analise = JSON.parse(solicitacao.analise.analise);

      solicitacao.motivos = [];
      if (tipo.tipo === 'concluidos') {
        const ausencias = JSON.parse(solicitacao.analise.ausencias);

        solicitacao.motivos = ausencias.ausencias.map(ausencia => {
          const plural = ausencia.periodo > 1 ? 's' : '';
          return `${ausencia.periodo} dia${plural} por ${ausencia.tipoAusencia}`;
        });
      }

      const perfil = await getPerfilFunciSolicitacao(user, solicitacao, complemento.funciLogado, comitesFuncionarioLogado, complemento.dadosComissaoFunciLogado, complemento.funciIsAdmin);

      const perfilAnalise = await getPerfilAnalise(
        solicitacao.id
      );

      solicitacao.perfilDeAcordo = perfilAnalise.filter(
        (perf) => perfil.includes(perf)
      );

      solicitacao.analise.cadeia = solicitacao.analise.cadeia
        ? JSON.parse(solicitacao.analise.cadeia)
        : [];

      if (solicitacao.id_situacao === 1) {
        solicitacao.situacaoOrigem = !!solicitacao.analise.parecer_origem
          ? "SIM"
          : "NÃO";
        solicitacao.situacaoDestino = !!solicitacao.analise.parecer_destino
          ? "SIM"
          : "NÃO";

        if (
          solicitacao.analise.gg_ou_super ||
          solicitacao.analise.deacordo_super_destino ||
          solicitacao.limitrofes
        ) {
          solicitacao.situacaoSuperior = !!solicitacao.analise
            .parecer_super_destino
            ? "SIM"
            : "NÃO";
        } else if (solicitacao.super) {
          solicitacao.situacaoSuperior = !!solicitacao.analise.parecer_diretoria
            ? "SIM"
            : "NÃO";
        } else {
          solicitacao.situacaoSuperior = "Não Obrigatório";
        }
      }

      const reqs = [
        {
          key: 0,
          corRequisitos: '#CB4335',
          requisitos: 'NÃO',
          textoRequisitos: 'Requisitos NÃO Cumpridos'
        },
        {
          key: 1,
          corRequisitos: '#2ECC71',
          requisitos: 'SIM',
          textoRequisitos: 'Requisitos Cumpridos'
        }
      ];

      const lims = [
        {
          key: 1,
          corLimitrofes: '#CB4335',
          limitrofes: 'NÃO',
          textoLimitrofes: 'Municípios NÃO Limítrofes'
        },
        {
          key: 0,
          corLimitrofes: '#2ECC71',
          limitrofes: 'SIM',
          textoLimitrofes: 'Municípios Limítrofes'
        }
      ];

      ({
        requisitos: solicitacao.requisitos,
        corRequisitos: solicitacao.corRequisitos,
        textoRequisitos: solicitacao.textoRequisitos
      } = _.head(reqs.filter(req => req.key === solicitacao.requisitos)));

      ({
        limitrofes: solicitacao.limitrofes,
        corLimitrofes: solicitacao.corLimitrofes,
        textoLimitrofes: solicitacao.textoLimitrofes
      } = _.head(lims.filter(lim => lim.key === solicitacao.limitrofes)));

      const ausencias = JSON.parse(solicitacao.analise.ausencias);
      solicitacao.priorizado = !_.isEmpty(ausencias) && !_.isEmpty(ausencias.ausencias.filter(ausencia => Constants.CODIGOS_PRIORIZADOS.includes(ausencia.codAusencia)));

      return solicitacao;
    });

    const solicitacoesProcessadas = await Promise.all(solicitacoes);

    return solicitacoesProcessadas;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getListaSolicitacoes;
