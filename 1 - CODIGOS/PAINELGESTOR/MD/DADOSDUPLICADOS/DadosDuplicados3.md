

O problema de duplicação de dados parece estar relacionado à repetição de código nas duas rotinas, especificamente no código de adição de novos dados ao estado atualizacoes. Para resolver esse problema, você pode criar uma função separada que lide com a lógica de adicionar novos dados ao estado e, em seguida, chamar essa função tanto na função carregarMaisDados quanto no useEffect. Isso ajudará a evitar a duplicação de código e a garantir que os dados sejam tratados de maneira consistente em ambas as partes do código.

Aqui está um exemplo de como você pode criar uma função separada para adicionar novos dados:

```javascript

const adicionarNovosDados = (novosDados) => {
  setAtualizacoes([...atualizacoes, ...novosDados]);
  setPage(page + 1); // Atualize a página aqui, se necessário
};

const carregarMaisDados = () => {
  setCarregando(true);
  const nextPage = page + 1;
  getLogAtualizacoes(id, nextPage, pageSize)
    .then((data) => {
      if (data.length > 0) {
        adicionarNovosDados(data); // Chame a função de adicionar novos dados
      }
    })
    .catch(() => 'Erro ao obter atualizacoes!')
    .finally(() => {
      setCarregando(false);
    });
};

useEffect(() => {
  setIsLoading(true);
  getLogAtualizacoes(id, page, pageSize)
    .then((data) => {
      if (data.length > 0) {
        adicionarNovosDados(data); // Chame a função de adicionar novos dados
      }
    })
    .catch(() => 'Erro ao obter atualizações!')
    .finally(() =>
```
