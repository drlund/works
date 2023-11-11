// @ts-nocheck
import {
  Button, Card, Col, Form, Input, InputNumber, message, Row, DatePicker
} from 'antd';
import React, { useEffect, useState } from 'react';
import history from 'history.js';
import moment from 'moment';
import {
  getOpcoesFormulario,
  gravarPagamento,
  patchPagamento
} from '../../apiCalls/apiCalls';
import './index.css';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

function FormPagamentos({ location }) {
  const idProjeto = parseInt(location.state.idProjeto, 10);
  const id = Number(location.state.id || 0);
  const { valorPagamento, observacao, dataDoPagamento } = location.state;
  const [, setDadosPagamentoForm] = useState();
  const [nomeEvento, setNomeEvento] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (![null, undefined, 'NaN'].includes(idProjeto)) {
      getOpcoesFormGestao(idProjeto);
    }
  }, [idProjeto]);

  const getOpcoesFormGestao = () => {
    getOpcoesFormulario(idProjeto)
      .then((opcoesForm) => {
        setNomeEvento(opcoesForm.nomeEvento);
      })
      .catch(() => message.error('Falha ao obter lista de opções!'));
  };

  function gravaEditaPagamentos() {
    const dadosForm = form.getFieldsValue();

    const dadosPagamento = {
      ...dadosForm,
      dataDoPagamento: moment(dadosForm.dataDoPagamento).format(
        'YYYY-MM-DD HH:mm',
      ),
      id,
    };

    if (id) {
      patchPagamento(dadosPagamento)
        .then((dadosPagamentoForm) => {
          setDadosPagamentoForm(dadosPagamentoForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao editar pagamento!'));
    } else {
      gravarPagamento({ ...dadosPagamento, idProjeto })
        .then((dadosPagamentoForm) => {
          setDadosPagamentoForm(dadosPagamentoForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao gravar pagamento do patrocínio!'));
    }
  }

  return (
    <>
      <Card>
        <Row>
          <Col span={12}>{`Projeto: ${idProjeto}`}</Col>
          <Col span={12}>{`Nome do Projeto: ${nomeEvento}`}</Col>
        </Row>
      </Card>
      <Card>
        <Form
          initialValues={{
            dataDoPagamento: moment(dataDoPagamento),
            valorPagamento,
            observacao,
          }}
          form={form}
          {...layout}
          name="control-ref"
          onFinish={gravaEditaPagamentos}
        >
          <Form.Item
            name="valorPagamento"
            label="Valor do Pagamento"
            higth="150px"
            required
              >
            <InputNumber
              valuePropName="value"
              prefix="R$"
              block
              type="text"
              placeholder="Digite o valor do projeto!"
              style={{ width: '20%' }}
              decimalSeparator=","
              />
          </Form.Item>
          <Form.Item
            valuePropName="defaultValue"
            name="dataDoPagamento"
            label="Data do Pagamento"
            >
            <DatePicker
              format="DD/MM/YYYY"
            />
          </Form.Item>
          <Form.Item
            name="observacao"
            label="Observação"
            >
            <Input
              type="text"
              required
              placeholder="Observação"
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              style={{ marginRight: 10, borderRadius: 3 }}
              type="primary"
              htmlType="submit"
            >
              Salvar
            </Button>
            <Button
              htmlType="button"
              style={{ borderRadius: 3 }}
              type="danger"
              onClick={() => history.goBack()}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default FormPagamentos;
