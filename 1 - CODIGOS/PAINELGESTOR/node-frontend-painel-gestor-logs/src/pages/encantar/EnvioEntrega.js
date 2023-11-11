import React from "react";
import { Row, Col, Tabs, Typography, Card } from "antd";
import SolicitacoesPendentesEnvio from "./entregas/SolicitacoesPendentesEnvio";
import SolicitacoesPendentesEntregaCliente from "./entregas/SolicitacoesPendentesEntregaCliente";
import SolicitacoesDevolvidas from './entregas/SolicitacoesDevolvidas';

const { Paragraph, Title, Text } = Typography;
const { TabPane } = Tabs;

const EnvioEntrega = (props) => {
  return (
    <Row>
      <Col span={24} style={{ marginTop: 20, marginBottom: 20 }}>
        <Card>
          <Title level={5}>Entregar o brinde e/ou carta</Title>
          <Paragraph>
            Após a aprovação da solicitação, é a hora de enviar os brindes e/ou
            a carta para o cliente.
          </Paragraph>
          <Paragraph>
            As solicitações exibidas na aba{" "}
            <Text strong>"Pendentes Envio"</Text> são aquelas que já foram
            aprovadas porém ainda não foram enviadas para o cliente.
          </Paragraph>
          <Paragraph>
            Para os casos de entrega direta para o Cliente, após o registro do
            envio, as solicitações passam a aparecer na aba
            <Text strong>"Pendentes Entrega para Cliente"</Text>. Para os casos
            de envio para o Prefixo, a solicitação será exibida na aba{" "}
            <Text strong>"Pendentes Entrega para Cliente"</Text> após o registro
            de recebimento por parte do prefixo destino dos brindes e/ou carta.
            Já quando for registrada falha na entrega, será exibida na aba <Text strong>"Entregas Devolvidas"</Text>, 
            onde poderá ser reencaminhada ou cancelada.
          </Paragraph>
        </Card>
      </Col>
      <Col span={24}>
        <Tabs type="card">
          <TabPane tab="Pendentes Envio" key="1">
            <SolicitacoesPendentesEnvio />
          </TabPane>
          <TabPane tab="Pendentes Entrega para Cliente" key="2">
            <SolicitacoesPendentesEntregaCliente />
          </TabPane>
          <TabPane tab="Entrega Devolvidas" key="3">
            <SolicitacoesDevolvidas />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default EnvioEntrega;
