/**
 * Com a correção do `useEffect` para transformar o objeto retornado por `getSuspensoes(id)` em um array de valores, o `dataSource` do 
 * `SearchTable` pode ser atualizado da seguinte forma:
 */

/**
 * 
 * A principal alteração é que agora o `dataSource` do `SearchTable` utiliza diretamente o estado `suspensoes`, que é um array de valores 
 * obtidos após a conversão do objeto retornado por `getSuspensoes(id)`. 
 * 
 * Observe que não há mais a necessidade de usar `suspensoes.map` dentro do `dataSource`, pois `suspensoes` já é o array corrigido que pode 
 * ser diretamente utilizado na tabela.
 */

// Restante do código existente...

const obterSuspensoes = () => {
  if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
    return getSuspensoes(id)
      .then((getSuspensoesResultado) => {
        // Convertendo o objeto retornado para um array de valores
        return Object.values(getSuspensoesResultado);
      })
      .catch(() => 'Falha ao obter parâmetros!');
  }
};

return (
  <Space direction="vertical" size="large" style={{ display: 'flex' }}>
    <Row>
      <Col span={24}>
        <Card title="Parametrização das Suspensões do Portal de Movimentações">
          {renderActionButtons()}
          <SearchTable
            className="styledTableHead"
            columns={columns}
            dataSource={suspensoes.map((suspensao) => ({
              ...suspensao,
            }))}
            rowKey="id"
            size="small"
            pagination={{ showSizeChanger: true }}
            bordered
          />
        </Card>
      </Col>
    </Row>
    <Modal
      className="custom-modal"
      title="Justificar exclusão"
      open={showModal}
      onCancel={() => {
        setShowModal(false);
        setErroObservacao('');
      }}
      onOk={() => {
        if (!observacao) {
          setErroObservacao('Preencha o campo observação.');
          return;
        }

        setShowModal(false);
        if (selectedRecord) {
          confirmarExclusao(
            selectedRecord.id,
            removerSuspensao,
            'Confirmar exclusão do parâmetro?',
          );
        }
      }}
    >
      <Input.TextArea
        required
        className="text-area"
        rows={4}
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
      />
      {erroObservacao && <p className="error-message">{erroObservacao}</p>}
    </Modal>
  </Space>
);
