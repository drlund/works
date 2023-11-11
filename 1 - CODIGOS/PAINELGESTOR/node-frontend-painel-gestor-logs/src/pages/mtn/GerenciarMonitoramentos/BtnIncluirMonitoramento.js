import React, { useState } from "react";
import { Button, Modal, Form, Input, message, Checkbox } from "antd";
import { salvarMonitoramento } from "../../../services/ducks/MtnComite.ducks";
import BBSpining from "components/BBSpinning/BBSpinning";

const BtnIncluirMonitoramento = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onSalvarMonitoramento = () => {
    const dadosMonitoramento = form.getFieldsValue();
    setLoading(true);
    salvarMonitoramento(dadosMonitoramento)
      .then(() => {
        message.success("Monitoramento salvo com sucesso");
        form.resetFields();
        setShowModal(false);
      })
      .catch((error) => {
        message.error("Erro ao salvar monitoramento");
      })
      .then(() => {
        setLoading(false);
      });
  };

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };

  return (
    <>
      <Button type="primary"  style={{marginBottom: 10}}onClick={() => setShowModal(true)}>
        Incluir Monitoramento
      </Button>
      <Modal
        title="Incluir Monitoramento"
        onCancel={() => setShowModal(false)}
        cancelText={"Fechar"}
        okText={"Salvar"}
        onOk={onSalvarMonitoramento}
        okButtonProps={{ loading }}
        maskClosable={!loading}
        cancelButtonProps={{ loading }}
        width="40%"
        closable={!loading}
        visible={showModal}
      >
        <BBSpining spinning={loading}>
          <Form
            form={form}
            {...formItemLayout}
            layout={"horizontal"}
            labelAlign="left"
          >
            <Form.Item name="ativa" label="Ativa">
              <Checkbox
                onChange={(e) => {
                  form.setFieldsValue({ ativa: e.target.checked });
                }}
              />
            </Form.Item>
            <Form.Item name="nomeVisao" label="Nome da Visão">
              <Input />
            </Form.Item>
            <Form.Item name="nomeReduzido" label="Nome Reduzido">
              <Input />
            </Form.Item>
            <Form.Item name="descricao" label="Descrição">
              <Input.TextArea rows={5} />
            </Form.Item>
          </Form>
        </BBSpining>
      </Modal>
    </>
  );
};

export default BtnIncluirMonitoramento;
