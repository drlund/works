import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import history from 'history.js';
import InputPrefixo from 'components/inputsBB/InputPrefixo';
import useUsuarioLogado from 'hooks/useUsuarioLogado';
import {
  gravarParametro,
  patchParametros,
} from '../../apiCalls/apiParamAlcadas';
import './ParamAlcadasForm.css';

const { TextArea } = Input;

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

function FormParamAlcadas({ location }) {
  const { idParametro } = parseInt(location.state.id, 10 || 0);
  const id = parseInt(location.state.id, 10);
  const {
    prefixoDestino,
    nomePrefixo,
    comissaoDestino,
    nomeComissaoDestino,
    comite,
    nomeComite,
    observacao,
  } = location.state;
  const [, setDadosParametroForm] = useState();
  const [form] = Form.useForm();
  const dadosDoUsuario = useUsuarioLogado();

  useEffect(() => {
    if (![null, undefined, 'NaN'].includes()) {
      dadosDoUsuario(id);
    }
  }, [id]);

  const { matricula, nome_usuario: nomeUsuario } = dadosDoUsuario;
  const [observacaoValue, setObservacaoValue] = useState('');

  useEffect(() => {
    if (id) {
      setObservacaoValue(observacao);
    }
  }, [id, observacao]);

  const onFinish = (values) => {
    const dadosForm = values;

    const dadosParametro = {
      ...dadosForm,
      prefixoDestino: dadosForm.prefixoDestino.value,
      nomePrefixo: dadosForm.prefixoDestino.label?.slice(2).toString(),
      comite: dadosForm.comite.value,
      nomeComite: dadosForm.comite.label?.slice(2).toString(),
      id,
    };

    if (id) {
      patchParametros(dadosParametro)
        .then((dadosParametroForm) => {
          setDadosParametroForm(dadosParametroForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao editar parâmetro!'));
    } else {
      gravarParametro({ ...dadosParametro, idParametro })
        .then((dadosParametroForm) => {
          setDadosParametroForm(dadosParametroForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao gravar parâmetro!'));
    }
  };

  return (
    <>
      <Card>
        <Row>
          <Col span={12}>{`Matrícula: ${matricula}`}</Col>
          <Col span={12}>{`Nome: ${nomeUsuario}`}</Col>
        </Row>
      </Card>
      <Card>
        <Form
          initialValues={{
            prefixoDestino,
            nomePrefixo,
            comissaoDestino,
            nomeComissaoDestino,
            comite,
            nomeComite,
            observacao: observacaoValue,
          }}
          form={form}
          {...layout}
          name="control-ref"
          onFinish={onFinish}
        >
          <Form.Item
            name="prefixoDestino"
            label="Prefixo Destino"
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
                  prefixo: location.state.prefixoDestino,
                  nome: location.state.nomePrefixo,
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="comissaoDestino"
            label="Comissão Destino"
            required
          >
            <Input type="text" required placeholder="Comissão" />
          </Form.Item>
          <Form.Item
            name="nomeComissaoDestino"
            label="Nome da Comissão"
            required
          >
            <Input type="text" required placeholder="Nome da comissão" />
          </Form.Item>
          <Form.Item
            name="comite"
            label="Comitê/Nome comitê"
            required
          >
            <InputPrefixo
              labelInValue
              placeholder="Comitê/Nome"
              defaultOptions={[
                {
                  prefixo: location.state.comite,
                  nome: location.state.nomeComite,
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="observacao"
            label="Observação"
            rules={[
              {
                required: true,
                message: 'Por favor, digite uma observação!',
              },
            ]}
          >
            <TextArea rows={4} type="text" placeholder="Observação!" />
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

export default FormParamAlcadas;