const getClassificacaoEncantar = async (mci) => {
  const classificacaoCliente = await getClassificacaoCliente(solicitacao.mci);

  const classificacaoEstrelas = await classificacaoEncantarModel
    .query()
    .where("idPerfil", classificacaoCliente)
    .first();

  return classificacaoEstrelas.classificacao;
};