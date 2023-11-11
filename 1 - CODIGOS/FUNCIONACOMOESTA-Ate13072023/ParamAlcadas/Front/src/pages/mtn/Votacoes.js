import React from "react";
import { Row, Col, Result, Tabs, Skeleton } from "antd";

import MonitoramentosParaVotacao from "./Votacoes/MonitoramentosParaVotacao";
import usePermVotar from "hooks/mtn/usePermVotar";
import BBSpining from "components/BBSpinning/BBSpinning";
const { TabPane } = Tabs;

const Votacoes = (props) => {
  const permVotacao = usePermVotar();

  if (permVotacao === null) {
    return (
      <BBSpining spinning={true}>
        <Skeleton />
      </BBSpining>
    );
  }

  if (permVotacao === false) {
    return (
      <Result
        status={403}
        title="Usuário sem acesso."
        subTitle="Somente funcionários membros do comitê de administração da Super Adm tem acesso à essa página."
      />
    );
  }

  return (
    <Row gutter={[0, 20]}>
      <Col span={24}>
        <Tabs type="card">
          <TabPane tab="Em andamento" key="em_andamento">
            <MonitoramentosParaVotacao />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export default Votacoes;
