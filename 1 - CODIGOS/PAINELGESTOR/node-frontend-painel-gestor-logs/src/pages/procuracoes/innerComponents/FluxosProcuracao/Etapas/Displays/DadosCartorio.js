import {
  Col, Descriptions, Row, Typography
} from 'antd';
import React from 'react';

const { Text } = Typography;

/**
 * @param {{ cartorio: Procuracoes.Cartorio}} props
 */
const DadosCartorio = ({ cartorio }) => {
  if (!cartorio) {
    return null;
  }

  return (
    <Row>
      <Col span={24}>
        <Descriptions layout="vertical">
          <Descriptions.Item label={<Text strong>Nome</Text>}>
            {cartorio.nome}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>CNPJ</Text>}>
            {cartorio.cnpj}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Endereço</Text>}>
            {cartorio.endereco}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Complemento</Text>}>
            {cartorio.complemento}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Bairro</Text>}>
            {cartorio.bairro}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Municipio</Text>}>
            {cartorio.municipio}
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
  );
};

export default DadosCartorio;
