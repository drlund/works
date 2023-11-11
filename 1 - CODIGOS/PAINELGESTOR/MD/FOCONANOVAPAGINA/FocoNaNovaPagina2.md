Para dar foco a uma página específica dentro do componente "Table" do Antd, você pode usar a função `scrollToRow` do "Table". No entanto, é importante observar que a versão 4.x do Ant Design não oferece suporte direto a essa funcionalidade. Portanto, você pode implementá-la manualmente. Aqui está um exemplo de como você pode fazer isso:

1. Adicione uma referência para o seu componente "Table":

```javascript
const tableRef = useRef(null);
```

2. Atribua a referência ao seu componente "Table":

```javascript
<Table
  ref={tableRef}
  // outras props
/>
```

3. Após adicionar os novos dados com sucesso na função `carregarMaisDados`, você pode usar a referência para dar foco à nova página. Você pode fazer isso calculando o índice do primeiro item na nova página e rolando para ele usando a função `scrollToRow`:

```javascript
const carregarMaisDados = () => {
  setCarregando(true);
  const nextPage = page + 1;
  getLogAtualizacoes(id, nextPage, pageSize)
    .then((data) => {
      if (data.length > 0) {
        adicionarNovosDados(data);
        setPage(nextPage);

        // Calcular o índice do primeiro item na nova página
        const firstItemIndex = (nextPage - 1) * pageSize;

        // Rolar para o primeiro item na nova página
        if (tableRef.current) {
          tableRef.current.scrollToRow(firstItemIndex);
        }
      }
    })
    .catch(() => 'Erro ao obter atualizacoes!')
    .finally(() => {
      setCarregando(false);
    });
};
```

Certifique-se de que a versão do Ant Design que você está usando suporta a função `scrollToRow`. Se você estiver usando uma versão mais antiga, pode ser necessário fazer algumas adaptações para alcançar o mesmo efeito. Consulte a documentação da versão específica do Ant Design que você está usando para obter mais detalhes sobre a função `scrollToRow`.