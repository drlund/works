const exception = use('App/Exceptions/Handler');
const { isPrefixoUN } = use('App/Commons/Arh');
const hasPermission = use('App/Commons/HasPermission');

async function getTipoAcesso(user) {

  try {
    let tipo;

    switch (user.prefixo) {
      case "9009":
        tipo = "SUPERADM";
        break;
      case "8559":
        tipo = "DIPES";
        break;
      case "8592":
        tipo = "DIVAR";
        break;
      case "9220":
        tipo = "DIRAV";
        break;
      case "8929":
        tipo = "GEPES";
        break;
      default:
        tipo = await isPrefixoUN(user.prefixo) ? "AGENCIAS" : "OUTROS";
        break;
    }

    const temPermissaoRegistro = await hasPermission({
      nomeFerramenta: 'Designação Interina',
      dadosUsuario: user,
      permissoesRequeridas: ['REGISTRO']
    });

    const tipos = [tipo];

    temPermissaoRegistro && tipos.push('REGISTRO');
    return tipos;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getTipoAcesso;