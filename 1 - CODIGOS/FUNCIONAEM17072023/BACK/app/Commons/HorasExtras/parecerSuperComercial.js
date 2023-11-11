const exception = use('App/Exceptions/Handler');
const moment = require("moment");
const Constants = use("App/Commons/HorasExtras/Constants");
const getResumo = use("App/Commons/HorasExtras/getResumo");
const { getDotacaoDependencia } = use("App/Commons/Designacao");


async function parecerSuperComercial (post, user, dadosSol) {
  try {
    const despacho = {};

    despacho.parecer_1_desp = post.parecer;
    despacho.status = post.parecer === "DE ACORDO" ? Constants.AGUARDANDO_SUPER_ADM : Constants.INDEFERIDO;
    despacho.data_1_desp = moment().format(Constants.DATABASE_DATETIME_INPUT);
    despacho.mat_aut_1_desp = user.chave;
    despacho.nome_aut_1_desp = user.nome_usuario.toUpperCase();
    despacho.comissao_aut_1_desp = user.cod_funcao;
    despacho.justif_1_desp	= post.justif_parecer;

    const resumo = await getResumo(user, dadosSol.mat_dest, idSol, dadosSol.pref_dep);
    despacho.foto_resumo_geral = JSON.stringify(resumo.visoes);

    const foto_dotacao = await getDotacaoDependencia(dadosSol.pref_dep, false, false);
    despacho.foto_dotacao = JSON.stringify(foto_dotacao.dotacao);

    return despacho
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = parecerSuperComercial;