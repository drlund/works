export function isRevogacaoDeParticular(/** @type {Procuracoes.SolicitacoesLista.Pedido} */ item) {
  return (
    item.procuracao.idCartorio === null
    && isRevogacao(item)
  );
}

/**
 * Revogacao é (ou deveria ser) sempre um pedido a parte
 * então, se tem algum item com revogação, deveria ser um pedido de revogacao
 */
export function isRevogacao(/** @type {Procuracoes.SolicitacoesLista.Pedido} */ item) {
  return item.solicitacaoItems.some((i) => i.revogacao);
}
