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

  const [prefixo, setPrefixo] = useState('');
  const [prefixosSubordinados, setPrefixosSubordinados] = useState([]);

  const initialValues = {
    comissaoDestino: undefined,
    prefixo: prefixo,
  };

  const {
    prefixo: prefixoUsuario,
    matricula,
    nome_usuario: nomeUsuario,
  } = dadosDoUsuario;

  function buscarPrefixosSubordinados(prefixo) {
    if (prefixo) {
      setPrefixo(prefixo);
      getJurisdicoesSubordinadas(prefixo)
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

  function buscarComissaoDestino(prefixo) {
    if (prefixo) {
      getCargosComissoesFot09(prefixo)
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
      form.setFieldsValue({ nomePrefixo: prefixo });
    } else {
      form.setFieldsValue({ nomeComissaoDestino: '' });
      form.setFieldsValue({ nomePrefixo: '' });
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const parametro = await getParametro(idParametro);
        setDadosParametroForm(parametro);
        form.setFieldsValue({
          nome: parametro.nome_parametro,
          prefixo: parametro.prefixo,
          comissaoOrigem: parametro.comissao_origem,
          comissaoDestino: parametro.comissao_destino,
          valorLimite: parametro.valor_limite,
          observacao: parametro.observacao,
        });
        setPrefixo(parametro.prefixo);
        buscarComissaoDestino(parametro.prefixo);
      } catch (error) {
        message.error('Falha ao buscar parâmetro!');
      }
    }

    fetchData();
  }, [form, idParametro]);

  const onFinish = async (values) => {
    const {
      nome,
      prefixo,
      comissaoOrigem,
      comissaoDestino,
      valorLimite,
      observacao,
    } = values;

    const parametro = {
      id: idParametro,
      nome_parametro: nome,
      prefixo,
      comissao_origem: comissaoOrigem,
      comissao_destino: comissaoDestino,
      valor_limite: valorLimite,
      observacao,
      usuario_atualizacao: matricula,
    };

    try {
      await gravarParametro(parametro);
      message.success('Parâmetro gravado com sucesso!');
      history.goBack();
    } catch (error) {
      message.error('Falha ao gravar parâmetro!');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card
      title={
        <div>
          Parâmetros de Alçada
          <br />
          <small>
            Usuário:
            {nomeUsuario} - Matrícula:
            {matricula}
          </small>
        </div>
      }
      extra={
        <Button
          type="default"
          htmlType="button"
          onClick={() => history.goBack()}
          style={{ marginRight: 8 }}
        >
          Voltar
        </Button>
      }
    >
      <Form
        {...layout}
        form={form}
        name="parametroAlcadas"
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row>
          <Col span={12}>
            <Form.Item
              label="Nome"
              name="nome"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira o nome!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Prefixo"
              name="prefixo"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira o prefixo!',
                },
              ]}
            >
              <InputPrefixoAlcada
                prefixo={prefixo}
                onChange={buscarComissaoDestino}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Comissão Origem"
              name="comissaoOrigem"
              rules={[
                {
                  required: true,
                  message: 'Por favor, selecione a comissão origem!',
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Selecione a comissão origem"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {permissao === 'TODAS' ? (
                  <Select.Option value="todas">Todas</Select.Option>
                ) : null}
                {comissaoDestinoOptions.map((option) => (
                  <Select.Option key={option.cod_cargo} value={option.cod_cargo}>
                    {option.nome_cargo}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Comissão Destino"
              name="comissaoDestino"
              rules={[
                {
                  required: true,
                  message: 'Por favor, selecione a comissão destino!',
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Selecione a comissão destino"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                onChange={handleComissaoDestinoChange}
              >
                {comissaoDestinoOptions.map((option) => (
                  <Select.Option key={option.cod_cargo} value={option.cod_cargo}>
                    {option.nome_cargo}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Valor Limite"
              name="valorLimite"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira o valor limite!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Observação"
              name="observacao"
            >
              <TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default FormParamAlcadas;