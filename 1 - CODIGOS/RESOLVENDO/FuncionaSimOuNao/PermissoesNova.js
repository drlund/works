const obterParametros = () => {
    if (permissao.includes('PARAM_ALCADAS_ADMIN')) {
      // Permissão de administrador, obtém todos os parâmetros
      getParametros(idParametro)
        .then((onRow) => setParametros(onRow))
        .catch(() => 'Falha ao obter parâmetros!');
    } else if (permissao.includes('PARAM_ALCADAS_USUARIO')) {
      // Permissão de usuário, obtém somente os parâmetros relacionados ao prefixo do usuário
      const prefixo = obterPrefixoDoUsuario(authState); // Implemente a função para obter o prefixo do usuário logado
  
      getParametros(idParametro, prefixo)
        .then((onRow) => setParametros(onRow))
        .catch(() => 'Falha ao obter parâmetros!');
    }
  };

  const obterParametros_ = () => {
    if (permissao.includes('PARAM_ALCADAS_ADMIN')) {
      // Permissão de administrador, obtém todos os parâmetros
      getParametros(idParametro)
        .then((onRow) => setParametros(onRow))
        .catch(() => 'Falha ao obter parâmetros!');
    } else if (permissao.includes('PARAM_ALCADAS_USUARIO')) {
      // Permissão de usuário, obtém somente os parâmetros relacionados ao prefixo do usuário
      getParametros(idParametro, prefixoDestinoUsuario)
        .then((onRow) => setParametros(onRow))
        .catch(() => 'Falha ao obter parâmetros!');
    }
  };