const exception = use("App/Exceptions/Handler");

const designacao = use("App/Commons/Designacao/getAcessoTeste");
const horasExtras = use("App/Commons/HorasExtras/getAcessoTeste");
const tarifas = use("App/Commons/Tarifas/getAcessoExtra");
const encantar = use("App/Commons/Encantar/getAcessoExtra");
const flexCriterios = use("App/Commons/FlexCriterios/getAcessoExtra");

const LISTA_FERRAMENTAS_ACESSO_EXTRA = {
  designacao: {
    nome: "DESIGNAÇÂO INTERINA",
    metodo: designacao,
  },
  horasExtras: {
    nome: "HORAS EXTRAS",
    metodo: horasExtras,
  },
  tarifas: {
    nome: "TARIFAS",
    metodo: tarifas,
  },
  encantar: {
    nome: "ENCANTAR",
    metodo: encantar,
  },
  flexCriterios: {
    nome: "Flex Critérios",
    metodo: flexCriterios,
  }
};

async function getAcessosExtras (usuario) {
  try {
    const acesso = [];

    for (const ferramenta in LISTA_FERRAMENTAS_ACESSO_EXTRA) {
      const acessoFerramenta = await LISTA_FERRAMENTAS_ACESSO_EXTRA[ferramenta].metodo(usuario);
      if (acessoFerramenta) acesso.push(acessoFerramenta);
    }

    return acesso;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getAcessosExtras;
