/**
 * Para acessar a variável `permissao` fora do `useEffect`, você pode declará-la como um estado no componente usando o `useState`. Aqui está como você pode fazer isso:
 */

/**
 * Agora, `permissao` é um estado que você pode acessar dentro e fora do `useEffect`. Certifique-se de adicioná-lo à lista de dependências do `useEffect` para que ele 
 * seja atualizado quando necessário.
 */

function LogAtualizacoesTable({ match }) {
  const authState = useSelector((state) => state.app.authState);
  const [permissao, setPermissao] = useState(getPermissoesUsuario('Painel do Gestor', authState));

  const id = parseInt(match.params.id, 10);
  const [atualizacoes, setAtualizacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatarData = (/** @type {moment.MomentInput} */ data) =>
    moment(data).format('DD/MM/YYYY - HH:mm:ss');

  useEffect(() => {
    if (permissao.includes('ADM_LOGS')) {
      setIsLoading(true);
      getLogAtualizacoes(id)
        .then((data) => {
          setAtualizacoes(data);
        })
        .catch(() => 'Erro ao obter atualizações!')
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, permissao]); // Certifique-se de incluir permissao como uma dependência

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: 'Atualização',
      dataIndex: 'ts_atualizacao',
      align: 'center',
      sorter: (
        /** @type {{ ts_atualizacao: Date; }} */ a,
        /** @type {{ ts_atualizacao: Date; }} */ b,
      ) => DateBrSort(a.ts_atualizacao, b.ts_atualizacao),
      render: (/** @type {Date} */ data) => formatarData(data),
    },
    {
      title: 'Histórico',
      dataIndex: 'historico',
    },
    {
      title: 'Matrícula',
      dataIndex: 'matricula',
      align: 'center',
      render: (/** @type {string} */ matricula) =>
        String(matricula).padStart(4, '0'),
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <Row>
        <Col span={24}>
          <Card title="Log de Atualizações">
            <Spin spinning={isLoading}>
              <SearchTable
                className="styledTableHead"
                columns={columns}
                dataSource={atualizacoes.map((logAtualizacoes) => ({
                  ...logAtualizacoes,
                }))}
                size="small"
                pagination={{ showSizeChanger: true }}
                bordered
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

export default connect(null, { toggleSideBar })(LogAtualizacoesTable);
