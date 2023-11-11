const _ = require("lodash");

const exception = use("App/Exceptions/Handler");

const getSolicitacao = use("App/Commons/Designacao/getSolicitacao");
const getActualFunciProfile = use(
  "App/Commons/Designacao/getActualFunciProfile"
);
const { isPrefixoUN } = use("App/Commons/Arh");
const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");
const { PERFIL, PERFIS_EQUIV } = use("App/Commons/Designacao/Constants");

const SIM = "SIM";
const NAO = "NÃO";

async function getDeAcordo(id_solicitacao, user) {
  /**
   * Ordem de verificação do DeAcordo:
   * + recebe os dados gravados
   * + verifica se a solicitação é para mesmo prefixo
   * + verifica se a função de DESTINO é 1GUN ou SUPER 2GUT ou nenhuma das duas
   *   - se SIM:
   *     > 2GUT: Assinatura da Super deve ser do SUPER Comercial (Única)
   *     > 1GUN: Terceira assinatura deve ser do SUPER Regional ou do Comitê da SUPER Comercial
   *   - se NÃO:
   *     > somente 2 assinaturas são necessárias
   *
   * + verifica as assinaturas existentes
   * + se o usuário logado é um dos intervenientes, verifica se o mesmo assinou o de acordo
   *   - se SIM: apresenta mensagem informando que o mesmo já assinou o termo.
   *   - se NÃO: apresenta a checkbox para a confirmação da assinatura
   * + se o usuário logado não for interveniente, apresenta mensagem dizendo que o mesmo possui
   *   acesso insuficiente para assinar termo digital de De Acordo
   *
   * --- para verificar necessidade de super_estadual_destino, usar analise.deacordo_super_destino
   * --- para verificar se a função de destino é 1GUN ou Super 2GUT, usar analise.gg_ou_super.
   */

  try {
    /**
     * ? OBJETIVO: SE FUNCIONÁRIO LOGADO É INTERVENIENTE, SABER SE ELE ASSINOU O DE ACORDO
     */

    // ler os perfis e passar na lista
    // levar em consideração que o gg pode ser dos dois prefixos
    // passar os perfis no array de perfis

    let solicitacao = await getSolicitacao(id_solicitacao, null, user);

    let perfis = await getActualFunciProfile(solicitacao, user);

    perfis = perfis.filter((elem) => {
      const perfsEqvs = [...PERFIS_EQUIV.GG_ORIG, ...PERFIS_EQUIV.GG_DEST, ...PERFIS_EQUIV.SUPERIOR];
      return perfsEqvs.includes(elem.perfil.toUpperCase());
    })

    let perfil = { perfil: [], assinado: [] };

    let ggOri = false;
    let comOri = false;
    let ggDes = false;
    let comDes = false;
    let supRegOri = false;
    let supRegDes = false;
    let supEstOri = false;
    let supEstDes = false;
    let comSupOri = false;
    let comSupDes = false;
    let comDir = false;

    if (perfis.length) {
      perfis = perfis.filter((acordo) => {
        if (acordo.perfil === PERFIL.GG_ORIG) {
          ggOri = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.COMITE_ORIG) {
          comOri = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.GG_DEST) {
          ggDes = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.COMITE_DEST) {
          comDes = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.SUPER_REGIONAL_DESTINO) {
          supRegDes = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.SUPER_ESTADUAL_DESTINO) {
          supEstDes = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.COMITE_SUPER_DESTINO) {
          comSupDes = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.SUPER_REGIONAL_ORIGEM) {
          supRegOri = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.SUPER_ESTADUAL_ORIGEM) {
          supEstOri = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.COMITE_SUPER_ORIGEM) {
          comSupOri = true;
          return acordo;
        }
        if (acordo.perfil === PERFIL.COMITE_DIRETORIA) {
          comDir = true;
          return acordo;
        }
      });

      if (ggOri || ggDes) {
        if (ggOri && ggDes) {
          perfil.perfil.push("1o. Gestor dos Prefixos de Origem e de Destino");
        } else if (ggOri) {
          perfil.perfil.push("1o. Gestor do Prefixo de Origem");
        } else if (ggDes) {
          perfil.perfil.push("1o. Gestor do Prefixo de Destino");
        }
      }

      if (comOri || comDes) {
        if (comOri && comDes) {
          perfil.perfil.push("Membro do Comitê dos Prefixos de Origem e de Destino");
        } else if (comOri) {
          perfil.perfil.push("Membro do Comitê do Prefixo de Origem");
        } else if (comDes) {
          perfil.perfil.push("Membro do Comitê do Prefixo de Destino");
        }
      }

      if (
        solicitacao.gg_ou_super ||
        solicitacao.limitrofes ||
        solicitacao.super
      ) {
        if (comDir) {
          perfil.perfil.push(
            "Membro do Comitê de Administração da DIVAR/DIRAV Jurisdicionante"
          );
        }

        if (supRegDes || supRegOri) {
          if (supRegDes && supRegOri) {
            perfil.perfil.push(
              "Superintendente Regional dos Prefixos de Origem e Destino"
            );
          } else if (supRegOri) {
            perfil.perfil.push("Superintendente Regional do Prefixo de Origem");
          } else if (supRegDes) {
            perfil.perfil.push(
              "Superintendente Regional do Prefixo de Destino"
            );
          }
        }

        if (supEstDes || supEstOri) {
          if (supEstDes && supEstOri) {
            perfil.perfil.push(
              "Superintendente Estadual/SuperAdm dos Prefixos de Origem e Destino"
            );
          } else if (supEstOri) {
            perfil.perfil.push(
              "Superintendente Estadual/SuperAdm do Prefixo de Origem"
            );
          } else if (supEstDes) {
            perfil.perfil.push(
              "Superintendente Estadual/SuperAdm do Prefixo de Destino"
            );
          }
        }

        if ((comSupDes || comSupOri) && !supEstDes && !supEstOri) {
          if (comSupDes && comSupOri) {
            perfil.perfil.push(
              "Membro do Comitê de Adm da Super. Estadual/SuperAdm dos Prefixos de Origem e Destino"
            );
          } else if (comSupOri) {
            perfil.perfil.push(
              "Membro do Comitê de Adm da Super. Estadual/SuperAdm do Prefixo de Origem"
            );
          } else if (comSupDes) {
            perfil.perfil.push(
              "Membro do Comitê de Adm da Super. Estadual/SuperAdm do Prefixo de Destino"
            );
          }
        }
      }

      if (ggDes || comDes) {
        perfil.situacaoDestino = solicitacao.situacaoDestino === 'SIM' ? true : false;

        if (!ggDes) {
          perfil.situacaoSuperior = ['SIM','NÃO'].includes(solicitacao.situacaoSuperior) ? (solicitacao.situacaoSuperior === 'SIM' ? true : false) : null;
        }
      }

      if (comOri || ggOri) {
        perfil.situacaoOrigem = solicitacao.situacaoOrigem === 'SIM' ? true : false;
      }

      if (comDir) {
        perfil.situacaoDestino = solicitacao.situacaoDestino === 'SIM' ? true : false;
        perfil.situacaoOrigem = solicitacao.situacaoOrigem === 'SIM' ? true : false;
        perfil.situacaoSuperior = ['SIM','NÃO'].includes(solicitacao.situacaoSuperior) ? (solicitacao.situacaoSuperior === 'SIM' ? true : false) : null;
      }

      if (perfil.perfil.length > 1) {
        const ultimo = perfil.perfil.pop();
        perfil.perfil = perfil.perfil
          .toString()
          .replace(/[a-zA-Z]+/g, "$&")
          .replace(/,/g, ", ")
          .concat(` e ${ultimo}`);
      }

      perfil.assinado = perfis
        .map((perfil) => perfil.assinado)
        .reduce((m, v) => m && v);
    } else {
      perfil = {
        perfil: "",
        assinado: false,
      };
    }

    perfil.ggSuper = !!solicitacao.gg_ou_super;
    perfil.limitrofes = !!solicitacao.limitrofes;
    perfil.textoLimitrofes = '';
    if (perfil.limitrofes) {
      perfil.textoLimitrofes = _.head(solicitacao.documento.filter(doc => doc.id_negativa === 1).map(doc => doc.texto));
    }

    perfil.tipo = {
      gestorOrigem: !!ggOri || !!comOri,
      gestorDestino: !!ggDes || !!comDes,
      superiorOrigem: (supRegOri || supEstOri || comSupOri),
      superiorDestino: (supRegDes || supEstDes || comSupDes),
      diretoria: !!comDir
    };

    return perfil;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getDeAcordo;
