const exception = use('App/Exceptions/Handler');
const Superadm = use("App/Models/Mysql/Superadm");
const {isPrefixoUT} = use("App/Commons/Arh");
const isPrefixoSuperAdm = use("App/Commons/HorasExtras/isPrefixoSuperAdm");
const _ = require("lodash");

const isSuperEstadual = async (usuario) => {
  try {
    if (await isPrefixoUT(usuario.prefixo) && !await isPrefixoSuperAdm(usuario.prefixo)) {
      const isEstadual = await Superadm.query()
        .from("cargos_e_comissoes")
        .where("ref_org", "1GUT")
        .where("flag_administrador", 1)
        .where("cod_funcao", usuario.cod_funcao)
        .first();

      return !!isEstadual;
    }

    return false;
  } catch (err) {
    throw new exception(err, 400);
  }
}

const isSuperRegional = async (usuario) => {

  try {
    if (await isPrefixoUT(usuario.prefixo) && !await isPrefixoSuperAdm(usuario.prefixo)) {
      const isRegional = await Superadm.query()
        .from("cargos_e_comissoes")
        .where("ref_org", "2GUT")
        .where("flag_administrador", 1)
        .where("cod_funcao", usuario.cod_funcao)
        .first();

      return !!isRegional;
    }

    return false;
  } catch (err) {
    throw new exception(err, 400);
  }
}

const isSuperAdm = async (usuario) => {

  try {
    if (await isPrefixoUT(usuario.prefixo) && !await isPrefixoSuperAdm(usuario.prefixo)) {
      const isSuperAdm = await Superadm.query()
        .from("cargos_e_comissoes")
        .where("ref_org", "1GUT")
        .where("flag_administrador", 1)
        .where("cod_funcao", usuario.cod_funcao)
        .first();

      return !!isSuperAdm;
    }

    return false;
  } catch (err) {
    throw new exception(err, 400)
  }
}

async function isSuper(tipoSuper = null, usuario) {
  try {
    const tipos = {
      regional: await isSuperRegional(usuario),
      estadual: await isSuperEstadual(usuario),
      superadm: await isSuperAdm(usuario),
    }

    return _.isNil(tipoSuper) ? tipos : tipos[tipoSuper];
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = isSuper;