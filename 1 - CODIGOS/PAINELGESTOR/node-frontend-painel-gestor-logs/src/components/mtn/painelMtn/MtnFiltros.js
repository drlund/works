import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchVisoes } from "services/ducks/Mtn.ducks";
import { Form, Input, Row, Col, Select, Button, Radio, Tooltip } from "antd";
import InputPrefixo from "components/inputsBB/InputPrefixo";
const { Option } = Select;
const getDefaultValues = (fields) => {
  const defaultValues = {};

  const hasDefaulValue = fields.filter((field) => field.defaultValue);
  for (const field of hasDefaulValue) {
    defaultValues[field.name] = field.defaultValue;
  }
  return defaultValues;
};

const MtnFiltros = (props) => {
  const [visoes, setVisoes] = useState([]);
  //Controlled Fields
  const [subordinacao, setSubordinacao] = useState("nao_se_aplica");
  // const [prefixos, setPrefixos] = useState([]);

  useEffect(() => {}, [props.filtros]);

  const layout = {
    labelCol: { span: 3 },
  };

  useEffect(() => {
    const getSelectParms = async () => {
      const fetchedVisoes = await fetchVisoes();
      setVisoes(fetchedVisoes);
    };

    getSelectParms();
  }, []);

  const filtrar = (values) => {
    props.updateFunc(values);
  };

  const commonFields = [
    {
      name: "envolvido",
      span: 24,
      label: "Envolvido",
      placeholder: "Matrícula",
      component: <Input placeHolder={"Matrícula"} style={{ width: 150 }} />,
    },

    {
      name: "subordinacao",
      label: "Subordinação",
      span: 10,
      component: (
        <Radio.Group
          defaultValue="nao_se_aplica"
          onChange={(e) => {
            const { value } = e.target;
            if (value === "nao_se_aplica") {
              props.form.setFieldsValue({ prefixos: [] });
            }
            setSubordinacao(value);
          }}
        >
          <Radio value={"nao_se_aplica"}>Não se aplica</Radio>
          <Radio value={"prefixos"}>Somente Prefixo</Radio>
          <Radio value={"subordinadas"}>Incluir Subordinadas</Radio>
        </Radio.Group>
      ),
    },

    {
      name: "prefixos",
      label: "Prefixo(s)",
      span: 12,
      component: (
        <InputPrefixo
          placeholder="Todos"
          disabled={subordinacao === "nao_se_aplica"}
          value={[]}
          mode="multiple"
        />
      ),
    },

    {
      name: "visao",
      label: "Visão(ões)",
      span: 24,
      component: (
        <Select
          placeholder="Todas"
          mode="multiple"
          loading={visoes.length === 0}
          optionFilterProp="content"
        >
          {visoes.map((visao) => {
            return (
              <Option value={visao.id} content={visao.descricao}>
                <Tooltip title={visao.descricao}>{visao.descricao}</Tooltip>
              </Option>
            );
          })}
        </Select>
      ),
    },
  ];

  const fields = props.customFilters
    ? [...props.customFilters, ...commonFields]
    : commonFields;

  const defaultValues = getDefaultValues(fields);

  return (
    <Form
      {...layout}
      initialValues={defaultValues}
      form={props.form}
      layout="inline"
      onFinish={filtrar}
    >
      <Row gutter={[0, 20]} align="middle" justify="start">
        {fields.map((field, index) => {
          return (
            <Col
              span={field.span ? field.span : 8}
              offset={field.offset ? field.offset : 0}
            >
              <Form.Item
                name={field.name}
                label={field.label}
                rules={field.rules ? field.rules : []}
              >
                {field.component ? (
                  field.component
                ) : (
                  <Input placeholder="Todos" />
                )}
              </Form.Item>
            </Col>
          );
        })}
        <Col span={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Filtrar Ocorrências
            </Button>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="middle"></Row>
    </Form>
  );
};

MtnFiltros.propTypes = {
  filtros: PropTypes.array.isRequired,
};

export default MtnFiltros;
