import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  DatePicker,
  InputNumber,
} from 'antd';
import React, { useEffect, useState } from 'react';
import history from 'history.js';
import moment from 'moment';
import {
  getOpcoesFormulario,
  gravarProvisao,
  patchProvisao,
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

function FormProvisao({ location }) {
  const idProjeto = parseInt(location.state.idProjeto, 10);
  const id = Number(location.state.id || 0);
  const { valorProvisao, observacao, competenciaProvisao } = location.state;
  const [, setDadosProvisaoForm] = useState();
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

  function gravaEditaProvisao() {
    const dadosForm = form.getFieldsValue();

    const dadosProvisao = {
      ...dadosForm,
      competenciaProvisao: moment(dadosForm.competenciaProvisao).format(
        'YYYY-MM-DD HH:mm',
      ),
      id,
    };

    if (id) {
      patchProvisao(dadosProvisao)
        .then((dadosProvisaoForm) => {
          setDadosProvisaoForm(dadosProvisaoForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao editar provisão!'));
    } else {
      gravarProvisao({ ...dadosProvisao, idProjeto })
        .then((dadosProvisaoForm) => {
          setDadosProvisaoForm(dadosProvisaoForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao gravar provisão do patrocínio!'));
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
            valorProvisao,
            competenciaProvisao: moment(competenciaProvisao),
            observacao,
          }}
          form={form}
          {...layout}
          name="control-ref"
          onFinish={gravaEditaProvisao}
        >
          <Form.Item
            name="valorProvisao"
            label="Valor do Projeto"
            higth="150px"
            required
            >
            <InputNumber
              valuePropName="value"
              block
              prefix="R$"
              style={{ width: '20%' }}
              type="text"
              decimalSeparator=","
              placeholder="Digite o valor do projeto!"
            />
          </Form.Item>
          <Form.Item
            valuePropName="defaultValue"
            name="competenciaProvisao"
            label="Competência"
            >
            <DatePicker
              format="MM/YYYY"
            />
          </Form.Item>
          <Form.Item
            name="observacao"
            label="Observação"
            required
            >
            <Input
              type="text"
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

export default FormProvisao;
