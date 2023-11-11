const isComissaoNivelGerencial = use("App/Commons/Arh/isComissaoNivelGerencial");

const exception = use("App/Exceptions/Handler");

const FERRAMENTA = "Tarifas";

async function getAcessoExtra(user) {

  try {
    const autorizado = await isComissaoNivelGerencial(user.cod_funcao);

    return autorizado ? { ferramenta: FERRAMENTA, permissoes: ['NIVEL_GERENCIAL'] } : null;
  } catch (err) {
    throw new exception(err, 400);
  }

}

module.exports = getAcessoExtra;