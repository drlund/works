// Atual:
useEffect(() => {
    if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
      setFetching(true);
      Promise.all([obterSuspensoes(), getSuspensoes(id)])
        .then(([obterResultado, getSuspensoesResultado]) => {
          setSuspensoes(Object.values(getSuspensoesResultado));
        })
        .catch(() => 'Erro ao obter suspensões!')
        .finally(() => {
          setFetching(false);
        });
    }
  }, []);

  const obterSuspensoes = () => {
    if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
      return getSuspensoes(id)
        .then((getSuspensoesResultado) => 
           Object.values(getSuspensoesResultado)
        )
        .catch(() => 'Falha ao obter parâmetros!');
    }
    return(getSuspensoes(id))
  };

  // Anterior:

  useEffect(() => {
    if (
      permissao.includes('PARAM_SUSPENSOES_USUARIO') 
    ) {
      setFetching(true);
      Promise.all([obterSuspensoes(), getSuspensoes(id)])
        .catch(() => 'Erro ao obter suspensões!')
        .finally(() => {
          setFetching(false);
        });
    }
  }, []);

  const obterSuspensoes = () => {
    if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
      return getSuspensoes(id)
        .then((onRow) => setSuspensoes(onRow))
        .catch(() => 'Falha ao obter parâmetros!');
    }
    return(getSuspensoes)
  };
