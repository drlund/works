/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
// @ts-nocheck
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Radio,
  message,
  Modal,
  DatePicker,
} from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useSelector } from 'react-redux';
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';
import useUsuarioLogado from 'hooks/useUsuarioLogado';
import {
  getTipoSuspensao,
  gravarTipoDeSuspensao,
  gravarSuspensao,
  getTiposJurisdicoes,
} from '../../apiCalls/apiParamSuspensao';

import '../alcadas/ParamAlcadasForm.css';
import InputPrefixoAlcada from '../alcadas/InputPrefixoAlcada';
import InputFunciSuspensao from './InputFunciSuspensao';

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
 * @property {string} idSuspensao
 * @property {string} id
 *
 */

/**
 * @param {Object} props
 * @param {object} props.location
 * @param {LocationState} props.location.state
 */

function FormParamSuspensao({ location }) {
  const idSuspensao = parseInt(location.id, 10);
  const tipoInputRef = useRef(null);
  const [validaJurisdicao, setValidaJurisdicao] = useState([]);
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [tipoInputValue, setTipoInputValue] = useState('');
  const [tiposSuspensao, setTiposSuspensao] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoTipoDeSuspensao, setNovoTipoDeSuspensao] = useState('');
  const [dadosJurisdicoes, setDadosJurisdicoes] = useState({});
  const [, setTipoSelecionadoValidator] = useState('');
  const [setDadosSuspensaoForm, dadosSuspensaoForm] = useState('');
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('');
  const [tipoSelecionadoTemp, setTipoSelecionadoTemp] = useState('');
  const [selecionaTipo, setSelecionaTipo] = useState('');
  
  const [mostrarMensagemValidacao, setMostrarMensagemValidacao] =
    useState(false);

  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);
  const [form] = Form.useForm();
  const dadosDoUsuario = useUsuarioLogado();

  const handleNovoTipoDeSuspensaoChange = (
    /** @type {{ target: { value: React.SetStateAction<string>; }; }} */ e,
  ) => {
    setNovoTipoDeSuspensao(e.target.value);
    setMostrarMensagemValidacao(false);
  };

  const { matricula, nome_usuario: nomeUsuario } = dadosDoUsuario;

  const tipoJurisdicoesMap = {
    cd_vicepres_juris: 'vicePresi',
    cd_diretor_juris: 'diretoria',
    cd_super_juris: 'supers',
    cd_gerev_juris: 'gerev',
    prefixo: 'prefixo',
    matricula: 'matricula',
  };

  const handleTipoChange = (/** @type {{ target: { value: any; }; }} */ e) => {
    const valorSelecionado = e.target.value;

    if (valorSelecionado !== 'matricula') {
      setTipoSelecionado(tipoJurisdicoesMap[valorSelecionado]);
      form.setFieldsValue({ tipo: '' });
    } else {
      setTipoSelecionado('');
    }

    const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];
    setTipoSelecionado(valorRadioGroup);
    setTipoSelecionadoTemp(valorRadioGroup);

    let formatoInput = '';
    switch (valorRadioGroup) {
      case 'vicePresi':
        formatoInput = '0000';
        break;
      case 'diretoria':
        formatoInput = '0000';
        break;
      case 'supers':
        formatoInput = '0000';
        break;
      case 'gerev':
        formatoInput = '0000';
        break;
      case 'prefixo':
        formatoInput = '0000';
        break;
      case 'matricula':
        formatoInput = 'F0000000';
        setSelecionaTipo('matricula');
        break;
      default:
        formatoInput = 'Escolha um tipo de entrada!';
        setSelecionaTipo('');
        break;
    }

    const dadosJurisdicoes = getTiposJurisdicoes();
    const jurisdicaoSelecionada = tipoJurisdicoesMap[valorSelecionado];

    setValidaJurisdicao(
      Object.values(dadosJurisdicoes).filter(
        (prefixoTipo) => prefixoTipo === jurisdicaoSelecionada,
      ),
    );

    form.setFieldsValue({ tipo: '' });
    form.setFields([{ name: 'tipo', value: '' }]);
    setTipoInputValue(formatoInput);
    setOpcaoSelecionada(valorSelecionado);
  };

  useEffect(() => {
    const fetchTiposSuspensao = async () => {
      try {
        const data = await getTipoSuspensao();
        const dadosJurisdicoes = await getTiposJurisdicoes();

        setTiposSuspensao(data);

        setDadosJurisdicoes(dadosJurisdicoes);
      } catch (error) {
        message.error('Erro ao buscar os tipos de suspensão:', error);
      }
    };

    fetchTiposSuspensao();
  }, []);

  function validarTipo(value, tipoSelecionado) {
    if (!tipoSelecionado) {
      return false;
    }

    const chaveJurisdicao = `${tipoSelecionado}Juris`;

    const dadosDaJurisdicao = dadosJurisdicoes[chaveJurisdicao];
    if (!dadosDaJurisdicao) {
      return false;
    }

    const valoresDaJurisdicao = dadosDaJurisdicao.map(
      (item) => Object.values(item)[0],
    );
    return valoresDaJurisdicao.includes(value);
  }

  useEffect(() => {
    if (tipoSelecionado && tipoInputRef.current) {
      tipoInputRef.current.focus();
    }
  }, [tipoSelecionado, idSuspensao]);

  function gravaSuspensao() {
    const dadosForm = form.getFieldsValue();

    const dadosSuspensao = {
      ...dadosForm,
      [tipoSelecionado]: dadosForm.tipo,
      tipo: undefined,
      matriculaResponsavel: dadosDoUsuario.matricula,
      validade: moment(dadosForm.validade).format('YYYY-MM-DD'),
    };

    const tipos = [
      'vicePresi',
      'diretoria',
      'supers',
      'gerev',
      'prefixo',
      'matricula',
    ];
    for (const tipo of tipos) {
      if (tipo !== tipoSelecionado) {
        dadosSuspensao[tipo] = '0';
      }
    }

    if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
      form.validateFields().then(() => {
        gravarSuspensao({ ...dadosSuspensao, idSuspensao })
          .then((dadosSuspensaoForm) => {
            setDadosSuspensaoForm(dadosSuspensaoForm);
            history.goBack();
          })
          .catch(() => message.error('Falha ao gravar suspensão! Verifique!'));
      });
    }
  }

  const handleSalvaNovoTipoDeSuspensao = async () => {
    try {
      if (!novoTipoDeSuspensao.trim()) {
        message.error('Por favor, digite o novo tipo de suspensão.');
        return;
      }

      await gravarTipoDeSuspensao(novoTipoDeSuspensao);

      setTiposSuspensao([
        ...tiposSuspensao,
        { id: 'novo_id', mensagem: novoTipoDeSuspensao },
      ]);

      setNovoTipoDeSuspensao('');
      setModalVisible(false);

      message.success('Nova mensagem de suspensão adicionada com sucesso!');
    } catch (error) {
      message.error(
        'Erro ao adicionar nova mensagem de suspensão:',
        error.message,
      );
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
        <Modal
          open={modalVisible}
          title="Incluir novo tipo de suspensão"
          onCancel={() => setModalVisible(false)}
          onOk={handleSalvaNovoTipoDeSuspensao}
        >
          <Input
            value={novoTipoDeSuspensao}
            onChange={handleNovoTipoDeSuspensaoChange}
            placeholder="Digite o novo tipo de suspensão"
          />
        </Modal>
        <Form
          initialValues={{
            validade: moment(),
            tipoSuspensao: '',
          }}
          form={form}
          {...layout}
          name="control-ref"
          onFinish={gravaSuspensao}
        >
          <Form.Item label="Tipo">
            <Radio.Group
              onChange={(e) => {
                if (e.target.value !== 'Matrícula') {
                  form.setFieldsValue({ tipo: '' });
                }
                handleTipoChange(e);
                form.setFieldsValue({ tipo: e.target.value });
              }}
              value={opcaoSelecionada}
            >
              <Radio value="cd_vicepres_juris"> Vice Presidência </Radio>
              <Radio value="cd_diretor_juris"> Unid. Estratégica </Radio>
              <Radio value="cd_super_juris"> Unid. Tática </Radio>
              <Radio value="cd_gerev_juris"> Comercial </Radio>
              <Radio value="prefixo"> Prefixo </Radio>
              <Radio value="matricula"> Matrícula </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="tipo"
            label="Tipo"
            rules={[
              {
                required: true,
                message: mostrarMensagemValidacao
                  ? 'Por favor, selecione um tipo!'
                  : '',
              },
              () => ({
                validator(_, value) {
                  if (!value || validaJurisdicao.includes(value)) {
                    return Promise.resolve();
                  }

                  if (!tipoSelecionado) {
                    return Promise.resolve();
                  }

                  const chaveJurisdicao = tipoSelecionado;
                  const isValid = validarTipo(value, chaveJurisdicao);

                  if (isValid) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      `O campo não é válido para o tipo de ${chaveJurisdicao} selecionado!`,
                    ),
                  );
                },
              }),
            ]}
          >
            {tipoSelecionado === 'matricula' ? (
              <InputFunciSuspensao
                value={tipoInputValue}
                tipoSelecionado={tipoSelecionado}
              />
            ) : (
              <InputPrefixoAlcada
                value={tipoInputValue}
                tipoSelecionado={tipoSelecionado}
                ref={tipoInputRef}
              />
            )}
          </Form.Item>
          <Form.Item name="tipoSuspensao" label="Tipo de Suspensão" required>
            <Select
              placeholder="Selecione o tipo de suspensão"
              onChange={(value) => {
                if (value === 'novo') {
                  setModalVisible(true);
                }
              }}
            >
              {tiposSuspensao.map((tipo) => (
                <Select.Option key={tipo.id} value={tipo.id}>
                  {tipo.mensagem}
                </Select.Option>
              ))}
              <Select.Option
                key="novo"
                value="novo"
                style={{ fontWeight: 'bold', color: 'green' }}
              >
                ** INCLUIR NOVO TIPO DE SUSPENSÃO **
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Data de Validade" name="validade">
            <DatePicker
              format="DD/MM/YYYY"
              locale="pt-br"
              placeholder="Selecione a data de validade"
              style={{ width: '100%' }}
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
              onClick={() => history.back()}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default FormParamSuspensao;
