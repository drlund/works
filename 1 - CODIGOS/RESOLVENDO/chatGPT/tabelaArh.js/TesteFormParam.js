import { Button, Card, Col, Form, Input, message, Row, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import history from 'history.js';
import InputPrefixo from 'components/inputsBB/InputPrefixo';
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
  const { idParametro } = parseInt(location.state.id, 10 || 0);
  const id = parseInt(location.state.id, 10);
  const { prefixoDestino, nomePrefixo, comite, nomeComite, observacao } =
    location.state;
  const [, setDadosParametroForm] = useState();
  const [form] = Form.useForm();
  const dadosDoUsuario = useUsuarioLogado();
  const [comissaoDestinoOptions, setComissaoDestinoOptions] = useState([]);
  const [nomeComissaoDestino, setNomeComissaoDestino] = useState('');
  const initialValues = {
    prefixoDestino: {
      value: prefixoDestino,
      label: nomePrefixo ? `(${prefixoDestino}) ${nomePrefixo}` : undefined,
    },
    comissaoDestino: undefined,
    comite,
    nomeComite,
    observacao,
  };

  useEffect(() => {
    if (![null, undefined, 'NaN'].includes()) {
      dadosDoUsuario(id);
    }
  }, [id, location.state.nomePrefixo]);

  const { matricula, nome_usuario: nomeUsuario } = dadosDoUsuario;

  function buscarComissaoDestino(cod_dependencia) {
    if (cod_dependencia) {
      getCargosComissoesFot09(cod_dependencia)
        .then((result) => {
          const options = result.map((cargo) => ({
            value: cargo.cod_cargo,
            label: cargo.nome_cargo,
          }));
          setComissaoDestinoOptions(options);
        })
        .catch(() => {
          setComissaoDestinoOptions([]);
          message.error('Falha ao buscar comissão destino!');
        });
    } else {
      setComissaoDestinoOptions([]);
    }
  }

  function handlePrefixoDestinoChange(value) {
    if (value) {
      const { prefixo, nome } = value;
      form.setFieldsValue({ prefixoDestino: { value: prefixo, label: nome } });
      buscarComissaoDestino(prefixo);
    } else {
      form.setFieldsValue({ prefixoDestino: undefined });
      form.setFieldsValue({ comissaoDestino: undefined });
      setComissaoDestinoOptions([]);
      form.setFieldsValue({ nomeComissaoDestino: '' });
    }
  }

  function handleComissaoDestinoChange(value) {
    const selectedOption = comissaoDestinoOptions.find(
      (option) => option.cod_cargo === value,
    );
    if (selectedOption) {
      setNomeComissaoDestino(selectedOption.nome_cargo);
    } else {
      setNomeComissaoDestino('');
    }
  }

  function gravaEditaParametros() {
    const dadosForm = form.getFieldsValue();

    const dadosParametro = {
      ...dadosForm,
      prefixoDestino: dadosForm.prefixoDestino.value,
      nomePrefixo: location.state.nomePrefixo,
      comite: dadosForm.comite.value,
      nomeComite: dadosForm.comite.label?.slice(2).toString(),
      id,
    };
    gravarParametro({ ...dadosParametro, idParametro })
      .then((dadosParametroForm) => {
        setDadosParametroForm(dadosParametroForm);
        history.goBack();
      })
      .catch(() => message.error('Falha ao gravar parâmetro!'));
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
          onFinish={gravaEditaParametros}
        >
          <Form.Item
            name="prefixoDestino"
            label="Prefixo"
            rules={[
              {
                required: true,
                message: 'Por favor, selecione o prefixo!',
              },
            ]}
          >
            <InputPrefixo
              // disabled
              labelInValue
              placeholder="Prefixo/Nome"
              defaultOptions={[
                {
                  prefixo: location.state.prefixoDestino,
                  nome: location.state.nomePrefixo,
                },
              ]}
              onChange={handlePrefixoDestinoChange}
            />
          </Form.Item>
          <Form.Item
            name="comissaoDestino"
            label="Comissão Destino"
            rules={[
              {
                required: true,
                message: 'Por favor, selecione a comissão destino!',
              },
            ]}
          >
            <Select
              options={comissaoDestinoOptions}
              placeholder="Selecione a comissão destino"
              onChange={handleComissaoDestinoChange}
            />
          </Form.Item>
          <Form.Item
            name="nomeComissaoDestino"
            label="Nome da Comissão"
            required
          >
            <Input value={nomeComissaoDestino} disabled />
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
          <Form.Item name="observacao" label="Observação">
            <TextArea rows={4} placeholder="Observação!" />
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
// 17/06/2023