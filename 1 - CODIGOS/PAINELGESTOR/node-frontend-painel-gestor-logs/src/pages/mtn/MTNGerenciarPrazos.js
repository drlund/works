import React, { useState, useEffect, useCallback } from "react";
import {
  Col,
  Row,
  Input,
  Form,
  Button,
  DatePicker,
  Alert,
  Switch,
  Spin,
  message,
} from "antd";
import { commonDateRanges } from "utils/DateUtils";
import { atualizarPrazos, getConfigPrazos } from "services/ducks/Mtn.ducks";
import moment from "moment";

const MTNGerenciarPrazos = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState(null);
  const [alterados, setAlterados] = useState(false);
  const [justificativa, setJustificativa] = useState(null);

  const loadPrazos = useCallback(async () => {
    const { prazos, ultimaAlteracao } = await getConfigPrazos();
    const defaultValues = {};
    Object.keys(ultimaAlteracao).map((key, data) => {
      return (defaultValues[key] = moment(ultimaAlteracao[key]).isValid()
        ? moment(ultimaAlteracao[key])
        : ultimaAlteracao[key]);
    });

    form.setFieldsValue(defaultValues);

    setLoading(false);
    setFields(
      prazos.map((prazo) => {
        return {
          name: prazo.tipo,
          label: prazo.display,
          span: 24,
          component: (
            <DatePicker
              format="DD/MM/YYYY"
              ranges={commonDateRanges}
              allowEmpty={false}
              showToday={false}
            />
          ),
        };
      })
    );
  },[form]);

  useEffect(() => {
    loadPrazos();
  }, [loadPrazos]);

  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 14 },
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // await validarValores(values);
      await atualizarPrazos(values);
      message.success("Prazos atualizados com sucesso");
      form.resetFields();
      setAlterados(false);
      await loadPrazos();
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Row gutter={[0, 25]}>
        <Col span={24}>
          <Alert
            message="Caso preencha algum dos campos abaixo, a data escolhida servirá como base para cálculo dos prazos"
            type="info"
            showIcon
          />
        </Col>
        <Col span={24}>
          {fields && (
            <Form
              {...formItemLayout}
              onValuesChange={(changedValues, allValues) => setAlterados(true)}
              form={form}
              onFinish={onFinish}
            >
              <Form.Item
                labelAlign="left"
                name={"acoes_no_vencimento"}
                label={"Ações no vencimento ?"}
              >
                <Switch
                  defaultChecked={form.getFieldValue("acoes_no_vencimento")}
                />
              </Form.Item>
              {fields.map((field, index) => {
                return (
                  <>
                    <Form.Item
                      labelAlign="left"
                      name={field.name}
                      label={field.label}
                      rules={field.rules ? field.rules : []}
                    >
                      {field.component}
                    </Form.Item>
                  </>
                );
              })}
              <Form.Item
                labelAlign="left"
                name={`justificativa`}
                label={`Justificativa`}
              >
                <Input.TextArea
                  rows={5}
                  disabled={!alterados}
                  onChange={(e) => setJustificativa(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    !alterados || !justificativa || justificativa === ""
                  }
                >
                  Salvar
                </Button>
              </Form.Item>
            </Form>
          )}
        </Col>
      </Row>
    </Spin>
  );
};

export default MTNGerenciarPrazos;
