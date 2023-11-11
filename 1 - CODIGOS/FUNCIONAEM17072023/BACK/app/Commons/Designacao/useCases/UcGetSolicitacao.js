const _ = require("lodash");
const moment = require("moment");
const { AbstractUserCase } = require("../../AbstractUserCase");
const { ABAS } = require("../Constants");

const exception = use("App/Exceptions/Handler");

const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");

const { getListaComitesByMatricula } = use("App/Commons/Arh/dadosComites");
const Constants = use("App/Commons/Designacao/Constants");
const getGerevsPlataforma = use("App/Commons/Designacao/getGerevsPlataforma");
const getPerfilAnalise = use("App/Commons/Designacao/getPerfilAnalise");
const getPerfilFunciSolicitacao = use("App/Commons/Designacao/getPerfilFunciSolicitacao");
const { isPrefixoUN, isUsuarioPrefixoGerev } = use("App/Commons/Arh");

const isPrefixoSuperAdm = (prefixo) => {
  return String(prefixo) === Constants.PREFIXO_SUPERADM;
}

class UcGetSolicitacao extends AbstractUserCase {
  async _action({
    id,
    user,
  }) {
    const { solicitacaoRepository } = this.repository;

    const solicitacao = await solicitacaoRepository.getOneSolicitacao(
      id,
      user
    );

    return solicitacao;
  }

  _checks({
    id,
    user,
  }) {
    if (!user) {
      throw {
        message: "Dados do Usuário Logado não recebidos"
      }
    }
    if (!id) {
      throw {
        message: "Id da solicitação não recebida"
      }
    }
  }

  getTipoAcesso(tipoAcesso) {
    const TIPOACESSO = {
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
      }
    };

    return TIPOACESSO[tipoAcesso];
  }
}

module.exports = UcGetSolicitacao;
