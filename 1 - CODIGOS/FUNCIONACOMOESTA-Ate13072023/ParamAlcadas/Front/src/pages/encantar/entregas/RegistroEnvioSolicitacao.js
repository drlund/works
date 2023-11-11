import React, { useState, useEffect } from "react";
import {
  Row,
  Form,
  Input,
  Select,
  Button,
  message,
  Col,
  DatePicker,
  InputNumber,
} from "antd";
import AntdUploadForm from "components/AntdUploadForm/AntdUploadForm";
import moment from "moment";
const { TextArea } = Input;
const { Option } = Select;

const tiposEnvio = [
  { id: 3, descricao: "Malote" },
  { id: 1, descricao: "Correios" },
  { id: 2, descricao: "Transportadora" },
];

const RegistroEnvioSolicitacao = (props) => {
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
          <Form.Item name="dataEnvio" wrapperCol={{ span: 24 }}>
            <DatePicker
              disabled={enviando}
              placeholder={"Data do envio"}
              format="DD/MM/YYYY"
              showToday
              disabledDate={(current) => current > moment()}
            />
          </Form.Item>
          <Form.Item name="tipoEntrega">
            <Select
              placeholder="Selecione o tipo da entrega"
              disabled={enviando}
            >
              {tiposEnvio.map((tipoEnvio) => {
                return (
                  <Option value={tipoEnvio.id} key={tipoEnvio.id}>
                    {tipoEnvio.descricao}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="valorFrete">
            <InputNumber
             disabled={enviando}
              min={0}
              step={1}
              decimalSeparator={","}
              style={{ width: "100%" }}
              placeholder={"valor do frete"}
            />
          </Form.Item>
          <Form.Item name="identificadorEntrega" wrapperCol={{ span: 24 }}>
            <Input
              disabled={enviando}
              placeholder={
                "Identificador da entrega (Código os correios, nº do lacre e etc)"
              }
            />
          </Form.Item>
          <Form.Item name="informacoes" wrapperCol={{ span: 24 }}>
            <TextArea
              disabled={enviando}
              rows={10}
              placeholder={
                "Outras informações importantes, como por exemplo endereço de entrega, ponto de referência, funcionário que irá receber na agência e etc."
              }
            />
          </Form.Item>

          <AntdUploadForm   disabled={enviando}  />
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              loading={enviando}
              type="primary"
              onClick={() => {
                setEnviando(true);
                props
                  .registrarEnvio(form.getFieldsValue())
                  .then(() => {
                    setEnviando(false);
                  })
                  .catch((error) => {
                    message.error(error);
                    setEnviando(false);
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

export default RegistroEnvioSolicitacao;
