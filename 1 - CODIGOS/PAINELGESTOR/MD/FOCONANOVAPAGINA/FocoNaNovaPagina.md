Para dar foco na nova página adicionada quando você carrega mais dados, você pode usar a referência à tabela e ao elemento da página que deseja destacar. No caso, você está usando o componente `SearchTable` para a exibição da tabela. Aqui está um exemplo de como você pode dar foco à nova página:

1. Adicione uma referência ao componente `SearchTable` usando o `useRef`:

```javascript
const tableRef = useRef(null);
```

2. Atribua a referência ao componente `SearchTable` usando a propriedade `ref`:

```javascript
<SearchTable
  ref={tableRef}
  className="styledTableHead"
  columns={columns}
  // Resto do código
/>
```

3. Após adicionar os novos dados com sucesso na função `carregarMaisDados`, você pode usar a referência para dar foco à nova página. Certifique-se de que `tableRef.current` esteja definido:

```javascript
const carregarMaisDados = () => {
  setCarregando(true);
  const nextPage = page + 1;
  getLogAtualizacoes(id, nextPage, pageSize)
    .then((data) => {
      if (data.length > 0) {
        adicionarNovosDados(data);
        setPage(nextPage);
        // Dê foco à nova página
        if (tableRef.current) {
          tableRef.current.gotoPage(nextPage); // Você pode precisar ajustar o nome do método dependendo da biblioteca SearchTable
        }
      }
    })
    .catch(() => 'Erro ao obter atualizacoes!')
    .finally(() => {
      setCarregando(false);
    });
};
```

Certifique-se de ajustar o método `gotoPage` de acordo com a biblioteca `SearchTable` que você está usando. Esta abordagem permitirá que você dê foco à nova página após carregar mais dados. Certifique-se de que a biblioteca ou componente que você está usando suporta essa funcionalidade ou verifique a documentação para obter detalhes sobre como fazê-lo.