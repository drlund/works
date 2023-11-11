import { Form, Input, Button, DatePicker, Row, Col } from 'antd';

const { RangePicker } = DatePicker;

import React, { useState } from 'react';

const Filtros = ({ onPesquisarOcorrencias }) => {
  const [form] = Form.useForm();

  return (
    <Row gutter={[0,20]}>
      <Col span={24}>
        <Form form={form} layout="inline">
          <Form.Item name="nrMtn" label="Nr. Mtn">
            <Input placeholder="digite a nr. MTN" />
          </Form.Item>
          <Form.Item name="matriculaEnvolvido" label="Matrícula Envolvido">
            <Input name="matriculaEnvolvido" placeholder="digite a matrícula" />
          </Form.Item>
          <Form.Item name="matriculaAnalista" label="Matrícula Analista">
            <Input name="matriculaAnalista" placeholder="digite a matrícula" />
          </Form.Item>
          <Form.Item label="Período" name="periodoPesquisa">
            <RangePicker format="DD/MM/YYYY" />
          </Form.Item>
        </Form>
      </Col>
      <Col span={24}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            type="primary"
            style={{ marginTop: 20 }}
            onClick={() => {
              onPesquisarOcorrencias(form.getFieldsValue());
            }}
          >
            Filtrar Ocorrências
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default Filtros;
