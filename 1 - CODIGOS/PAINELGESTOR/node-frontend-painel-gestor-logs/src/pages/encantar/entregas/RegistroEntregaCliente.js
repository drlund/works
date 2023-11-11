import React, { useState } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Input,
  message,
  Select,
  DatePicker,
} from "antd";
import AntdUploadForm from "components/AntdUploadForm/AntdUploadForm";
import moment from "moment";
const { Option } = Select;
const { TextArea } = Input;

// Ao incluir um novo tipo, deve-se atualizar o campo 'resultadoEntregaCliente' do tipo ENUM, na tabela solicitacoesEntregaCliente, do banco app_encantar.
const resultadoEntrega = ["Entregue com sucesso", "Devolvido", "Extraviado"];

const RegistroEntregaCliente = (props) => {
  const [enviando, setEnviando] = useState(false);
  const [form] = Form.useForm();

  return (
    <Row>
      <Col span={24}>
        <Form form={form} wrapperCol={{ span: 24 }}>
          <Form.Item name="dataResultadoEntrega" wrapperCol={{ span: 24 }}>
            <DatePicker
              style={{ width: "70%" }}
              disabled={enviando}
              placeholder={"Data do resultado da entrega "}
              format="DD/MM/YYYY"
              showToday
              disabledDate={(current) => current > moment()}
            />
          </Form.Item>
          <Form.Item name="resultadoEntregaCliente">
            <Select
              placeholder="Selecione o resultado da entrega"
              disabled={enviando}
            >
              {resultadoEntrega.map((tipoEnvio) => {
                return (
                  <Option value={tipoEnvio} key={tipoEnvio}>
                    {tipoEnvio}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item name="informacoes" wrapperCol={{ span: 24 }}>
            <TextArea
              disabled={enviando}
              rows={10}
              placeholder={
                "Informações complementares sobre a entrega ao cliente."
              }
            />
          </Form.Item>

          <AntdUploadForm disabled={enviando} />
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              loading={enviando}
              type="primary"
              onClick={() => {
                setEnviando(true);
                props
                  .registrarEntregaCliente(form.getFieldsValue())
                  .then(() => {
                    setEnviando(false);
                  })
                  .catch((error) => {
                    message.error(error);
                    setEnviando(false);
                  });
              }}
            >
              Registrar Entrega
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default RegistroEntregaCliente;
