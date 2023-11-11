import { Button, Card, Col, Form, Input, message, Row, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import history from 'history.js';
import InputPrefixo from 'components/inputsBB/InputPrefixo';
import InputPrefixoAlcada from 'components/inputsBB/InputPrefixoAlcada';

import { useSelector } from 'react-redux';
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';
import useUsuarioLogado from 'hooks/useUsuarioLogado';

import {
  gravarParametro,
  getCargosComissoesFot09,
  getJurisdicoesSubordinadas,
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
  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);
  const { idParametro } = parseInt(location.state.id, 10);
  const [, setDadosParametroForm] = useState();
  const [form] = Form.useForm();
  const dadosDoUsuario = useUsuarioLogado();
  const [comissaoDestinoOptions, setComissaoDestinoOptions] = useState([]);
  const [nomeComissaoDestino] = useState('');

  const [prefixoDestino, setPrefixoDestino] = useState('');
  const [prefixosSubordinados, setPrefixosSubordinados] = useState([{}]);

  const initialValues = {
    comissaoDestino: undefined,
    prefixo: prefixoDestino,
  };

  const {
    prefixo: prefixoUsuario,
    matricula,
    nome_usuario: nomeUsuario,
  } = dadosDoUsuario;

  function buscarPrefixosSubordinados(prefixoDestino) {
    if (prefixoDestino.value) {
      setPrefixoDestino(prefixoDestino.value);
      getJurisdicoesSubordinadas(prefixoDestino.value)
        .then((result) => {
          const jurisdicoes = result.map((item) => item.prefixo_subordinada);
          setPrefixosSubordinados(jurisdicoes);
          console.log(jurisdicoes);
        })
        .catch(() => {
          setPrefixosSubordinados([]);
        });
    } else {
      setPrefixosSubordinados([]);
    }
  }

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
    const dadosForm = form.getFieldsValue();
    const { prefixoDestino } = dadosForm;

    const dadosParametro = {
      ...dadosForm,
      prefixoDestino: dadosForm.prefixoDestino?.value,
      nomePrefixo: prefixoDestino?.label?.slice(2).toString(),
      comite: dadosForm.comite?.value,
      nomeComite: dadosForm.comite?.label?.slice(2).toString(),
    };

    if (
      permissao.includes('PARAM_ALCADAS_ADMIN') ||
      (permissao.includes('PARAM_ALCADAS_USUARIO') &&
        prefixoUsuario === prefixoDestino.value)
    ) {
      form
        .validateFields()
        .then((dadosForm) => {
          const prefixoDestinoValue = dadosForm.prefixoDestino?.value;

          if (
            prefixoDestinoValue &&
            !prefixosSubordinados.some(
              (prefixoSubordinado) =>
                prefixoSubordinado === prefixoDestinoValue,
            ) &&
            !permissao.includes('PARAM_ALCADAS_ADMIN') // Verifica se não é um ADMIN
          ) {
            message.error('Prefixo de destino não vinculado à jurisdição.');
            return;
          }

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
  }

  useEffect(() => {
    if (prefixoDestino.value) {
      buscarPrefixosSubordinados(prefixoDestino.value);
      getJurisdicoesSubordinadas(prefixoDestino.value)
        .then((jurisdicoes) => {
          setPrefixosSubordinados(jurisdicoes);
          console.log(jurisdicoes)
        })
        .catch(() => {
          setPrefixosSubordinados([]);
        });
    }
  }, []);

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
              onChange={(cod_dependencia) => {
                setPrefixoDestino(cod_dependencia.value);
                buscarPrefixosSubordinados(cod_dependencia);
                buscarComissaoDestino(cod_dependencia.value);
              }}
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