const exception = use("App/Exceptions/Handler");
const isPrefixoUT = use('App/Commons/Arh/isPrefixoUT');
const MestreSas = use('App/Models/Mysql/MestreSas');

async function isUsuarioPrefixoGerev (usuario){
  try {
    const prefUT = await isPrefixoUT(usuario.prefixo);

    if (!prefUT) return [false, null];

    let uorGerev = await MestreSas.query()
      .table("vinculo_gerev")
      .whereIn("uor_trabalho", [usuario.uor, usuario.uor_trabalho])
      .first();

    if (!uorGerev) return [false, null];

    return [true, uorGerev.prefixo_gerev];
  } catch (err) {
    throw new exception(err, 400);
  }

}

module.exports = isUsuarioPrefixoGerev;