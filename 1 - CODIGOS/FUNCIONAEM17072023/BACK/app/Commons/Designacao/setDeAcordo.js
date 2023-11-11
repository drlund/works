const exception = use("App/Exceptions/Handler");
const TipoHistorico = use("App/Models/Mysql/Designacao/TipoHistorico");
const Analise = use("App/Models/Mysql/Designacao/Analise");
const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");
const { isAdmin } = use("App/Commons/Arh");
const _ = require("lodash");
const moment = require("moment");
const setDocumento = use("./setDocumento");
const getAnalise = use("./getAnalise");
const validarDeAcordo = use("./validarDeAcordo");
const getActualFunciProfile = use(
  "App/Commons/Designacao/getActualFunciProfile"
);

async function setDeAcordo(id_solicitacao, user, tipo = null, texto = ' ') {
  try {
    let solicitacao = await Solicitacao.query()
      .with("prefixo_orig")
      .with("prefixo_dest")
      .with("analise")
      .where("id", id_solicitacao)
      .first();

    solicitacao = solicitacao.toJSON();

    let perfil = await getActualFunciProfile(solicitacao, user);

    let analise = await Analise.findBy("id_solicitacao", id_solicitacao);

    if (!analise) {
      throw new exception(
        "Dados da análise da solicitação não encontrados.",
        404
      );
    }
    const tipos = {
      gestorOrigem: ['gg_orig', 'comite_orig'],
      gestorDestino: ['gg_dest', 'comite_dest'],
      gestorOrigemDestino: ['gg_orig', 'gg_dest', 'comite_orig', 'comite_dest'],
      superior: ['comite_diretoria', 'comite_super_destino', 'super_estadual_destino', 'super_regional_destino'],
      superiorOrigem: ['comite_diretoria', 'comite_super_origem', 'super_estadual_origem', 'super_regional_origem', 'gg_orig'],
      superiorDestino: ['comite_diretoria', 'comite_super_destino', 'super_estadual_destino', 'super_regional_destino', 'gg_dest'],
      superiorOrigemDestino: ['comite_diretoria', 'comite_super_origem', 'super_estadual_origem', 'super_regional_origem', 'gg_orig', 'comite_super_destino', 'super_estadual_destino', 'super_regional_destino', 'gg_dest']
    };

    if (tipo) {
      perfil = perfil.filter(perf => tipos[tipo].includes(perf.perfil));
    }

    for (const i in perfil) {
      let id_historico, nao;

      switch (perfil[i].perfil) {
        case "gg_orig": case "comite_orig":
          if (!analise.parecer_origem) {
            analise.parecer_origem = 1;
            analise.matr_parecer_origem = user.chave;
            analise.dt_hr_parecer_origem = moment().format(
              "YYYY-MM-DD HH:mm:ss"
            );
            id_historico = 2;
          } else {
            nao = 1;
          }
          break;
        case "gg_dest": case "comite_dest":
          if (!analise.parecer_destino) {
            analise.parecer_destino = 1;
            analise.matr_parecer_destino = user.chave;
            analise.dt_hr_parecer_destino = moment().format(
              "YYYY-MM-DD HH:mm:ss"
            );
            id_historico = 3;
          } else {
            nao = 1;
          }
          break;
        case "comite_super_destino":
          if (!analise.parecer_super_destino) {
            analise.parecer_super_destino = 1;
            analise.matr_parecer_super_destino = user.chave;
            analise.dt_hr_parecer_super_destino = moment().format(
              "YYYY-MM-DD HH:mm:ss"
            );
            id_historico = 33;
          } else {
            nao = 1;
          }
          break;
        case "super_regional_destino":
          if (!analise.parecer_super_destino) {
            analise.parecer_super_destino = 1;
            analise.matr_parecer_super_destino = user.chave;
            analise.dt_hr_parecer_super_destino = moment().format(
              "YYYY-MM-DD HH:mm:ss"
            );
            id_historico = 5;
          } else {
            nao = 1;
          }
          break;
        case "super_estadual_destino":
          if (!analise.parecer_super_destino) {
            analise.parecer_super_destino = 1;
            analise.matr_parecer_super_destino = user.chave;
            analise.dt_hr_parecer_super_destino = moment().format(
              "YYYY-MM-DD HH:mm:ss"
            );
            id_historico = 32;
          } else {
            nao = 1;
          }
          break;
        case "comite_diretoria":
          if (!analise.parecer_diretoria) {
            analise.parecer_diretoria = 1;
            analise.matr_parecer_diretoria = user.chave;
            analise.dt_hr_parecer_diretoria = moment().format(
              "YYYY-MM-DD HH:mm:ss"
            );
            id_historico = 34;
          } else {
            nao = 1;
          }
          break;
        default:
          nao = 1;
          break;
      }

      if (nao) {
        continue;
      }

      await analise.save();

      let situacoes = await TipoHistorico.query()
        .where("id", id_historico)
        .first();

      if (!situacoes) {
        throw new exception(
          "Dados da situação solicitada não encontrados.",
          404
        );
      }

      situacoes = situacoes.toJSON();

      await setDocumento(
        {
          id_solicitacao: id_solicitacao,
          id_historico: id_historico,
          texto: texto || ' ',
          id_negativa: null,
          tipo: null,
        },
        null,
        user
      );
    }

    //validar se todos os de acordo foram gravados
    const deAcordoValidado = await validarDeAcordo(id_solicitacao, user);

    return deAcordoValidado;
  } catch (error) {
    throw new exception(
      "Problemas na gravação da assinatura do De Acordo.",
      400
    );
  }
}

module.exports = setDeAcordo;
