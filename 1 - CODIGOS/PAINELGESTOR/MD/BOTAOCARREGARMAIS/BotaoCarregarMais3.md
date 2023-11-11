Parece que seu código está configurado para carregar mais dados quando o botão "Carregar Mais" é clicado. No entanto, parece que a paginação não está funcionando como o esperado.

Para implementar a funcionalidade de "Carregar Mais" com paginamento, você pode fazer algumas modificações no seu código. Aqui estão algumas sugestões:

1. Remova a propriedade `pagination` da configuração da tabela, pois você não quer que a tabela tenha sua própria paginação. Em vez disso, você está implementando sua própria paginação com o botão "Carregar Mais".

```javascript
<SearchTable
  className="styledTableHead"
  columns={columns}
  dataSource={acessos.map((logAcessos) => ({
    ...logAcessos,
  }))}
  rowKey="id"
  size="small"
  bordered
/>
```

2. Mantenha o estado `page` e `pageSize` como você já tem.

```javascript
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
```

3. Modifique sua função `carregaMaisDados` para carregar mais dados com base na página atual. Além disso, você pode adicionar um botão "Carregar Mais" que só estará disponível se houver mais dados a serem carregados.

```javascript
const carregaMaisDados = () => {
  setCarregando(true);
  const nextPage = page + 1;
  getLogAcessos(id, nextPage, pageSize)
    .then((data) => {
      if (data.length > 0) {
        setAcessos([...acessos, ...data]);
        setPage(nextPage);
      }
    })
    .catch(() => 'Erro ao obter acessos!')
    .finally(() => {
      setCarregando(false);
    });
};

return (
  <Space direction="vertical" size="large" style={{ display: 'flex' }}>
    <Row>
      <Col span={24}>
        {permissao.includes('ADM_LOGS') ? (
          <Card title="Log Acessos">
            <SearchTable
              className="styledTableHead"
              columns={columns}
              dataSource={acessos.map((logAcessos) => ({
                ...logAcessos,
              }))}
              rowKey="id"
              size="small"
              bordered
            />
            {acessos.length >= pageSize && (
              <Button onClick={carregaMaisDados} disabled={carregando}>
                {carregando ? 'Carregando...' : 'Carregar Mais'}
              </Button>
            )}
          </Card>
        ) : (
          <span style={{ fontSize: '35px', fontWeight: 'bold' }}>
            Funcionário sem acesso à tabela de Log de Acessos.
          </span>
        )}
      </Col>
    </Row>
  </Space>
);
```

Agora, o botão "Carregar Mais" só estará disponível quando houver mais dados a serem carregados. Certifique-se de que sua função `getLogAcessos` no arquivo `apiCalls/Logs.js` esteja configurada para lidar com a paginação corretamente.

Além disso, verifique se os dados do servidor estão sendo retornados corretamente com base na página atual e no tamanho da página. Certifique-se de que o endpoint de API esteja configurado para receber esses parâmetros de paginação e retornar os dados apropriados.