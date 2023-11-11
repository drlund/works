import React, { useState } from "react";
import { Row, Col, Tabs, Typography, Card } from "antd";
import Ativos from "./GerenciarMonitoramentos/Ativos";
import EmVotacao from "./GerenciarMonitoramentos/EmVotacao";
import BBSpining from "components/BBSpinning/BBSpinning";
import AlteracoesParaTratamento from "./GerenciarMonitoramentos/AlteracoesParaTratamento";
import BtnIncluirMonitoramento from "./GerenciarMonitoramentos/BtnIncluirMonitoramento";
const { Title, Paragraph, Text } = Typography;

const { TabPane } = Tabs;
const GerenciarMonitoramentos = (props) => {
  const [loading, setLoading] = useState(false);

  return (
    <BBSpining spinning={loading}>
      <Row gutter={[0, 20]}>
        <Col span={22} offset={1}>
          <Card>
            <Title level={5}>Gerenciamento de Monitoramentos</Title>
            <Paragraph>
              Nesta tela é possível gerenciar os monitoramentos do MTN. Os
              monitoramentos podem ser acessados através de três abas:
            </Paragraph>

            <Paragraph>
              <ul>
                <li>
                  <Text strong>Incluir Versão</Text>: Nessa aba são exibidos os
                  monitoramentos que estão disponíveis para inclusão de uma nova
                  votação.
                </li>
                <li>
                  <Text strong>Tratar alterações</Text>: Nessa aba são exibidos
                  os monitoramentos para os quais uma votação foi incluída e um
                  membro do comitê sugeriu uma alteração na mesma.
                </li>

                <li>
                  <Text strong>Em votação</Text>: Nessa aba são exibidos os
                  monitoramentos para os quais foi incluída uma votação e a
                  mesma não foi finalizada.
                </li>
              </ul>
            </Paragraph>
          </Card>
        </Col>
        <Col span={22} offset={1}>
          <Tabs type="card" tabBarExtraContent={<BtnIncluirMonitoramento />}>
            <TabPane tab="Incluir Versão" key={"incluirVersao"}>
              <Ativos loadingController={{ loading, setLoading }} />
            </TabPane>
            <TabPane tab="Tratar Alterações" key={"alteracoes"}>
              <AlteracoesParaTratamento
                loadingController={{ loading, setLoading }}
              />
            </TabPane>
            <TabPane tab="Em votação" key={"em-votacao"}>
              <EmVotacao loadingController={{ loading, setLoading }} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </BBSpining>
  );
};

export default GerenciarMonitoramentos;
