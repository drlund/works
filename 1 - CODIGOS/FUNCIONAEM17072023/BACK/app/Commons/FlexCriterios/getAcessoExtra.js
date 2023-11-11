const verificarPermissaoSolicitante = use(
  "App/Commons/FlexCriterios/acessos/verificarPermissaoSolicitante"
);
const verificarPermissaoManifestante = use(
  "App/Commons/FlexCriterios/acessos/verificarPermissaoManifestante"
);
const verificarPermissaoAnalista = use(
  "App/Commons/FlexCriterios/acessos/verificarPermissaoAnalista"
);

const verificarPermissaoDespachante = use(
  "App/Commons/FlexCriterios/acessos/verificarPermissaoDespachante"
);
const verificarPermissaoDeferidor = use(
  "App/Commons/FlexCriterios/acessos/verificarPermissaoDeferidor"
);
const verificarPermissaoExecutante = use(
  "App/Commons/FlexCriterios/acessos/verificarPermissaoExecutante"
);
const verificarPermissaoRoot = use(
  "App/Commons/FlexCriterios/acessos/verificarPermissaoRoot"
);
const exception = use("App/Exceptions/Handler");
//Nome ferramenta
const FERRAMENTA = "Flex Critérios";

//Nome acessos
const Solicitante = "SOLICITANTE";
const Manifestante = "MANIFESTANTE";
const Analista = "ANALISTA";
const Despachante = "DESPACHANTE";
const Deferidor = "DEFERIDOR";
const Executante = "EXECUTANTE";
const Root = "ROOT";

async function getAcessoExtra(user) {
  try {
    const permissoes = [];

    (await verificarPermissaoSolicitante(user)) && permissoes.push(Solicitante);
    (await verificarPermissaoManifestante(user)) &&
      permissoes.push(Manifestante);
    (await verificarPermissaoAnalista(user)) && permissoes.push(Analista);
    (await verificarPermissaoDespachante(user)) && permissoes.push(Despachante);
    (await verificarPermissaoDeferidor(user)) && permissoes.push(Deferidor);
    (await verificarPermissaoExecutante(user)) && permissoes.push(Executante);
    (await verificarPermissaoRoot(user)) && permissoes.push(Root);

    return permissoes.length
      ? { ferramenta: FERRAMENTA, permissoes: permissoes }
      : null;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getAcessoExtra;
