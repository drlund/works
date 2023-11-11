import {
  Button,
  Card,
  Col,
  Form,
  message,
  Row,
  Select,
  DatePicker,
} from 'antd';
import React, { useEffect, useState } from 'react';
import history from 'history.js';
import { getOpcoesFormulario, gravarGestao } from '../../apiCalls/apiCalls';
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

function FormGestao({ match }) {
  const idSolicitacao = parseInt(match.params.idSolicitacao, 10);
  const [, setSelecionadoProjeto] = useState([]);
  const [, setSelecionadoProvisao] = useState([]);
  const [, setPublicoAlvo] = useState({});
  const [, setDadosForm] = useState(null);
  const [, setDataSac] = useState(null);
  const [situacaoDoProjeto, setSituacaoDoProjeto] = useState([]);
  const [situacaoDaProvisao, setSituacaoDaProvisao] = useState([]);
  const [nomeEvento, setNomeEvento] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getOpcoesFormGestao(idSolicitacao);
  }, []);

  const getOpcoesFormGestao = (id) => {
    getOpcoesFormulario(id)
      .then((opcoesForm) => {
        setNomeEvento(opcoesForm.nomeEvento);
        setSituacaoDoProjeto(opcoesForm.opcoesFormGestao);
        setSituacaoDaProvisao(opcoesForm.opcoesFormProvisao);
      })
      .catch(() => message.error('Falha ao obter lista de opções!'));
  };

  const selecionaOpcao = (event) => {
    setPublicoAlvo({
      [event.name]: event.value,
    });
  };

  const gravarGestaoPatrocinio = (dadosForm) => {
    gravarGestao({ ...dadosForm, idSolicitacao })
      .then(() => {
        setDadosForm(dadosForm);
        history.goBack();
      })
      .catch(() => 'Falha ao gravar início de gestao do patrocínio!');
  };

  return (
    <>
      <Card>
        <Row>
          <Col span={12}>{`Projeto: ${idSolicitacao}`}</Col>
          <Col span={12}>{`Nome do Projeto: ${nomeEvento}`}</Col>
        </Row>
      </Card>
      <Card>
        <Form
          form={form}
          {...layout}
          name="control-ref">
          <Form.Item label="Data SAC" name="dataSac">
            <DatePicker
              format="DD/MM/YYYY"
              onChange={(date) => setDataSac(date)}
            />
          </Form.Item>
          <Form.Item label="A Nota técnica foi assinada?" name="notaTecnica">
            <Select
              onChange={selecionaOpcao}
              placeholder="Selecione Sim ou Não"
            >
              <Option value="SIM">SIM</Option>
              <Option value="NÃO">NÃO</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Situação do Projeto" name="idSituacaoProjeto">
            <Select
              onChange={(value) => setSelecionadoProjeto(value)}
              placeholder="Selecione uma opção uma das opções abaixo"
              allowClear
            >
              {situacaoDoProjeto?.map((opcao) => (
                <Option key={opcao.id} value={opcao.id}>
                  {opcao.descricao}
                </Option>
              )) || []}
            </Select>
          </Form.Item>
          <Form.Item
            label="Situação do Provisionamento"
            name="idSituacaoProvisao"
          >
            <Select
              onChange={(value) => setSelecionadoProvisao(value)}
              placeholder="Selecione uma opção uma das opções abaixo"
            >
              {situacaoDaProvisao?.map((opcao) => (
                <Option key={opcao.id} value={opcao.id}>
                  {opcao.descricao}
                </Option>
              )) || []}
            </Select>
          </Form.Item>
          <Form.Item label="Público Alvo" name="publicoAlvo">
            <Select
              onChange={selecionaOpcao}
              placeholder="Selecione uma opção uma das opções abaixo"
            >
              <Option value="PF">PF</Option>
              <Option value="PJ">PJ</Option>
              <Option value="AGRO">Agro</Option>
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              style={{ marginRight: 10, borderRadius: 3 }}
              type="primary"
              onClick={() => gravarGestaoPatrocinio(form.getFieldsValue())}
            >
              Salvar
            </Button>
            <Button
              style={{ borderRadius: 3, textDecoration: 'bold' }}
              htmlType="button"
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

export default FormGestao;
