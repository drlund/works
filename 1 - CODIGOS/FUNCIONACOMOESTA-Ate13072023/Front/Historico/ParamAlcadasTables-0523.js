/* eslint-disable no-console */
/* eslint-disable no-shadow */
// @ts-nocheck
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    message,
    Row,
  } from 'antd';
  import React, { useState, useEffect } from 'react';
  import history from 'history.js';
  import InputPrefixo from 'components/inputsBB/InputPrefixo';
  // import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';
  import useUsuarioLogado from 'hooks/useUsuarioLogado';
  import {
    gravarParametro, patchParametro, getParametros
  } from '../../apiCalls/apiParamAlcadas'
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
  
  function FormParamAlcadas({ match}) {
    const {
      prefixoDestino, nomePrefixo, comissaoDestino, nomeComissaoDestino, comite, nomeComite, observacao,
    } = match.params;
    const [, setDadosParametroForm] = useState();
    const {idParametro} = parseInt(match.params.id, 10 || 0);
    // const [, setData] = useState([]);
    const [form] = Form.useForm();
    const dadosDoUsuario = useUsuarioLogado();
  
    useEffect(() => {
      if (![null, undefined, 'NaN'].includes()) {
        dadosDoUsuario();
      }
    }, []);

    const {matricula, nome_usuario: nomeUsuario } = dadosDoUsuario;
  
    function gravaEditaParametros() {
      const dadosForm = form.getFieldsValue();
      // location.state.record;
  
      const dadosParametro = {
        ...dadosForm,
        prefixoDestino: dadosForm.prefixo.value,
        nomePrefixo: dadosForm.prefixo.label.slice(2).toString(),
        idParametro,
      };
  
      if (idParametro) {
        patchParametro(dadosParametro)
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
              prefixoDestino,
              nomePrefixo,
              comissaoDestino,
              nomeComissaoDestino,
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
              valuePropName="value"
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
                    prefixo: match.params.prefixoDestino,
                    nome: match.params.nomePrefixo
                  }
                ]}
  
                />
            </Form.Item>
            <Form.Item
              name="comissaoDestino"
              label="Comissão Destino"
              required
              >
              <Input
                type="text"
                required
                placeholder="Comissão"
              />
            </Form.Item>
            <Form.Item
              name="nomeComissaoDestino"
              label="Nome da Comissão"
              higth="150px"
              required
              >
              <Input
                type="text"
                required
                placeholder="Nome da comissão"
              />
            </Form.Item>
            <Form.Item
              name="comite"
              label="Comitê"
              higth="150px"
              required
              >
              <Input
                type="text"
                required
                placeholder="Comitê"
              />
            </Form.Item>
            <Form.Item
              name="nomeComite"
              label="Nome do comitê"
              higth="150px"
              required
              >
              <Input
                type="text"
                required
                placeholder="Nome do comitê"
              />
            </Form.Item>
            <Form.Item
              name="observacao"
              label="Observação"
              >
                        <TextArea rows={4}type="text" placeholder="Observação!"/>
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
  
  export default FormParamAlcadas;