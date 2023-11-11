import React from 'react';
import {Card, Row, Col, Descriptions, Empty} from 'antd';
import moment from 'moment';
import Text from 'antd/lib/typography/Text';

function Historico({solicitacao}) {
  return (
    <Card>
    {
      solicitacao.mat_aut_1_desp &&
      <Card title="PARECER DO PRIMEIRO DESPACHO">
        <Row>
          <Col span={24}>
            <Descriptions layout="vertical">
              <Descriptions.Item label="Data">{moment(solicitacao.data_1_desp).format('DD/MM/YYYY[, às ]HH:mm')}</Descriptions.Item>
              <Descriptions.Item label="Responsável">{solicitacao.mat_aut_1_desp} {solicitacao.nome_aut_1_desp}</Descriptions.Item>
              <Descriptions.Item label="Comissão">{solicitacao.comissao_aut_1_desp}</Descriptions.Item>
            </Descriptions>
            <Descriptions layout="vertical">
              <Descriptions.Item label="Resultado do Despacho">{solicitacao.parecer_1_desp}</Descriptions.Item>
            </Descriptions>
            <Descriptions layout="vertical">
              <Descriptions.Item label="Parecer">{solicitacao.justif_1_desp}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    }
    {
      solicitacao.mat_aut_2_desp &&
      <Card title="PARECER DO SEGUNDO DESPACHO">
        <Row>
          <Col span={24}>
            <Descriptions layout="vertical">
              <Descriptions.Item label="Data">{moment(solicitacao.data_2_desp).format('DD/MM/YYYY[, às ]HH:mm')}</Descriptions.Item>
              <Descriptions.Item label="Responsável">{solicitacao.mat_aut_2_desp} {solicitacao.nome_aut_2_desp}</Descriptions.Item>
              <Descriptions.Item label="Comissão">{solicitacao.comissao_aut_2_desp}</Descriptions.Item>
            </Descriptions>
            <Descriptions layout="vertical">
              <Descriptions.Item label="Resultado do Despacho">{solicitacao.parecer_2_desp}</Descriptions.Item>
            </Descriptions>
            <Descriptions layout="vertical">
              <Descriptions.Item label="Parecer">{solicitacao.justif_2_desp}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    }
    {
      (!solicitacao.mat_aut_1_desp && !solicitacao.mat_aut_2_desp) &&
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<Text>Sem Despacho</Text>}
      />
    }
    </Card>
  )
}

export default React.memo(Historico);
