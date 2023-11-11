/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable no-shadow */

import { Button, Card, Col, Form, Input, message, Row, Select } from 'antd';
import React, { useState, useEffect } from 'react';
// @ts-ignore
import history from 'history.js';
// @ts-ignore
import InputPrefixoAlcada from 'components/inputsBB/InputPrefixoAlcada';
import useUsuarioLogado from 'hooks/useUsuarioLogado';
import {
  gravarParametro,
  getCargosComissoesFot09,
  getJurisdicoesSubordinadas,
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


// @ts-ignore
function FormParamAlcadas({ location }) {
  // @ts-ignore
  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);
  // @ts-ignore
  const { idParametro } = parseInt(location.state.id, 10);
  const [, setDadosParametroForm] = useState();
  const [form] = Form.useForm();
  const dadosDoUsuario = useUsuarioLogado();
  const [comissaoDestinoOptions, setComissaoDestinoOptions] = useState([]);
  const [, setJurisdicaoUsuario] = useState('');
  const [nomeComissaoDestino] = useState('');

  const [prefixoDestino, setPrefixoDestino] = useState('');
  const [comite, setComite] = useState('');

  const [prefixosSubordinados, setPrefixosSubordinados] = useState([]);
  const [temComite, setTemComite] = useState(false);

  const initialValues = {
    // @ts-ignore
    comissaoDestino: undefined,
    prefixo: prefixoDestino ,
  };

  const {
    prefixo: prefixoUsuario,
    matricula,
    nome_usuario: nomeUsuario,
  } = dadosDoUsuario;

  useEffect(() => {
    // @ts-ignore
    if (![null, undefined, 'NaN'].includes()) {
      getJurisdicoesSubordinadas(prefixoDestino)
        .then((jurisdicoes) => {
          setJurisdicaoUsuario(jurisdicoes[0]);
        })
        .catch(() => {
          setJurisdicaoUsuario('');
        });
    }
  }, []);

  // @ts-ignore
  function buscarComites(comite) {
    if (comite.value) {
      setComite(comite.value);
      listaComiteParamAlcadas(comite.value)
        .then((result) => {
          // @ts-ignore
          const comitePrefixo = result.map((item) => item.MATRICULA_MEMBRO);
          setTemComite(comitePrefixo);
        })
        .catch(() => {
          // @ts-ignore
          setTemComite([]);
        });
    } else {
      // @ts-ignore
      setTemComite([]);
    // @ts-ignore
    } if (setComite(Array.length <= 1)){
      message.error('Prefixo não possui comitê!');
    }
  
  }

  // @ts-ignore
  function buscarPrefixosSubordinados(prefixoDestino) {
    if (prefixoDestino.value) {
      setPrefixoDestino(prefixoDestino.value);
      getJurisdicoesSubordinadas(prefixoDestino.value)
        .then((result) => {
          // @ts-ignore
          const jurisdicoes = result.map((item) => item.prefixo_subordinada);
          setPrefixosSubordinados(jurisdicoes);
        })
        .catch(() => {
          setPrefixosSubordinados([]);
        });
    } else {
      setPrefixosSubordinados([]);
    }
  }

  // @ts-ignore
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

  // @ts-ignore
  function handleComissaoDestinoChange(value) {
    const selectedOption = comissaoDestinoOptions.find(
      (option) => option.cod_cargo === value,
    );
    if (selectedOption) {
      form.setFieldsValue({ nomeComissaoDestino: selectedOption.nome_cargo });
      // @ts-ignore
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
      // @ts-ignore
      comite: comite?.value,
      // @ts-ignore
      nomeComite: comite?.label?.slice(2).toString(),
    };

    if (
      permissao.includes('PARAM_ALCADAS_ADMIN') ||
      (permissao.includes('PARAM_ALCADAS_USUARIO') &&
        prefixoUsuario === prefixoDestino?.value)
    ) {
      form
        .validateFields()
        .then(() => {
          const prefixoDestino = dadosForm.prefixoDestino?.value;
          const comite = dadosForm.comite?.value;
          if (
            prefixoDestino &&
            !prefixosSubordinados.includes(prefixoDestino)
          ) {
            message.error('Prefixo de destino não vinculado à jurisdição.');
            return;
          }

          // @ts-ignore
          if (comite && temComite.length < 1 && !temComite.includes(comite)) {
            message.error('Prefixo não possui comitê!');
            return;
          }          

          gravarParametro({ ...dadosParametro, idParametro })
            .then((dadosParametroForm) => {
              setDadosParametroForm(dadosParametroForm);
              history.goBack();
            })
            .catch(() => message.error('Falha ao gravar parâmetro! Provavelmente entrada duplicada. Verifique!'));
        })
        .catch((error) => {
          error('Erro de validação:', error);
        });
    } else {
      message.error('Prefixo de destino não vinculado à jurisdição.');
    }
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
              // @ts-ignore
              onChange={(cod_dependencia) => {
                setPrefixoDestino(cod_dependencia.value);
                buscarPrefixosSubordinados(cod_dependencia);
                buscarComissaoDestino(cod_dependencia.value);
              }}
            />
          </Form.Item>
          <Form.Item name="comissaoDestino" label="Comissão Destino" required>
            <Select
              options={comissaoDestinoOptions.map((option) => ({
                value: option.cod_cargo,
                label: `${option.cod_cargo} - ${option.nome_cargo}`,
              }))}
              placeholder="Selecione a comissão destino"
              onChange={handleComissaoDestinoChange}
            />
          </Form.Item>
          <Form.Item
            name="nomeComissaoDestino"
            label="Nome da Comissão"
            // @ts-ignore
            higth="150px"
            visible="false"
            hidden
            required
          >
            <Input value={nomeComissaoDestino} disabled  />
          </Form.Item>
          <Form.Item
            name="comite"
            label="Comitê/Nome comitê"
            // @ts-ignore
            higth="150px"
            required
          >
            <InputPrefixoAlcada
              labelInValue
              placeholder="Comitê/Nome"
              value={comite}
              // @ts-ignore
              onChange={(comite) => {
                setComite(comite);
                buscarComites(comite);
                setComite(comite);
              }}
            />
          </Form.Item>
          <Form.Item name="observacao" label="Observação">
            <TextArea rows={4} 
// @ts-ignore
            type="text" placeholder="Observação!" />
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
              // @ts-ignore
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