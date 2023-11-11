const isAutorizado = use("App/Commons/HorasExtras/isAutorizado");

const exception = use("App/Exceptions/Handler");

const FERRAMENTA = "Horas Extras";

async function getAcessoTeste(user) {

  try {
    const autorizado = await isAutorizado(user);

    return autorizado ? { ferramenta: FERRAMENTA, permissoes: ['ACESSO_TESTE'] } : null;
  } catch (err) {
    throw new exception(err, 400);
  }

}

module.exports = getAcessoTeste;