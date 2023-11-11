import React, { useState, useEffect } from "react";

import { Row, Form, Input, Button, message, Col, DatePicker } from "antd";

import AntdUploadForm from "components/AntdUploadForm/AntdUploadForm";
import moment from "moment";

const { TextArea } = Input;

const RegistroRecebimentoSolicitacao = (props) => {
  const { solicitacao } = props;
  const [enviando, setEnviando] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [solicitacao, form]);

  if (!solicitacao) {
    return null;
  }

  return (
    <Row gutter={[0, 20]}>
      <Col span={24}>
        <Form form={form} wrapperCol={{ span: 24 }}>
          <Form.Item name="dataRecebimento" wrapperCol={{ span: 24 }}>
            <DatePicker
              style={{ width: "40%" }}
              disabled={enviando}
              placeholder={"Data do recebimento"}
              format="DD/MM/YYYY"
              showToday
              disabledDate={(current) => current > moment()}
            />
          </Form.Item>

          <Form.Item name="observacoes" wrapperCol={{ span: 24 }}>
            <TextArea
              disabled={enviando}
              rows={10}
              placeholder={
                "Quaisquer informações que julgue importante deixar registrado."
              }
            />
          </Form.Item>

          <AntdUploadForm />
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              loading={enviando}
              type="primary"
              onClick={() => {
                setEnviando(true);
                props
                  .registrarRecebimento(form.getFieldsValue())
                  .then(() => {
                    setEnviando(false);
                  })
                  .catch((error) => {
                    message.error(error);
                  });
              }}
            >
              Registrar Envio
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default RegistroRecebimentoSolicitacao;
