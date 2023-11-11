import { Button, Card, Col, Form, Input, message, Row, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import history from 'history.js';
import InputPrefixo from 'components/inputsBB/InputPrefixo';
import InputPrefixoAlcada from 'components/inputsBB/InputPrefixoAlcada';
import useUsuarioLogado from 'hooks/useUsuarioLogado';

import {
  gravarParametro,
  getCargosComissoesFot09,
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
  const { idParametro } = parseInt(location.state.id, 10);
  const id = parseInt(location.state.id, 10);
  const [, setDadosParametroForm] = useState();
  const { prefixoDestino } = location.state;
  const [form] = Form.useForm();
  const dadosDoUsuario = useUsuarioLogado();
  const [comissaoDestinoOptions, setComissaoDestinoOptions] = useState([]);
  const [nomeComissaoDestino] = useState('');

  const initialValues = {
    comissaoDestino: undefined,
  };

  useEffect(() => {
    if (![null, undefined, 'NaN'].includes()) {
      dadosDoUsuario(id);
    }
  }, [id]);

  const { matricula, nome_usuario: nomeUsuario } = dadosDoUsuario;

  function buscarComissaoDestino(cod_dependencia) {
    if (cod_dependencia) {
      getCargosComissoesFot09(cod_dependencia)
        .then((result) => {
          setComissaoDestinoOptions(result);
        })
        .catch(() => {
          setComissaoDestinoOptions([]);
          message.error('Falha ao buscar comissão destino!');
        });
    } else {
      setComissaoDestinoOptions([]);
    }
  }

  function handleComissaoDestinoChange(value) {
    const selectedOption = comissaoDestinoOptions.find(
      (option) => option.cod_cargo === value,
    );
    if (selectedOption) {
      form.setFieldsValue({ nomeComissaoDestino: selectedOption.nome_cargo });
      form.setFieldsValue({ nomePrefixo: gravaParametros.nomePrefixo });
    } else {
      form.setFieldsValue({ nomeComissaoDestino: '' });
    }
  }

  function gravaParametros() {
      form
        .validateFields()
        .then((dadosForm) => {
          const dadosParametro = {
            ...dadosForm,
            prefixoDestino: dadosForm.prefixoDestino?.value,
            nomePrefixo: dadosForm.prefixoDestino?.label?.slice(2).toString(),
            comite: dadosForm.comite?.value,
            nomeComite: dadosForm.comite?.label?.slice(2).toString(),
            id,
          };
          gravarParametro({ ...dadosParametro, idParametro })
            .then((dadosParametroForm) => {
              setDadosParametroForm(dadosParametroForm);
              history.goBack();
            })
            .catch(() => message.error('Falha ao gravar parâmetro!'));
        })
        .catch((error) => {
          console.log('Erro de validação:', error);
        });
  }

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
          initialValues={initialValues}
          form={form}
          {...layout}
          name="control-ref"
          onFinish={gravaParametros}
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
            <InputPrefixoAlcada
              labelInValue
              placeholder="Prefixo/Nome"
              value={prefixoDestino}
              onChange={(cod_dependencia) =>
                buscarComissaoDestino(cod_dependencia.value)
              }
              defaultOptions={[
                {
                  prefixo: location.state.prefixoDestino,
                  nome: location.state.nomePrefixo,
                },
              ]}
            />
          </Form.Item>
          <Form.Item name="comissaoDestino" label="Comissão Destino" required>
            <Select
              options={comissaoDestinoOptions.map((option) => ({
                value: option.cod_cargo,
                label: option.cod_cargo,
              }))}
              placeholder="Selecione a comissão destino"
              onChange={handleComissaoDestinoChange}
            />
          </Form.Item>
          <Form.Item
            name="nomeComissaoDestino"
            label="Nome da Comissão"
            higth="150px"
            required
          >
            <Input value={nomeComissaoDestino} disabled />
          </Form.Item>
          <Form.Item
            name="comite"
            label="Comitê/Nome comitê"
            higth="150px"
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
          <Form.Item name="observacao" label="Observação">
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