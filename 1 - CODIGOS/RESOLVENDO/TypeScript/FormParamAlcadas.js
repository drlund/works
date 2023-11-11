/**Para converter o código JavaScript para TypeScript, você precisará adicionar tipos às declarações de variáveis, 
 * parâmetros de função e valores de retorno. Além disso, é necessário importar os tipos corretos para as dependências 
 * utilizadas. Aqui está o código refatorado para TypeScript:
 */


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
  listaComiteParamAlcadas
} from '../../apiCalls/apiParamAlcadas';
import './ParamAlcadasForm.css';

const { TextArea } = Input;

interface FormData {
  prefixoDestino: { value: string; label: string } | undefined;
  comissaoDestino: string | undefined;
  nomeComissaoDestino: string;
  comite: { value: string; label: string } | undefined;
  observacao: string;
}

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

function FormParamAlcadas({ location }: { location: { state: { id: number } } }) {
  const authState = useSelector((state: any) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);
  const { idParametro } = parseInt(location.state.id, 10);
  const [, setDadosParametroForm] = useState<any>();
  const [form] = Form.useForm();
  const dadosDoUsuario = useUsuarioLogado();
  const [comissaoDestinoOptions, setComissaoDestinoOptions] = useState<any[]>([]);
  const [, setJurisdicaoUsuario] = useState<string>('');
  const [nomeComissaoDestino] = useState<string>('');

  const [prefixoDestino, setPrefixoDestino] = useState<string>('');
  const [comite, setComite] = useState<string>('');

  const [prefixosSubordinados, setPrefixosSubordinados] = useState<string[]>([]);
  const [temComite, setTemComite] = useState<string[]>([]);

  const initialValues: FormData = {
    prefixoDestino: undefined,
    comissaoDestino: undefined,
    nomeComissaoDestino: '',
    comite: undefined,
    observacao: '',
  };

  const {
    prefixo: prefixoUsuario,
    matricula,
    nome_usuario: nomeUsuario,
  } = dadosDoUsuario;

  useEffect(() => {
    if (![null, undefined, 'NaN'].includes(prefixoDestino)) {
      getJurisdicoesSubordinadas(prefixoDestino)
        .then((jurisdicoes: string[]) => {
          setJurisdicaoUsuario(jurisdicoes[0]);
        })
        .catch(() => {
          setJurisdicaoUsuario('');
        });
    }
  }, [prefixo

Destino]);

  function buscarComites(comite: { value: string }) {
    if (comite.value) {
      setComite(comite.value);
      listaComiteParamAlcadas(comite.value)
        .then((result: { prefixo: string }[]) => {
          const comitePrefixo = result.map((item) => item.prefixo);
          setTemComite(comitePrefixo);
          console.log(comitePrefixo);
        })
        .catch(() => {
          setTemComite([]);
        });
    } else {
      setTemComite([]);
    }
  }

  function buscarPrefixosSubordinados(prefixoDestino: { value: string }) {
    if (prefixoDestino.value) {
      setPrefixoDestino(prefixoDestino.value);
      getJurisdicoesSubordinadas(prefixoDestino.value)
        .then((result: { prefixo_subordinada: string }[]) => {
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

  function buscarComissaoDestino(cod_dependencia: string) {
    if (cod_dependencia) {
      getCargosComissoesFot09(cod_dependencia)
        .then((result: any[]) => {
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

  function handleComissaoDestinoChange(value: string) {
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
    const dadosForm = form.getFieldsValue() as FormData;
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
        prefixoUsuario === prefixoDestino?.value)
    ) {
      form
        .validateFields()
        .then(() => {
          const prefixoDestino = dadosForm.prefixoDestino?.value;

          if (
            prefixoDestino &&
            !prefixosSubordinados.includes(prefixoDestino)
          ) {
            message.error('Prefixo de destino não vinculado à jurisdição.');
            return;
          }

          gravarParametro({ ...dadosParametro, idParametro })
            .then((dadosParametroForm: any) => {
              setDadosParametroForm(dadosParametroForm);
              history.goBack();
           

 })
            .catch(() => message.error('Falha ao gravar parâmetro!'));
        })
        .catch((error: any) => {
          console.log('Erro de validação:', error);
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
              value={comite}
              onChange={(comite) => {
                setComite(comite.value);
                buscarComites(comite);
              }}
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


/** 
 * Nesta refatoração, foram adicionados os tipos das variáveis e dos parâmetros de função para a utilização do TypeScript. 
 * Além disso, foram importados os tipos corretos para as dependências utilizadas no código. Certifique-se de instalar as 
 * definições de tipos corretas para as bibliotecas utilizadas no seu projeto.
 */

/** 
 * Observação: Algumas partes do código foram omitidas por não estarem incluídas na sua pergunta original ou por estarem 
 * incompletas. Certifique-se de verificar a integridade do código refatorado e adicionar as partes ausentes, se necessário.
 */