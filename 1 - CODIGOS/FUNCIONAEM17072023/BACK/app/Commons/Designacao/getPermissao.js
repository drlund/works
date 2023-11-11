const exception = use('App/Exceptions/Handler');
const hasPermission = use('App/Commons/HasPermission');

async function getPermissao(dadosUsuario, nomeFerramenta, permissoesRequeridas) {

  try {
    const registro = await hasPermission({
      nomeFerramenta,
      dadosUsuario,
      permissoesRequeridas
    });

    return registro;
  } catch (error) {
    throw new exception(`Não foi possível recuperar as permissões da ferramenta ${nomeFerramenta}!`, 400);
  }
}

module.exports = getPermissao;