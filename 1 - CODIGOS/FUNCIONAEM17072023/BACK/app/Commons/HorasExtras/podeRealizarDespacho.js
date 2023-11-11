const exception = use('App/Exceptions/Handler');
const _ = require("lodash");
const Constants = use("App/Commons/HorasExtras/Constants");
const {funciPossuiPerfil} = use("App/Commons/ServiceProvider");

async function podeRealizarDespacho (user, prefSuper = '', numDespacho = "1") {
  try{
    if (!["1","2"].includes(numDespacho)) return false;

    if (numDespacho !== '1') return await funciPossuiPerfil(user, Constants.PERFIL_SUPERADM_EXTERNO);

    if (user.prefixo === "9009" || await funciPossuiPerfil(user, Constants.PERFIL_SUPERADM_EXTERNO)) return true;

    if (user.prefixo === prefSuper &&
      (Constants.CARGOS_SUPERINTENDENTES.includes(user.nome_funcao)) ||
      await funciPossuiPerfil(user, Constants.PERFIL_SUBSTITUTO_SUPERINTENDENTE_HORAS_EXTRAS))
      {
        return true;
      }

    return false;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = podeRealizarDespacho;