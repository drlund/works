const exception = use("App/Exceptions/Handler");
const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");
const _ = require("lodash");
const getPerfilFunciSolicitacao = use("./getPerfilFunciSolicitacao");
const getMainEmail = use("App/Commons/Designacao/getMainEmail");
const getPrefixoMadrinha = use("App/Commons/Designacao/getPrefixoMadrinha");
const getPerfilFunci = use("App/Commons/Designacao/getPerfilFunci");
const getPerfilAnalise = use("App/Commons/Designacao/getPerfilAnalise");
const { isAdmin, getOneDependencia, getDadosComissaoCompleto, isPrefixoUN } = use(
  "App/Commons/Arh"
);
const Dependencia = use("App/Models/Mysql/Dependencia");

async function getSolicitacao(id, user) {
  try {

    const solicit = await Solicitacao.query()
    .with('prefixo_orig', (builder) => {
      builder
        .with('dadosDiretoria', (build) => {
          build.sb00()
        })
        .with('dadosSuper', (build) => {
          build.sb00()
        })
        .with('dadosGerev', (build) => {
          build.sb00()
        })
        .sb00()
    })
    .with('prefixo_dest', (builder) => {
      builder
        .with('dadosDiretoria', (build) => {
          build.sb00()
        })
        .with('dadosSuper', (build) => {
          build.sb00()
        })
        .with('dadosGerev', (build) => {
          build.sb00()
        })
        .sb00()
    })
      .with("matricula_orig")
      .with("matricula_dest")
      .with("matricula_solicit")
      .with("matricula_resp")
      .with("optBasica")
      .with("situacao")
      .with("status")
      .with("tipoDemanda")
      .with("analise")
      .with("prefixo_encaminhado_para", (builder) => {
        builder
          .with('dadosDiretoria', (build) => {
            build.sb00()
          })
          .with('dadosSuper', (build) => {
            build.sb00()
          })
          .with('dadosGerev', (build) => {
            build.sb00()
          })
          .sb00()
      })
      .with("funcaoOrigem")
      .with("funcaoDestino")
      .with("historico")
      .with("documento")
      .with("mail_log", (builder) => {
        builder.orderBy("id", "desc")
      })
      .where("id", id)
      .first();

    let solicitacao = solicit.toJSON();

    solicitacao.key = solicitacao.id;

    solicitacao.analise.analise = JSON.parse(solicitacao.analise.analise);
    solicitacao.analise.ausencias = JSON.parse(solicitacao.analise.ausencias);
    solicitacao.analise.negativas = JSON.parse(solicitacao.analise.negativas);
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

    /**
     * Cálculo de Situação
     */

    if (solicitacao.id_situacao === 1) {
      solicitacao.pendDeAcordo = false;

      if (!_.isNil(user)) { // && complemento && complemento) {
        solicitacao.analise.perfil = await getPerfilFunciSolicitacao(user, solicitacao);
        solicitacao.analise.perfilAnalise = await getPerfilAnalise(
          solicitacao.id
        );

        solicitacao.analise.perfilDeAcordo = _.isEmpty(solicitacao.analise.perfilAnalise) ? [] : solicitacao.analise.perfilAnalise.filter((perfil) => {
          return solicitacao.analise.perfil.includes(perfil);
        });

        solicitacao.situacaoOrigem = !!solicitacao.analise.parecer_origem
          ? "SIM"
          : "NÃO";
        if (!solicitacao.analise.parecer_origem) {
          if (solicitacao.analise.perfilDeAcordo) {
            solicitacao.analise.perfilDeAcordo.includes("gg_orig") &&
              (solicitacao.pendDeAcordo = true);
          }
        }

        solicitacao.situacaoDestino = !!solicitacao.analise.parecer_destino
          ? "SIM"
          : "NÃO";

        if (!solicitacao.analise.parecer_destino) {
          if (solicitacao.analise.perfilDeAcordo) {
            solicitacao.analise.perfilDeAcordo.includes("gg_dest") &&
              (solicitacao.pendDeAcordo = true);
          }
        }

        if (
          solicitacao.analise.gg_ou_super ||
          solicitacao.analise.deacordo_super_destino ||
          solicitacao.limitrofes
        ) {
          solicitacao.situacaoSuperior = !!solicitacao.analise
            .parecer_super_destino
            ? "SIM"
            : "NÃO";

          if (!solicitacao.analise.parecer_super_destino) {
            if (solicitacao.analise.perfilDeAcordo) {
              solicitacao.analise.perfilDeAcordo.filter((x) =>
                [
                  "super_regional_destino",
                  "super_estadual_destino",
                  "comite_super_destino",
                ].includes(x)
              ).length && (solicitacao.pendDeAcordo = true);
            }
          }
        } else if (solicitacao.super) {
          solicitacao.situacaoSuperior = !!solicitacao.analise
            .parecer_diretoria
            ? "SIM"
            : "NÃO";

          if (!solicitacao.analise.parecer_diretoria) {
            if (solicitacao.analise.perfilDeAcordo) {
              solicitacao.analise.perfilDeAcordo.includes([
                "comite_diretoria",
              ]) && (solicitacao.pendDeAcordo = true);
            }
          }
        } else {
          solicitacao.situacaoSuperior = "Não Obrigatório";
        }
      }
    }

    if (id) {
      const funcao = await getDadosComissaoCompleto(solicitacao.funcao_dest || solicitacao.funcao_orig);

      if (
        solicitacao.tipo === 1 &&
        solicitacao.matr_dest === "F0000000" &&
        !solicitacao.matricula_dest
      ) {
        solicitacao.matricula_dest = {
          nome: "VACÂNCIA",
          desc_cargo: funcao.nome_funcao,
        };
      } else {
        solicitacao.comissao_dest = { ...funcao };
      }

      solicitacao.prefixo_gerev_orig =
        _.isEmpty(solicitacao.prefixo_orig.gerev) ||
        solicitacao.prefixo_orig.gerev === "0000"
          ? {}
          : await getOneDependencia(solicitacao.prefixo_orig.gerev);
      solicitacao.prefixo_super_orig =
        _.isEmpty(solicitacao.prefixo_orig.super) ||
        solicitacao.prefixo_orig.super === "0000"
          ? {}
          : await getOneDependencia(solicitacao.prefixo_orig.super);
      solicitacao.prefixo_gerev_dest =
        _.isEmpty(solicitacao.prefixo_dest.gerev) ||
        solicitacao.prefixo_dest.gerev === "0000"
          ? {}
          : await getOneDependencia(solicitacao.prefixo_dest.gerev);
      solicitacao.prefixo_super_dest =
        _.isEmpty(solicitacao.prefixo_dest.super) ||
        solicitacao.prefixo_dest.super === "0000"
          ? {}
          : await getOneDependencia(solicitacao.prefixo_dest.super);
      solicitacao.prefixo_diretoria_dest =
        _.isEmpty(solicitacao.prefixo_dest.diretoria) ||
        solicitacao.prefixo_dest.diretoria === "0000"
          ? {}
          : await getOneDependencia(solicitacao.prefixo_dest.diretoria);

      solicitacao.prefixo_orig.email = await getMainEmail(
        solicitacao.prefixo_orig.uor_dependencia
      );
      solicitacao.prefixo_dest.email = await getMainEmail(
        solicitacao.prefixo_dest.uor_dependencia
      );
      !_.isEmpty(solicitacao.prefixo_gerev_dest) &&
        (solicitacao.prefixo_gerev_dest.email = await getMainEmail(
          solicitacao.prefixo_gerev_dest.uor
        ));
      !_.isEmpty(solicitacao.prefixo_super_dest) &&
        (solicitacao.prefixo_super_dest.email = await getMainEmail(
          solicitacao.prefixo_super_dest.uor
        ));
      !_.isEmpty(solicitacao.prefixo_encaminhado_para) &&
        (solicitacao.prefixo_encaminhado_para.email = await getMainEmail(
          solicitacao.prefixo_encaminhado_para.uor_dependencia
        ));

      const TIPO_EMAIL = {
        1: {
          tipo: "Solicitação",
        },
        2: {
          tipo: "Movimentação",
        },
        3: {
          tipo: "Conclusão",
        },
        4: {
          tipo: "Assinaturas",
        },
        5: {
          tipo: "Cobrança",
        },
      };

      solicitacao.mailLog = solicitacao.mail_log.map((mail) => {
        mail.tipoEmail = TIPO_EMAIL[mail.tipo_email].tipo;
        const mailArr = mail.campo_para.split(",");

        if (mailArr.length > 1) {
          const ultimo = mailArr.pop();
          mail.emailsEnviados = mailArr
            .toString()
            .replace(/,/g, ", ")
            .concat(` e ${ultimo}`);
        } else {
          mail.emailsEnviados = mailArr.toString();
        }

        return mail;
      });

      solicitacao.paaDest = false;
      solicitacao.paaOrig = false;

      if (solicitacao.prefixo_dest.tip_dep === 15) {
        solicitacao.paaDest = true;
        solicitacao.madrinhaDest = await getPrefixoMadrinha(
          solicitacao.pref_dest
        );
      }

      if (solicitacao.prefixo_orig.tip_dep === 15) {
        solicitacao.paaOrig = true;
        solicitacao.madrinhaOrig = await getPrefixoMadrinha(
          solicitacao.pref_orig
        );
      }
    }

    return solicitacao;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getSolicitacao;
