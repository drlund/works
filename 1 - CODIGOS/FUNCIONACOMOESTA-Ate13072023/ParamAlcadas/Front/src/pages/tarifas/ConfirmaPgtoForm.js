import React from "react";
import { Row, Col, Button, Input, Modal } from "antd";
import { ExclamationCircleOutlined, CheckOutlined } from "@ant-design/icons";
const { confirm } = Modal;
// const { Paragraph, Text } = Typography;

const { TextArea } = Input;

const ConfirmaPgtoForm = (props) => {
  const { observacao, setObservacao, onConfirmaPgto, onCancelarPgto } = props;

  function showConfirm() {
    confirm({
      title: "Tem certeza que deseja confirmar o pagamento?",
      icon: <CheckOutlined style={{ color: "green" }} />,
      content:
        "Após a confirmação do pagamento, a ocorrência será finalizada em definitivo",
      okText: "Confirmar pagamento",
      cancelText: "Fechar",
      onOk() {
        onConfirmaPgto(observacao);
      },
      onCancel() {
        console.log("Cancelar");
      },
    });
  }

  function showCancel() {
    confirm({
      title: "Deseja cancelar a inclusão do comprovante de pagamento?",
      icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
      content:
        "Após o cancelamento do comprovante de pagamento, a ocorrência estará disponível para nova inclusão.",
      onOk() {
        onCancelarPgto(observacao);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  return (
    <Row style={{ marginTop: 25 }} gutter={[0, 20]}>
      <Col span={24}>
        <TextArea
          value={observacao}
          onChange={(e) => {
            setObservacao(e.target.value);
          }}
          rows={8}
          placeholder="Informações adicionais que julgue necessário"
        />
      </Col>
      <Col
        span={24}
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <Button danger type={"primary"} onClick={showCancel}>
          Cancelar pagamento
        </Button>
        <Button type={"primary"} onClick={showConfirm}>
          Confirma pagamento
        </Button>
      </Col>
    </Row>
  );
};

export default ConfirmaPgtoForm;
