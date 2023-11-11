import React from "react";
import { Col, Row, Tabs } from "antd";
import VisaoMtns from "pages/mtn/PainelMtn/VisaoMtns";
import VisaoAssessor from "pages/mtn/PainelMtn/VisaoAssessor";

const { TabPane } = Tabs;

const paineis = [

  {
    titulo: "Visão MTNs",
    component: <VisaoMtns />,
  },
  {
    titulo: "Visão Assessor",
    component: <VisaoAssessor />,
  },
];

const PainelMtn = (props) => {
  return (
    <Row>
      <Col span={24}>
        <Tabs defaultActiveKey="1" type="card">
          {paineis.map((painel, index) => {
            return (
              <TabPane tab={painel.titulo} key={index + 1}>
                {painel.component}
              </TabPane>
            );
          })}
        </Tabs>
      </Col>
    </Row>
  );
};

export default PainelMtn;
