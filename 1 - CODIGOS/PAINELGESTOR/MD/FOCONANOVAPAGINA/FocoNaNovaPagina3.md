Se o seu componente "SearchTable" é uma classe, você ainda pode usar o `ref` para dar foco ao componente "Table" dentro dele, mas a abordagem será um pouco diferente do uso do `useRef`. Você precisará criar uma instância da classe "SearchTable" e, em seguida, acessar o componente "Table" usando o `ref` da instância. Aqui está como você pode fazer isso:

1. Crie uma variável para armazenar a instância do componente "SearchTable":

```javascript
const searchTableRef = React.createRef();
```

2. Atribua o `ref` ao componente "SearchTable" na renderização:

```javascript
<SearchTable
  ref={searchTableRef}
  // outras props
/>
```

3. Na função `carregarMaisDados`, você pode acessar a instância do componente "Table" dentro do "SearchTable" usando o `current` do `ref`:

```javascript
const carregarMaisDados = () => {
  setCarregando(true);
  const nextPage = page + 1;
  getLogAtualizacoes(id, nextPage, pageSize)
    .then((data) => {
      if (data.length > 0) {
        adicionarNovosDados(data);
        setPage(nextPage);

        // Acesse o componente Table dentro do SearchTable usando o ref
        const tableInstance = searchTableRef.current;

        if (tableInstance) {
          // Execute a lógica para dar foco à nova página
          // Esta parte depende da API específica do componente Table do Antd
          // Por exemplo, se o componente Table tiver uma função scrollToRow, você a usaria aqui
          // tableInstance.scrollToRow(firstItemIndex);
        }
      }
    })
    .catch(() => 'Erro ao obter atualizacoes!')
    .finally(() => {
      setCarregando(false);
    });
};
```

Certifique-se de adaptar a lógica para dar foco à nova página com base na API específica do componente "Table" do Antd que você está usando dentro do "SearchTable". Se o componente "Table" não fornecer uma função `scrollToRow`, você pode precisar considerar outras maneiras de alcançar esse efeito de dar foco à nova página.