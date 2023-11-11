const exception = use("App/Exceptions/Handler");
const _ = require("lodash");
const isSuper = require("./isSuper");
const { isPrefixoUT } = use("App/Commons/Arh");
const Superadm = use("App/Models/Mysql/Superadm");
const Prefixo = use("App/Models/Mysql/Arh/Prefixo");
const MestreSas = use("App/Models/Mysql/MestreSas");
const Dipes = use("App/Models/Mysql/Dipes");
const isPrefixoSuperAdm = use("App/Commons/HorasExtras/isPrefixoSuperAdm");

/**
 *
 * @param {*} usuario
 * @returns [prefixosRegionais]
 *
 * Função que verifica as regionais por funcionário
 */

async function obterRegionais(usuario) {
  try {
    const regionais = [];

    const prefUT = await isPrefixoUT(usuario.prefixo);
    const superAdm = await isPrefixoSuperAdm(usuario.prefixo);

    if (!prefUT) return regionais;

    let uorGerev = await MestreSas.query()
      .table("vinculo_gerev")
      .whereIn("uor_trabalho", [usuario.uor, usuario.uor_trabalho])
      .first();

    if (uorGerev) {
      const consultaGerevMst = await Prefixo.query()
        .where('prefixo', uorGerev.prefixo_gerev)
        .where('cd_subord', '00')
        .first();

      regionais.push({nome: consultaGerevMst.nome, prefixo: consultaGerevMst.prefixo, selected: true});
    }

    if (!uorGerev) {
      regionais.push({nome: 'TODAS AS REGIONAIS', prefixo: '0000', selected: true});
    }

    const prefsRegs = Prefixo.query()
      .select("nome", "prefixo")
      .where('cd_subord', '00')
      .where('tip_dep', 3);

    if (!superAdm)
      prefsRegs.where('cd_super_juris', usuario.pref_super);

    const comerciais = await prefsRegs.fetch();

    const gerevs = comerciais.toJSON();

    regionais.push(...gerevs.map(pref => ({nome: pref.nome, prefixo: pref.prefixo, selected: false})));

    return regionais;
  } catch (err) {
    throw new exception(err, 404);
  }
}

module.exports = obterRegionais;
