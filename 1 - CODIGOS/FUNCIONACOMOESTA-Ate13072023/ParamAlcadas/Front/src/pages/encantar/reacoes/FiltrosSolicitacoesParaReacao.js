import React from "react";
import { Col, Row, Form, message, DatePicker, Button } from "antd";
import InputNumberForm from "components/AntdFormCustomFields/InputNumberForm";
import InputFunciForm from "components/AntdFormCustomFields/InputFunciForm";
import moment from 'moment';
const { RangePicker } = DatePicker;

const isTodosCamposVazios = (filtros) => {
  return (
    !filtros.mci && !filtros.periodoCriacaoSolicitacao && !filtros.solicitante
  );
};

const validarFiltros = (filtros) => {
  if (isTodosCamposVazios(filtros)) {
    return new Promise((resolve, reject) =>
      reject(["Preencha ao menos uma campo de pesquisa"])
    );
  }
  return new Promise((resolve, reject) => resolve());
};

const FiltrosSolicitacoesParaReacao = (props) => {
  const [form] = Form.useForm();
  const { atualizarFiltros } = props;

  const filtrar = async () => {
    const filtros = form.getFieldsValue();
    try {
      await validarFiltros(filtros);
      atualizarFiltros(filtros)
      form.resetFields();
    } catch (erros) {
      for (const erro of erros) {
        message.error(erro);
      }
    }
  };

  const campos = [
    {
      name: "mci",
      label: "MCI",
      span: 4,
      component: <InputNumberForm maxLength={9} form={form} name={"mci"} />,
    },

    {
      name: "periodoCriacaoSolicitacao",
      label: "Data Solicitação",
      span: 12,
      component: (
        <RangePicker
        disabledDate={(currentDate) =>{
          return currentDate.diff(moment()) > 0
        } }
          format="DD/MM/YYYY"
          allowEmpty={false}
          showToday={false}
        />
      ),
    },
    {
      name: "solicitante",
      label: "Solicitante",
      span: 12,
      component: <InputFunciForm form={form} name={"solicitante"} />,
    },
  ];

  return (
    <>
      <Form onFinish={filtrar} layout="inline" form={form}>
        <Row gutter={[0,20]}>
        {campos.map((field, index) => {
          return (
            <Col span={field.span}>
              <Form.Item name={field.name} label={field.label}>
                {field.component}
              </Form.Item>
            </Col>
          );
        })}
        <Button style={{ marginTop: 10 }} type="primary" htmlType="submit">
          Pesquisar
        </Button>
        </Row>
      </Form>
    </>
  );
};

export default FiltrosSolicitacoesParaReacao;
