// @ts-nocheck
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import history from 'history.js';
import InputPrefixo from 'components/inputsBB/InputPrefixo';
import {
  getOpcoesFormulario,
  gravarOrcamento,
  patchOrcamento,
} from '../../apiCalls/apiCalls';
import './index.css';

const { Option } = Select;

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

function FormOrcamento({ location }) {
  const idProjeto = parseInt(location.state.idProjeto, 10);
  const id = Number(location.state.id || 0);
  const {
    prefixo, nomePrefixo, valorOrcamento, observacao
  } = location.state;
  const [incluidoOrcMkt, setIncluidoOrcMkt] = useState(location.state.incluidoOrcMkt);
  const [, setDadosOrcamentoForm] = useState();
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

  function gravaEditaOrcamento() {
    const dadosForm = form.getFieldsValue();
    // location.state.record;

    const dadosOrcamento = {
      ...dadosForm,
      prefixoOrigem: dadosForm.prefixo.value,
      nomePrefixoOrigem: dadosForm.prefixo.label.slice(2).toString(),
      id,
    };

    if (id) {
      patchOrcamento(dadosOrcamento)
        .then((dadosOrcamentoForm) => {
          setDadosOrcamentoForm(dadosOrcamentoForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao editar orçamento!'));
    } else {
      gravarOrcamento({ ...dadosOrcamento, idProjeto })
        .then((dadosOrcamentoForm) => {
          setDadosOrcamentoForm(dadosOrcamentoForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao gravar orçamento!'));
    }
  }

  const selecionaOpcao = (event) => {
    setIncluidoOrcMkt({
      [event.name]: event.value,
    });
  };

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
            prefixo,
            nomePrefixo,
            incluidoOrcMkt,
            valorOrcamento,
            observacao,
          }}
          form={form}
          {...layout}
          name="control-ref"
          onFinish={gravaEditaOrcamento}
      >
          <Form.Item
            valuePropName="value"
            name="prefixo"
            label="Prefixo Origem"
            rules={[
              {
                required: true,
                message: 'Por favor, selecione o prefixo!',
              },
            ]}
          >
            <InputPrefixo
              labelInValue
              placeholder="Prefixo/Nome"
              defaultOptions={[
                {
                  prefixo: location.state.prefixoOrigem,
                  nome: location.state.nomePrefixoOrigem
                }
              ]}

              />
          </Form.Item>
          <Form.Item
            name="incluidoOrcMkt"
            label="Orçamento Remanejado (ORC) Cadastrado MKT ?"
            required
            >
            <Select
              onChange={selecionaOpcao}
              defaultValue={location.state.incluidoOrcMkt}
              placeholder="Selecione uma opção"
            >
              <Option value="SIM">SIM</Option>
              <Option value="NÃO">NÃO</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="valorOrcamento"
            label="Valor do Orçamento"
            higth="150px"
            required
            >
            <InputNumber
              valuePropName="value"
              prefix="R$"
              block
              placeholder="Digite o valor do orçamento!"
              style={{ width: '100%' }}
              decimalSeparator=","
            />
          </Form.Item>
          <Form.Item
            name="observacao"
            label="Observação"
            >
            <Input
              type="text"
              required
              placeholder="Observação!"
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
              style={{ borderRadius: 3 }}
              type="danger"
              onClick={() => history.goBack()}>
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default FormOrcamento;
