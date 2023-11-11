Parece que você deseja permitir que os usuários vejam os dados carregados ao clicar no botão "Carregar Mais!" em uma tabela. No código fornecido, você já implementou a funcionalidade de carregar mais dados, mas para permitir que os usuários vejam os dados carregados, você pode seguir estas etapas:

1. Crie um estado para controlar se os dados adicionais estão visíveis ou não. Por exemplo:

```javascript
const [showMoreData, setShowMoreData] = useState(false);
```

2. No botão "Carregar Mais!", adicione um evento de clique para alternar o estado `showMoreData` para `true` quando o usuário clicar no botão:

```javascript
<Button
  type='primary'
  fontWeight='bold'
  onClick={() => {
    carregaMaisDados();
    setShowMoreData(true); // Adicione esta linha
  }}
  disabled={carregando}
>
  {carregando ? 'Carregando...' : 'Carregar Mais!'}
</Button>
```

3. Na renderização da tabela, verifique o estado `showMoreData` e exiba os dados adicionais se ele estiver definido como `true`. Você pode fazer isso ajustando o código dentro do componente `SearchTable`:

```javascript
<SearchTable
  className="styledTableHead"
  columns={columns}
  dataSource={showMoreData ? atualizacoes : atualizacoes.slice(0, pageSize)}
  size="small"
  pagination={{
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50'],
    defaultPageSize: 10,
  }}
  bordered
/>
```

Dessa forma, quando o usuário clicar no botão "Carregar Mais!", os dados adicionais serão carregados e exibidos na tabela se o estado `showMoreData` for `true`. Certifique-se de que os dados iniciais (primeira página) ainda sejam exibidos quando `showMoreData` for `false`.