import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import history from 'history.js';
import InputPrefixo from 'components/inputsBB/InputPrefixo';
import useUsuarioLogado from 'hooks/useUsuarioLogado';
import {
  gravarParametro,
  getCargosComissoesFot09
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
    comissaoDestino,
    nomeComissaoDestino,
    comite,
    nomeComite,
    observacao,
  } = location.state;
  const [, setDadosParametroForm] = useState();
  const [form] = Form.useForm();
  const dadosDoUsuario = useUsuarioLogado();
  const [comissaoDestinoData, setComissaoDestinoData] = useState({ comissao: '', nomeComissao: '' });

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
          if (result.length > 0) {
            const { comissao, nomeComissao } = result[0];
            setComissaoDestinoData({ comissao, nomeComissao });
          } else {
            setComissaoDestinoData({ comissao: '', nomeComissao: '' });
          }
        })
        .catch(() => {
          setComissaoDestinoData({ comissao: '', nomeComissao: '' });
          message.error('Falha ao buscar comissão destino!');
        });
    } else {
      setComissaoDestinoData({ comissao: '', nomeComissao: '' });
    }
  }

  function gravaEditaParametros() {
    const dadosForm = form.getFieldsValue();

    const dadosParametro = {
      ...dadosForm,
      prefixoDestino: dadosForm.prefixoDestino.value,
      nomePrefixo: dadosForm.prefixoDestino.label?.slice(2).toString(),
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
          initialValues={{
            comissaoDestino: comissaoDestinoData.comissao,
            nomeComissaoDestino: comissaoDestinoData.nomeComissao,
            comite,
            nomeComite,
            observacao,
          }}
          form={form}
          {...layout}
          name="control-ref"
          onFinish={gravaEditaParametros}
        >
          <Form.Item
            name="prefixoDestino"
            label="Prefixo Destino"
            rules={[
              {
                required: true,
                message: 'Por favor, digite o prefixo!',
              },
            ]}
          >
            <Input
              placeholder="Prefixo"
              onChange={(e) => buscarComissaoDestino(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="comissaoDestino" label="Comissão Destino" required>
            <Input type="text" required placeholder="Comissão" />
          </Form.Item>
          <Form.Item
            name="nomeComissaoDestino"
            label="Nome da Comissão"
            higth="150px"
            required
          >
            <Input type="text" required placeholder="Nome da comissão" />
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