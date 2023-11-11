import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import SearchTable from 'components/searchtable/SearchTable';
import { Col, Space, Divider, message } from 'antd';
import { getDadosJurisdicaoMeuPrefixo } from 'pages/movimentacoes/apiCalls/apiMovimentacoesJurisdicao';

function MinhaJurisdicao() {
  const authState = useSelector((state) => state.app.authState.sessionData);
  const [minhaSubordinante, setMinhaSubordinante] = useState([]);
  const [minhasSubordinadas, setMinhasSubordinadas] = useState([]);

  const columns = [
    {
      title: 'Prefixo',
      dataIndex: 'prefixo',
      render: (prefixo) => String(prefixo).padStart(4, '0'),
    },
    {
      title: 'Uor',
      dataIndex: 'uor',
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
  ];

  const onGetDadosQuoruns = async () => {
    const { subordinadas, subordinante } = await getDadosJurisdicaoMeuPrefixo();
    setMinhaSubordinante(subordinante);
    setMinhasSubordinadas(subordinadas);
  };

  useEffect(() => {
    onGetDadosQuoruns()
      .catch(() => {
        message.error(
          'Erro ao carregar jurisdicionantes e jurisdicionadas do próprio prefixo.',
        );
      })
      .finally(() => {});
  }, [minhaSubordinante, minhasSubordinadas]);

  return (
    <Col span={24} style={{ marginLeft: 10, marginTop: -30 }}>
      <Divider orientation="left">Jurisdicionantes</Divider>
      <Space direction="horizontal" size="small" style={{ marginLeft: 5 }}>
        {minhaSubordinante.length ? (
          <ul>
            {minhaSubordinante.map((item) => (
              <li key={item.prefixo}>
                {item.prefixo} {item.nome}
              </li>
            ))}
          </ul>
        ) : (
          <p />
        )}
      </Space>

      <Divider orientation="left">Meu prefixo</Divider>
      <Space direction="horizontal" size="small" style={{ marginLeft: 5 }}>
        <p>
          {authState.prefixo} {authState.dependencia}
        </p>
      </Space>

      <Divider orientation="left">Jurisdicionadas</Divider>
      <SearchTable
        columns={columns}
        dataSource={minhasSubordinadas}
        size="small"
        pagination={{ showSizeChanger: true }}
      />
    </Col>
  );
}
export default MinhaJurisdicao;
