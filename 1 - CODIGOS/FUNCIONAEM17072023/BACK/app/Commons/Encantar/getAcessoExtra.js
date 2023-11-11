const verificarPermissaoRegistroReacao = use(
  "App/Commons/Encantar/Solicitacoes/verificarPermissaoRegistroReacao"
);
const verificarPermissaoIncluirSolicitacao = use(
  "App/Commons/Encantar/Solicitacoes/verificarPermissaoIncluirSolicitacao"
);

const exception = use("App/Exceptions/Handler");

const FERRAMENTA = "Encantar";
const REACAO = "REACAO";
const INCLUSAO = "INCLUSAO";
const PILOTO = "PILOTO";

async function getAcessoExtra(user) {
  try {
    const permissoes = [];

    (await verificarPermissaoRegistroReacao(user)) && permissoes.push(REACAO);
    (await verificarPermissaoIncluirSolicitacao(user)) &&
      permissoes.push(INCLUSAO);

    return permissoes.length
      ? { ferramenta: FERRAMENTA, permissoes: permissoes }
      : null;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getAcessoExtra;
