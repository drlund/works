const hasPermission = use("App/Commons/HasPermission");

async function checkAcessosMovimentacao(dadosUsuario, acesso) {
  return acesso.some((acessoUnico) =>
    hasPermission({
      nomeFerramenta: "Movimentações",
      dadosUsuario,
      permissoesRequeridas: [acessoUnico],
    })
  );
}

module.exports = checkAcessosMovimentacao;
