import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Button, DatePicker, message } from "antd";
import BBSpinning from "components/BBSpinning/BBSpinning";
import commonColumns from "./commonColumns.js";
import SearchTable from "components/searchtable/SearchTable";
import { fetchSolicitacoesAprovacaoFinalizada } from "services/ducks/Encantar.ducks";
import moment from "moment";

const { RangePicker } = DatePicker;

const AprovacoesFinalizadas = (props) => {
  const [form] = Form.useForm();
  const [filtros, setFiltros] = useState(null);
  const [aprovacoes, setAprovacoes] = useState(null);
  const [fetching, setFetching] = useState(false);

  const getAprovacoesFinalizadas = useCallback((filtros) => {
    return fetchSolicitacoesAprovacaoFinalizada(filtros);
  }, []);

  useEffect(() => {
    if (filtros !== null) {
      setFetching(true);
      getAprovacoesFinalizadas(filtros)
        .then((aprovacoes) => setAprovacoes(aprovacoes))
        .catch((error) => message.error(error))
        .then(() => setFetching(false));
    }
  }, [filtros, getAprovacoesFinalizadas]);

  return (
    <BBSpinning spinning={fetching === true}>
      <Row gutter={[0, 30]} style={{ marginTop: 10 }}>
        <Col span={24}>
          <Form
            layout="inline"
            initialValues={{
              periodo: [moment().startOf("month"), moment().startOf("day")],
            }}
            form={form}
          >
            <Form.Item name="periodo" label="Período">
              <RangePicker format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => {
                  setFiltros(form.getFieldsValue());
                  form.resetFields();
                }}
                type={"primary"}
              >
                Pesquisar
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <SearchTable
            columns={commonColumns}
            dataSource={aprovacoes}
            size="small"
            pagination={{ showSizeChanger: true }}
          />
        </Col>
      </Row>
    </BBSpinning>
  );
};

export default AprovacoesFinalizadas;
