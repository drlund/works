
const exception = use("App/Exceptions/Handler");
const { getOneDependencia, isPrefixoUN, isPrefixoUT, isAdmin } = use("App/Commons/Arh");
const JurisdicoesSubordinadas = use('App/Models/Mysql/JurisdicoesSubordinadas');
const Dipes = use("App/Models/Mysql/Dipes");
const Prefixo = use("App/Models/Mysql/Arh/Prefixo");
const MestreSas = use("App/Models/Mysql/MestreSas");
const _ = require("lodash");
const moment = require("moment");
const getDotacaoDependencia = use("App/Commons/Designacao/getDotacaoDependencia");
const isPrefixoSuperAdm = use("App/Commons/HorasExtras/isPrefixoSuperAdm");
const getDepESubord = use("App/Commons/Designacao/getDepESubord");
const Constants = use("App/Commons/HorasExtras/Constants");

async function getDadosSolicitacaoHE(usuario) {
  try {

    let prefixo = await getOneDependencia(usuario.prefixo);
    const subordinadas = [];
    let dotacao = [];

    const isGGUN = await isPrefixoUN(usuario.prefixo) && await isAdmin(usuario.chave);
    const isFunciUT = await isPrefixoUT(usuario.prefixo);
    const isPrefixoSuperadm = await isPrefixoSuperAdm(usuario.prefixo);

    const podeAcessar = isGGUN || isFunciUT;

    if (!podeAcessar) return {podeAcessar};

    if (isFunciUT && !isPrefixoSuperadm) {

      const uorTrabalhoGerev = await MestreSas.query()
        .table("vinculo_gerev")
        .where("uor_trabalho", usuario.uor_trabalho)
        .first();

      const uor_regional = (!_.isNil(uorTrabalhoGerev) && !_.isEmpty(uorTrabalhoGerev)) ? uorTrabalhoGerev.uor_gerev : null;
      const prefGerev = uor_regional && await Prefixo.query()
        .select("prefixo")
        .where("cd_subord", "00")
        .where("uor_dependencia", uor_regional)
        .first();

      const {prefixo: gerev} = uor_regional && prefGerev.toJSON();

      const subords = Prefixo.query()
        .select("nome", "prefixo")
        .where("cd_subord", "00")
        .where("dt_encerramento", Constants.NAO_ENCERRADA)
        .whereNotIn("tip_dep", [3, 4]);

      if (uor_regional)
        subords.where("cd_gerev_juris", gerev);

      if (!uor_regional)
        subords.where("cd_super_juris", usuario.pref_super);

      const subs = await subords.fetch();

      if (subs) subordinadas.push(...subs.toJSON());

    }

    if (isPrefixoSuperadm) {

      const prefixosSubordinadas = await Prefixo.query()
        .select("nome", "prefixo")
        .where("cd_subord", "00")
        .where("cd_vicepres_juris", Constants.VIVAR)
        .whereNotIn("tip_dep", [Constants.TIP_DEP_SUPER_REGIONAL,Constants.TIP_DEP_SUPER_ESTADUAL])
        .whereNot("cd_gerev_juris", '0000')
        .where("dt_encerramento", Constants.NAO_ENCERRADA)
        .fetch();

      subordinadas.push(...(prefixosSubordinadas.toJSON()));

    }

    if (isGGUN) {
      const deps = await JurisdicoesSubordinadas.query()
        .where("cd_subord_subordinada", "00")
        .where("uor", usuario.uor)
        .fetch();

      const prefixos = (deps.toJSON()).map(prefixo => prefixo.prefixo_subordinada);

      const subs = await Prefixo.query()
        .select("nome", "prefixo")
        .where("cd_subord", "00")
        .whereIn("prefixo", [...prefixos, usuario.prefixo])
        .fetch();

      subordinadas.push(...(subs.toJSON()));

    }
    //subordinadas = await getPrefixosSubord(usuario);

    dotacao = await getDotacaoDependencia(usuario.prefixo, false, false);

    return {
      user: usuario,
      prefixo: prefixo,
      subordinadas: subordinadas,
      dotacao: dotacao,
      podeAcessar: podeAcessar
    };
  } catch (err) {
    throw new exception(err, 404);
  }
}

module.exports = getDadosSolicitacaoHE;
