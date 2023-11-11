import React, { useState } from 'react';

import Historico from './Historico';
import PesquisarOcorrencia from './PesquisarOcorrencia';

import { Row, Col, Tabs, Card } from 'antd';

const { TabPane } = Tabs;

const TABS = {
  pesquisarOcorrencias: {
    titulo: 'Pesquisar Ocorrências',
    conteudo: <PesquisarOcorrencia />,
  },

  historico: {
    titulo: 'Histórico',
    conteudo: <Historico />,
  },
};

const VersionarOcorrencia = () => {
  const [abaAtual, setAbaAtual] = useState('pesquisarOcorrencias');

  return (
    <Row gutter={[0, 20]}>
      <Col span={24}>
        <Card>
          <Tabs
            onChange={(activeKey) => {
              setAbaAtual(activeKey);
            }}
            type="card"
          >
            {Object.keys(TABS).map((key) => {
              return <TabPane tab={TABS[key].titulo} key={key} />;
            })}
          </Tabs>
        </Card>
      </Col>
      <Col span={24}>
        {TABS[abaAtual].conteudo}
      </Col>
    </Row>
  );
};

export default VersionarOcorrencia;
