import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import history from 'history.js';
import InputPrefixo from 'components/inputsBB/InputPrefixo';
import useUsuarioLogado from 'hooks/useUsuarioLogado';
import InputPrefixoAlcada from './InputPrefixoAlcada';
import {
  patchParametros,
  listaComiteParamAlcadas,
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

/**
 * @typedef {Object} LocationState
 * @property {string} id
 * @property {string} prefixoDestino
 * @property {string} nomePrefixo
 * @property {string} comissaoDestino
 * @property {string} nomeComissaoDestino
 * @property {string} nomeComite
 * @property {string} observacao
 * 
 */

/**
 * @param {Object} props
 * @param {object} props.location
 * @param {LocationState} props.location.state
 */

function FormParamAlcadasPatch({ location }) {
  const id = parseInt(location.state.id, 10);
  const {
    prefixoDestino,
    nomePrefixo,
    comissaoDestino,
    nomeComissaoDestino,
    nomeComite,
    observacao,
  } = location.state;
  const [, setDadosParametroForm] = useState();
  const [form] = Form.useForm();
  const dadosDoUsuario = useUsuarioLogado();

  const [comite, setComite] = useState('');
  const [temComite, setTemComite] = useState(false);

  const [erroObservacao, setErroObservacao] = useState('');

  const handleObservacaoChange = (/** @type {{ target: { value: React.SetStateAction<string>; }; }} */ e) => {
    setObservacaoValue(e.target.value);
    setErroObservacao('');
  };

  const handleObservacaoValidate = (/** @type {any} */ _, /** @type {any} */ value) => {
    if (!value) {
      setErroObservacao('Preenchimento obrigatório do campo observação.');
      return Promise.reject('Preenchimento obrigatório do campo observação.');
    }
    return Promise.resolve();
  };

  const { matricula, nome_usuario: nomeUsuario } = dadosDoUsuario;
  const [observacaoValue, setObservacaoValue] = useState('');

  useEffect(() => {
    if (id) {
      setObservacaoValue(observacao);
    }
  }, [id, observacao]);

  /**
   * @param {{ value: React.SetStateAction<string>; }} comite
   */
  function buscarComites(comite) {
    if (comite.value) {
      setComite(comite.value);
      listaComiteParamAlcadas(comite.value)
        .then((result) => {
          const comitePrefixo = result.map((/** @type {{ PREFIXO: number; }} */ item) => item.PREFIXO);
          setTemComite(comitePrefixo);
        })
        .catch(() => {
          setTemComite([]);
        });
    } else {
      setTemComite([]);
    }
  }

  const editaParametro = (/** @type {any} */ values) => {
    const dadosForm = values;

    const dadosParametro = {
      ...dadosForm,
      prefixoDestino: dadosForm.prefixoDestino.value,
      nomePrefixo: dadosForm.prefixoDestino.label?.slice(2).toString(),
      comite: dadosForm.comite.value,
      nomeComite: dadosForm.comite.label?.slice(2).toString(),
      id,
    };

    if (comite && temComite.length < 1 && !temComite.includes(comite)) {
      message.error('Prefixo não possui comitê!');
      return;
    }

    if (id) {
      patchParametros(dadosParametro)
        .then((dadosParametroForm) => {
          setDadosParametroForm(dadosParametroForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao editar parâmetro!'));
    }
  };

  return (
    <>
      <Card>
        <Row>
          <Col span={12}>{`Matrícula: ${matricula} `}</Col>
          <Col span={12}>{`Nome : ${nomeUsuario} `}</Col>
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
            dadosDoUsuario,
          }}
          form={form}
          {...layout}
          name="control-ref"
          onFinish={editaParametro}
        >
          <Form.Item
            name="prefixoDestino"
            label="Prefixo Destino"
            rules={[
              {
                message: 'Por favor, selecione o prefixo!',
              },
            ]}
          >
            <InputPrefixo
              disabled={id !== 0}
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
          <Form.Item name="comissaoDestino" label="Comissão Destino">
            <Input type="text" placeholder="Comissão" disabled={id !== 0} />
          </Form.Item>
          <Form.Item
            name="nomeComissaoDestino"
            label="Nome da Comissão"
          >
            <Input
              type="text"
              placeholder="Nome da comissão"
              disabled={id !== 0}
            />
          </Form.Item>
          <Form.Item
            name="comite"
            label="Comitê/Nome comitê"
            required
          >
            <InputPrefixoAlcada
              labelInValue
              placeholder="Comitê/Nome"
              defaultOptions={[
                {
                  prefixo: location.state.comite,
                  nome: location.state.nomeComite,
                },
              ]}
              nomeComite={nomeComite}
              value={comite}
              onChange={(/** @type {React.SetStateAction<string>} */ comite) => {
                setComite(comite);
                buscarComites(comite);
              }}
            />
          </Form.Item>
          <Form.Item
            name="observacao"
            label="Observação"
            required
            rules={[
              {
                required: true,
                validator: handleObservacaoValidate,
              },
            ]}
            validateStatus={erroObservacao ? 'error' : ''}
            help={erroObservacao}
          >
            <TextArea
              rows={4}
              type="text"
              placeholder="Preenchimento obrigatório!"
              allowClear
              value={observacaoValue}
              onChange={handleObservacaoChange}
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

export default FormParamAlcadasPatch;
