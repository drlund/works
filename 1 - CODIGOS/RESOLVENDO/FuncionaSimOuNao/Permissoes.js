const onGetDadosQuoruns = async () => {
    const { quorum } = await getDadosQuorumMeuPrefixo();
    if (quorum) {
      setMeuQuorum(quorum);
      setPrefixoNaLista(true);
    } else {
      setMeuQuorum(0);
    }
    if (permissao.includes('ADM_QUORUM_QUALQUER')) {
      const quors = await getDadosTodosQuoruns();
      setQuoruns(quors);
    }
  };