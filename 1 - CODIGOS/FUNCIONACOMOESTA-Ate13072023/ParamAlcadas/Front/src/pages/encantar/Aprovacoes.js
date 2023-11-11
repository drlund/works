import React from "react";
import { Row, Col, Tabs } from "antd";
import AprovacoesPendentes from "./aprovacoes/AprovacoesPendentes";
import AprovacoesFinalizadas from "./aprovacoes/AprovacoesFinalizadas";
const { TabPane } = Tabs;

const tabs = [
  {
    titulo: "Em aprovação",
    component: <AprovacoesPendentes />,
  },
  {
    titulo: "Finalizadas",
    component: <AprovacoesFinalizadas />,
  },
];

const Aprovacoes = (props) => {
  return (
    <>
      <Row style={{ marginTop: 15 }} gutter={[0, 30]}>
        <Col span={24}>
          <Tabs defaultActiveKey="0" type="card">
            {tabs.map((tab, index) => {
              return (
                <TabPane tab={tab.titulo} key={index}>
                  {tab.component}
                </TabPane>
              );
            })}
          </Tabs>
        </Col>
      </Row>
    </>
  );
};

export default Aprovacoes;
