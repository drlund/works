O código que você compartilhou mostra que há duplicação de código entre a função `carregarMaisDados` e o `useEffect`. Essa duplicação está causando o comportamento indesejado de adicionar duas páginas idênticas quando o botão "Carregar Mais!" é clicado.

Para resolver esse problema, você deve manter a lógica de carregar mais dados em apenas uma dessas funções e removê-la da outra. Recomendo que você mantenha a lógica na função `carregarMaisDados` e faça as seguintes alterações:

```javascript
const carregarMaisDados = () => {
  setCarregando(true);
  const nextPage = page + 1;
  getLogAtualizacoes(id, nextPage, pageSize)
    .then((data) => {
      if (data.length > 0) {
        setAtualizacoes([...atualizacoes, ...data]);
        setPage(nextPage);
      }
    })
    .catch(() => 'Erro ao obter atualizacoes!')
    .finally(() => {
      setCarregando(false);
    });
};

useEffect(() => {
  setIsLoading(true);
  // Mantenha apenas a chamada que inicializa os dados iniciais
  getLogAtualizacoes(id, page, pageSize)
    .then((data) => {
      setAtualizacoes(data); // Atualize o estado com os dados iniciais
    })
    .catch(() => 'Erro ao obter atualizações!')
    .finally(() => {
      setIsLoading(false);
    });
}, [id, page, pageSize]);
```

Nesse código, movemos a chamada para `getLogAtualizacoes` que inicializa os dados iniciais para o `useEffect`. Dessa forma, quando o componente for montado, ele carregará os dados iniciais. A lógica de carregar mais dados está concentrada na função `carregarMaisDados`, que é chamada quando o botão "Carregar Mais!" é clicado. Essa abordagem deve resolver o problema de duplicação de dados. Certifique-se de remover a lógica duplicada do `useEffect`.