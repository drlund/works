Parece que o problema está relacionado ao uso de `page` e `pageSize` no `useEffect`, o que faz com que a função `getLogAtualizacoes` traga todos os dados da tabela sempre. Para corrigir isso, você pode manter `page` e `pageSize` como parte das dependências do `useEffect` e fazer uma verificação para evitar que eles sejam modificados quando o botão "Recarregar..." for clicado. Isso garantirá que o comportamento de paginação seja mantido enquanto os novos dados são carregados. Veja como você pode fazer isso:

```javascript
useEffect(() => {
  setIsLoading(true);
  getLogAtualizacoes(id, page, pageSize) // Manter page e pageSize aqui
    .then((data) => {
      if (data.length > 0) {
        setAtualizacoes([...atualizacoes, ...data]);
        setPage(nextPage);
      }
    })
    .catch(() => 'Erro ao obter atualizações!')
    .finally(() => {
      setIsLoading(false);
    });
}, [id, page, pageSize]); // Manter page e pageSize aqui

const carregaMaisDados = () => {
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
```

Dessa forma, o `useEffect` será disparado sempre que `id`, `page` ou `pageSize` forem alterados, garantindo que os dados sejam atualizados corretamente quando o botão "Recarregar..." for clicado, mantendo a funcionalidade de paginação. Certifique-se de manter essas dependências para garantir o comportamento esperado.