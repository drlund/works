import React, { useEffect } from "react";
import { Form, DatePicker, Button, Input } from "antd";
const { RangePicker } = DatePicker;
const FormAusencias = (props) => {
  const [form] = Form.useForm();
  const {
    defaultPeriodo,
    onPesquisarAusencias,
    defaultMatricula,
    disableMatricula,
  } = props;

  useEffect(() => {
    form.setFieldsValue({
      periodo: defaultPeriodo,
      matricula: defaultMatricula,
    });
    form.submit();
  }, [defaultMatricula, defaultPeriodo, form]);

  return (
    <Form
      form={form}
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 16 }}
      onFinish={(values) => {
        const { matricula, periodo } = values;
        onPesquisarAusencias({ matricula, periodo });
      }}
    >
      <Form.Item name="periodo" label="Período">
        <RangePicker format="DD/MM/YYYY" defaultValue={defaultPeriodo} />
      </Form.Item>
      <Form.Item name="matricula" label="Matrícula" wrapperCol={{ span: 4 }}>
        <Input
          placeholder="F0000000"
          defaultValue={defaultMatricula}
          disabled={disableMatricula}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 16 }}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={() => {
            console.log(form.getFieldValue("matricula"));
            return !form.getFieldValue("matricula");
          }}
        >
          Pesquisar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormAusencias;
