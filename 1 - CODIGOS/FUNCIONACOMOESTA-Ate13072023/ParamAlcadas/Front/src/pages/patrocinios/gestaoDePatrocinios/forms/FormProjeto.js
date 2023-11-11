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
import moment from 'moment';
import { getOpcoesFormulario, patchEditaGestao } from '../../apiCalls/apiCalls';
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

function FormProjeto({ match, location }) {
  const idSolicitacao = parseInt(match.params.idSolicitacao, 10);
  const {
    dataSac, notaTecnicaAssinada, idSituacaoProjeto, idSituacaoProvisao, publicoProjeto
  } = location.state.gestao[0];
  const [, setSelecionadoProvisao] = useState([]);
  const [situacaoDoProjeto, setSituacaoDoProjeto] = useState([]);
  const [situacaoDaProvisao, setSituacaoDaProvisao] = useState([]);
  const [, setDadosGestaoForm] = useState();
  const [nomeEvento, setNomeEvento] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getOpcoesFormGestao(idSolicitacao);
  }, [idSolicitacao]);

  const getOpcoesFormGestao = (id) => {
    getOpcoesFormulario(id)
      .then((opcoesForm) => {
        setNomeEvento(opcoesForm.nomeEvento);
        setSituacaoDoProjeto(opcoesForm.opcoesFormGestao);
        setSituacaoDaProvisao(opcoesForm.opcoesFormProvisao);
      })
      .catch(() => message.error('Falha ao obter lista de opções!'));
  };

  function editaGestao() {
    const dadosForm = form.getFieldsValue();

    const dadosGestao = {
      ...dadosForm,
      dataSac: moment(dadosForm.dataSac).format(
        'YYYY-MM-DD HH:mm',
      ),
      idSolicitacao,
    };

    if (idSolicitacao) {
      patchEditaGestao(dadosGestao)
        .then((dadosGestaoForm) => {
          setDadosGestaoForm(dadosGestaoForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao editar projeto!'));
    }
  }

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
          {...layout}
          name="control-ref"
          form={form}
          initialValues={{
            dataSac: moment(dataSac),
            notaTecnicaAssinada,
            idSituacaoProjeto,
            idSituacaoProvisao,
            publicoProjeto,
          }}
          onFinish={editaGestao}
          >
          <Form.Item
            label="Data SAC"
            name="dataSac"
          >
            <DatePicker
              format="DD/MM/YYYY"
            />
          </Form.Item>
          <Form.Item
            valuePropName="defaultValue"
            label="A Nota técnica foi assinada?"
            name="notaTecnicaAssinada">
            <Select
              placeholder="Selecione Sim ou Não"
            >
              <Option value="SIM">SIM</Option>
              <Option value="NÃO">NÃO</Option>
            </Select>
          </Form.Item>
          <Form.Item
            valuePropName="defaultValue"
            label="Situação do Projeto"
            name="idSituacaoProjeto"
          >
            <Select
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
            valuePropName="defaultValue"
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
          <Form.Item
            valuePropName="defaultValue"
            label="Público Alvo"
            name="publicoProjeto"
          >
            <Select
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
              htmlType="submit"
            >
              Salvar
            </Button>
            <Button
              style={{ borderRadius: 3, textDecoration: 'bold' }}
              htmlType="button"
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

export default FormProjeto;
