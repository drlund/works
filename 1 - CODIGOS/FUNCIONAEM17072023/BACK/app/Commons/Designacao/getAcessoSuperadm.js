const exception = use("App/Exceptions/Handler");
const Superadm = use("App/Models/Mysql/Superadm");
const Funci = use("App/Models/Mysql/Arh/Funci");
const _ = require("lodash");
const { UOR_STRING_VIVAR, TIPOS_ACESSO } = require("./Constants");
const getPermissao = require("./getPermissao");

async function getAcessoSuperadm(user) {
  try {
    const registro = await getPermissao(user, "Designação Interina", [
      TIPOS_ACESSO.REGISTRO,
    ]);

    if (registro) {
      return UOR_STRING_VIVAR;
    }

    let funci = await Funci.findBy("matricula", user.chave);

    funci = funci.toJSON();

    let supers = await Superadm.query()
      .table("app_designacao_plat_super")
      .where("uor_plat", funci.uor_trabalho)
      .first();

    if (!supers) {
      return funci.cod_uor_localizacao;
    }

    supers = supers.toJSON();

    return String(supers.uor_super).padStart(9, "0");
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getAcessoSuperadm;
