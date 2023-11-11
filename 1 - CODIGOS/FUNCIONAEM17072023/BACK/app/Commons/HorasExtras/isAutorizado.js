const exception = use('App/Exceptions/Handler');
const HorasExtras = use("App/Models/Mysql/HorasExtras/HorasExtras");
const {isPrefixoUN, isPrefixoUT} = use("App/Commons/Arh");

async function isAutorizado (usuario) {

  try {
    /** acesso de teste */

    const acessoTeste = HorasExtras.query()
      .distinct("super")
      .table("prefixos_teste");

    if (usuario.pref_regional !== 0) {
      acessoTeste.orWhere("gerev", usuario.pref_regional);
    }

    if (usuario.pref_super !== 0) {
      acessoTeste.orWhere("super", usuario.pref_super);
    }

    const acesso = await acessoTeste.first();

    return !!acesso;

    // linha abaixo para liberar para UN - após período de testes.
    // return await isPrefixoUN(usuario.prefixo) || await isPrefixoUT(usuario.prefixo);
  }catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = isAutorizado;