import React, { useState } from "react";
import { Row, Col, Form, Button, Input, message, Select } from "antd";
import AntdUploadForm from "components/AntdUploadForm/AntdUploadForm";

const { Option } = Select;
const { TextArea } = Input;

const RegistroTratarDevolucao = (props) => {
  const { tratamentosDevolucao } = props;
  const [enviando, setEnviando] = useState(false);
  const [form] = Form.useForm();

  const tratarDevolucao = () => {
    setEnviando(true);
    props
      .registrarTratamentoDevolucao(form.getFieldsValue())
      .then(() => {
        setEnviando(false);
      })
      .catch((error) => {
        message.error(error);
        setEnviando(false);
      });
  };

  return (
    <Row>
      <Col span={24}>
        <Form form={form} wrapperCol={{ span: 24 }}>
          <Form.Item name="tratamentoDevolucao">
            <Select
              placeholder="Selecione o tratamento desejado"
              disabled={enviando}
            >
              {tratamentosDevolucao.map((tratamento) => {
                return (
                  <Option value={tratamento} key={tratamento}>
                    {tratamento}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="informacoesTratamentoDevolucao"
            wrapperCol={{ span: 24 }}
          >
            <TextArea
              disabled={enviando}
              rows={10}
              placeholder={
                "Informações complementares sobre o tratamento da devolução."
              }
            />
          </Form.Item>

          <AntdUploadForm disabled={enviando} />
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button loading={enviando} type="primary" onClick={tratarDevolucao}>
              Registrar
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default RegistroTratarDevolucao;
