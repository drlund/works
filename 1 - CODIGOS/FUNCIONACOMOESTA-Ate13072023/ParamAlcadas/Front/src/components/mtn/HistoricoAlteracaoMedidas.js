import React, { useState } from "react";
import { Button, Modal, Row, Col, Typography, Table } from "antd";
const { Text } = Typography;

const HistoricoAlteracaoMedidas = (props) => {
  const { envolvido } = props;

  const [modalVisible, setVisible] = useState(false);

  const columns = [
    {
      title: "Medida Antiga",
      render: (text, record) => (
        <Text>{`${record.medidaAntiga.txtMedida}`}</Text>
      ),
    },
    {
      title: "Medida Nova",
      render: (text, record) => <Text>{`${record.medidaNova.txtMedida}`}</Text>,
    },
    {
      title: "Data Confirmação",
      render: (text, record) => <Text>{`${record.dataConfirmacao}`}</Text>,
    },
  ];

  if (envolvido.alteracoesMedida.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        Alterações e Medida
      </Button>
      <Modal
        width={600}
        title={"Histórico de alterações da medida"}
        okButtonProps={{ style: { display: "none" } }}
        visible={modalVisible}
        onCancel={() => {
          setVisible(false);
        }}
        cancelText="Cancelar"
      >
        <Row gutter={[0, 20]}>
          <Col span={24}>
            <Table columns={columns} dataSource={envolvido.alteracoesMedida} />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default HistoricoAlteracaoMedidas;
