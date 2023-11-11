/**
 * Neste código, as chamadas de `getTipoSuspensao` e `getTiposJurisdicoes` são feitas diretamente no bloco `try` 
 * do `useEffect`, sem a necessidade de uma função `fetchTiposSuspensao`.
 * 
 * Chamar as funções diretamente no bloco `try/catch` sem criar uma função separada. Aqui está a refatoração com 
 * essa abordagem:
 */

useEffect(() => {
  try {
    (async () => {
      const dados = await getTipoSuspensao();
      const dadosJurisdicoes = await getTiposJurisdicoes();

      setTiposSuspensao(dados);
      setDadosJurisdicoes(dadosJurisdicoes);
    })();
  } catch (error) {
    message.error('Erro ao buscar os tipos de suspensão:', error);
  }
}, []);
