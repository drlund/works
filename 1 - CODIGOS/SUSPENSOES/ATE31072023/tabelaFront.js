/**
 * Para que a tabela no frontend reflita a consulta realizada na sua repository, você precisará ajustar o mapeamento 
 * das colunas e seus respectivos títulos na tabela. Vou fornecer a estrutura atualizada da tabela para você:
 */


import React, { useState, useEffect } from 'react';
// ...importações existentes...

// ...seu código existente...

function ParamSuspensaoTable({ ...props }) {
  // ...seu código existente...

  const columns = [
    {
      title: 'TIPO',
      dataIndex: 'TIPO',
    },
    {
      title: 'VALORES',
      dataIndex: 'VALORES',
    },
    {
      title: 'TIPOSUSPENSAO',
      dataIndex: 'TIPOSUSPENSAO',
    },
    {
      title: 'VALIDADE',
      dataIndex: 'VALIDADE',
    },
    {
      title: 'MATRICULARESPONSAVEL',
      dataIndex: 'MATRICULARESPONSAVEL',
    },
    {
      title: 'OBSERVACAO',
      dataIndex: 'OBSERVACAO',
    },
    {
      title: 'Ações',
      width: '10%',
      align: 'center',
      render: (record) => (
        // ...seu código existente para os botões de ação...
      ),
    },
  ];

  // ...seu código existente...

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <Row>
        <Col span={24}>
          <Card title="Parametrização das Suspensões do Portal de Movimentações">
            {renderActionButtons()}
            <SearchTable
              className="styledTableHead"
              columns={columns}
              dataSource={suspensoes}
              rowKey="id"
              size="small"
              pagination={{ showSizeChanger: true }}
              bordered
            />
          </Card>
        </Col>
      </Row>
      {/* ...seu código existente... */}
    </Space>
  );
}

export default connect(null, { toggleSideBar })(ParamSuspensaoTable);

No código acima, atualizamos os títulos das colunas da tabela para corresponderem aos campos retornados pela consulta na repository. Além disso, removemos a função `map` no dataSource da tabela, pois os dados já estão sendo retornados no formato necessário pela repository.

Certifique-se de que a consulta na repository esteja funcionando corretamente e que os dados sejam retornados de acordo com as colunas que você definiu na tabela do frontend. Isso deve fazer com que a tabela exiba os dados corretamente. Se você tiver algum erro ou problema adicional, certifique-se de verificar os dados retornados pela consulta e os mapeamentos nas colunas da tabela.