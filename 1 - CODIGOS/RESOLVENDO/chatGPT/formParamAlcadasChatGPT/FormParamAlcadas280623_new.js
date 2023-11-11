import { Button, Card, Col, Form, Input, message, Row, Select } from "antd";
import React, { useState, useEffect } from "react";
import history from "history.js";
import InputPrefixo from "components/inputsBB/InputPrefixo";
import InputPrefixoAlcada from "components/inputsBB/InputPrefixoAlcada";

import { useSelector } from "react-redux";
import { getPermissoesUsuario } from "utils/getPermissoesUsuario";
import useUsuarioLogado from "hooks/useUsuarioLogado";

import {
  gravarParametro,
  getCargosComissoesFot09,
  getJurisdicoesSubordinadas,
} from "../../apiCalls/apiParamAlcadas";
import "./ParamAlcadasForm.css";

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
  const permissao = getPermissoesUsuario("Movimentações", authState);
  const { idParametro } = parseInt(location.state.id, 10);
  const [, setDadosParametroForm] = useState();
  const [form] = Form.useForm();
  const dadosDoUsuario = useUsuarioLogado();
  const [comissaoDestinoOptions, setComissaoDestinoOptions] = useState([]);
  const [nomeComissaoDestino] = useState("");

  const [prefixo, setPrefixo] = useState("");
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
          message.error("Falha ao buscar comissão destino!");
        });
    } else {
      setComissaoDestinoOptions([]);
    }
  }

  function handleComissaoDestinoChange(value) {
    const selectedOption = comissaoDestinoOptions.find(
      (option) => option.cod_cargo === value
    );
    if (selectedOption) {
      form.setFieldsValue({ nomeComissaoDestino: selectedOption.nome_cargo });
      form.setFieldsValue({ nomePrefixo: prefixo });
    } else {
      form.setFieldsValue({ nomeComissaoDestino: "" });
    }
  }

  function handlePrefixoChange(value) {
    buscarComissaoDestino(value);
    buscarPrefixosSubordinados(value);
  }

  useEffect(() => {
    if (idParametro) {
      // Simulando uma chamada assíncrona para buscar os dados do parâmetro
      setTimeout(() => {
        const dadosParametro = {
          comissaoDestino: "123",
          prefixo: "ABC",
          observacao: "Observação de exemplo",
        };
        setDadosParametroForm(dadosParametro);
        form.setFieldsValue(dadosParametro);
      }, 500);
    }
  }, [idParametro, form]);

  function handleSubmit(values) {
    const { comissaoDestino, prefixo, observacao } = values;

    const parametros = {
      idParametro,
      comissaoDestino,
      prefixo,
      observacao,
      usuario: matricula,
      nomeUsuario,
    };

    gravarParametro(parametros)
      .then(() => {
        message.success("Parâmetro gravado com sucesso!");
        history.goBack();
      })
      .catch(() => {
        message.error("Falha ao gravar parâmetro!");
      });
  }

  return (
    <Card title="Parâmetro de Alçadas" className="param-alcadas-form">
      <Form
        {...layout}
        form={form}
        name="paramAlcadasForm"
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Prefixo"
              name="prefixo"
              rules={[
                {
                  required: true,
                  message: "Informe o prefixo",
                },
              ]}
            >
              <InputPrefixoAlcada onChange={handlePrefixoChange} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Comissão Destino"
              name="comissaoDestino"
              rules={[
                {
                  required: true,
                  message: "Informe a comissão destino",
                },
              ]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                onChange={handleComissaoDestinoChange}
                placeholder="Selecione a comissão destino"
              >
                {comissaoDestinoOptions.map((option) => (
                  <Select.Option
                    key={option.cod_cargo}
                    value={option.cod_cargo}
                  >
                    {option.nome_cargo}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Nome Comissão Destino" name="nomeComissaoDestino">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Observação"
              name="observacao"
              rules={[
                {
                  required: true,
                  message: "Informe a observação",
                },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Gravar
              </Button>
              <Button htmlType="button" onClick={() => history.goBack()}>
                Cancelar
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default FormParamAlcadas;
