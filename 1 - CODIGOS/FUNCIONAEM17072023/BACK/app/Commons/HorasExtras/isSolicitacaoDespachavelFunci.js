const exception = use("App/Exceptions/Handler");
const Solicitacoes = use("App/Models/Mysql/HorasExtras/Solicitacoes");
const Constants = use("App/Commons/HorasExtras/Constants");
const {isPrefixoUT, isAdmin} = use("App/Commons/Arh");
const hasPermission = use("App/Commons/HasPermission");
const isPrefixoSuperAdm = use("App/Commons/HorasExtras/isPrefixoSuperAdm");
const _ = require("lodash");

async function isSolicitacaoDespachavelFunci (user, solicitacao) {
  try {

    if (await isPrefixoUT(user.prefixo)) {

      const estadoFunci = await isPrefixoSuperAdm(user.prefixo) ? Constants.AGUARDANDO_SUPER_ADM : Constants.AGUARDANDO_SUPER_ESTADUAL;
      if (estadoFunci !== solicitacao.status) return false;

      const isFunciAdministrador = await isAdmin(user.chave);

      if (estadoFunci === Constants.AGUARDANDO_SUPER_ESTADUAL) {
        return isFunciAdministrador;
      }

      const autorizado = await hasPermission({
        nomeFerramenta: "Horas Extras",
        dadosUsuario: user,
        permissoesRequeridas: ["ACESSO_SUPERADM"]
      });

      return isFunciAdministrador || autorizado;

    }

    return false;
  } catch (err) {
    throw new exception(err, 404);
  }
}

module.exports = isSolicitacaoDespachavelFunci;