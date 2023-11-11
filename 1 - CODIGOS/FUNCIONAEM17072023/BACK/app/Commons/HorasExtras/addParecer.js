const moment = require("moment");
const _ = require("lodash");

const exception = use("App/Exceptions/Handler");
const Solicitacoes = use("App/Models/Mysql/HorasExtras/Solicitacoes");

const isSuper = use("App/Commons/HorasExtras/isSuper");
const Constants = use("App/Commons/HorasExtras/Constants");
const getDadosSolicitacao = use("App/Commons/HorasExtras/getDadosSolicitacao");
const podeRealizarDespacho = use("App/Commons/HorasExtras/podeRealizarDespacho");
const isPrefixoSuperAdm = use("App/Commons/HorasExtras/isPrefixoSuperAdm");
const getResumo = use("App/Commons/HorasExtras/getResumo");

const getDotacaoDependencia = use("App/Commons/Designacao/getDotacaoDependencia");

async function addParecer (user, post, trx = null) {
  try {

    let despacho = {};

    const dados_sol = await getDadosSolicitacao(user, post.id, post.protocolo);

    const SuperNeg = await isSuper('regional', user) || await isSuper('estadual', user);
    const SuperAdm = await isPrefixoSuperAdm(user.prefixo);

    const podeDespachar = await podeRealizarDespacho(user, dados_sol.pref_sup);
    if (!podeDespachar) {
        return false;
    }

    if (SuperNeg) {
      despacho = {
        ...despacho,
        parecer_1_desp: post.parecer,
        status: post.parecer === "DE ACORDO" ? Constants.AGUARDANDO_SUPER_ADM : Constants.INDEFERIDO,
        data_1_desp: moment().format(Constants.DATABASE_DATETIME_INPUT),
        mat_aut_1_desp: user.chave,
        nome_aut_1_desp: user.nome_usuario.toUpperCase(),
        comissao_aut_1_desp: user.cod_funcao,
        justif_1_desp: post.justificativa.toUpperCase(),
        qtd_hrs_aut_1_desp: post.qtdHorasAut
      }
    }

    if (SuperAdm) {
      despacho = {
        ...despacho,
        parecer_2_desp: post.parecer,
        status: post.parecer === "AUTORIZADO" ? Constants.AUTORIZADO : Constants.INDEFERIDO,
        data_2_desp: moment().format(Constants.DATABASE_DATETIME_INPUT),
        mat_aut_2_desp: user.chave,
        nome_aut_2_desp: user.nome_usuario.toUpperCase(),
        comissao_aut_2_desp: user.cod_funcao,
        justif_2_desp: post.justificativa.toUpperCase(),
        qtd_horas_aut: post.qtdHorasAut,
      }
    }

    if (_.isNil(dados_sol.foto_dotacao) && _.isNil(dados_sol.foto_resumo_geral) && [Constants.INDEFERIDO, Constants.AGUARDANDO_SUPER_ADM].includes(despacho.status)) {

      const dotacao = await getDotacaoDependencia(dados_sol.pref_dep, false, false);

      despacho = {
        ...despacho,
        foto_resumo_geral: JSON.stringify(post.fotoResumoGeral),
        foto_dotacao: JSON.stringify(dotacao)
      }
    }

    const adicionar = await Solicitacoes.query(trx)
      .where('id', post.id)
      .update(despacho);

    return !!adicionar;
  } catch (err) {
    throw new exception(err,400);
  }
}

module.exports = addParecer;