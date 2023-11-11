Entendi a sua pergunta de forma errada. Se você deseja manter todos os registros carregados e aumentar o número de páginas disponíveis, você pode fazer o seguinte:

1. Remova a condição `atualizacoes.length >= pageSize` do botão "Carregar Mais!". Isso permitirá que os dados se acumulem na tabela.

```javascript
<Button
  type='primary'
  fontWeight='bold'
  onClick={() => {
    carregaMaisDados();
    setShowMoreData(true);
  }}
  disabled={carregando}
>
  {carregando ? 'Carregando...' : 'Carregar Mais!'}
</Button>
```

2. No componente `SearchTable`, defina o `dataSource` para todos os registros carregados em vez de usar `atualizacoes.slice(0, pageSize)`:

```javascript
<SearchTable
  className="styledTableHead"
  columns={columns}
  dataSource={atualizacoes}
  size="small"
  pagination={{
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50'],
    defaultPageSize: 10,
  }}
  bordered
/>
```

Dessa forma, a tabela mostrará todos os registros carregados, e ao clicar no botão "Carregar Mais!", novos registros serão adicionados à tabela sem remover os registros anteriores. Certifique-se de que a função `carregaMaisDados` continue a adicionar os novos dados à matriz `atualizacoes` para que eles se acumulem.