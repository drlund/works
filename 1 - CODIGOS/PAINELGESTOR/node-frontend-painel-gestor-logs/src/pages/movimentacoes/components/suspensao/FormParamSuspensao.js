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
import { useHistory } from 'react-router-dom';
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
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [tipoInputValue] = useState('');
  const [tiposSuspensao, setTiposSuspensao] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoTipoDeSuspensao, setNovoTipoDeSuspensao] = useState('');
  const [dadosJurisdicoes, setDadosJurisdicoes] = useState({});
  const [dadosSuspensaoForm, setDadosSuspensaoForm] = useState('');
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('');

  const history = useHistory();

  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);
  const [form] = Form.useForm();
  const dadosDoUsuario = useUsuarioLogado();

  const handleNovoTipoDeSuspensaoChange = (
    /** @type {{ target: { value: React.SetStateAction<string>; }; }} */ e,
  ) => {
    setNovoTipoDeSuspensao(e.target.value);
  };

  const { matricula, nome_usuario: nomeUsuario } = dadosDoUsuario;

  const tipoJurisdicoesMap = {
    cd_vicepres_juris: 'vicePresi',
    cd_diretor_juris: 'diretoria',
    cd_super_juris: 'super',
    cd_gerev_juris: 'gerev',
    prefixo: 'prefixo',
    matricula: 'matricula',
  };

  const handleTipoChange = (/** @type {{ target: { value: any; }; }} */ e) => {
    const valorSelecionado = e.target.value;

    if (valorSelecionado !== 'matricula') {
      form.setFieldsValue({ tipo: '' });
    }

    const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];
    setTipoSelecionado(valorRadioGroup);

    setOpcaoSelecionada(valorSelecionado);
  };

  useEffect(() => {
    try {
      (async () => {
        const dados = await getTipoSuspensao();
        const dadosJurisdicoes = await getTiposJurisdicoes();

        setTiposSuspensao(dados);
        setDadosJurisdicoes(dadosJurisdicoes);
      })();
    } catch (error) {
      message.error('Erro ao buscar os tipos de suspensão:', error);
    }
  }, []);

  function validarTipo(value, tipoSelecionado) {
    if (!tipoSelecionado) {
      return false;
    }

    if (tipoSelecionado === 'matricula') {
      const formatoMatricula = /^F\d{7}$/;
      return formatoMatricula.test(value);
    }

    const chaveJurisdicao = `${tipoSelecionado}Juris`;

    if (
      tipoSelecionado === 'cd_vicepres_juris' ||
      tipoSelecionado === 'cd_diretor_juris' ||
      tipoSelecionado === 'cd_super_juris' ||
      tipoSelecionado === 'cd_gerev_juris' ||
      tipoSelecionado === 'prefixo'
    ) {
      const formatoCampoEspecifico = /^\d{4}$/;
      return formatoCampoEspecifico.test(value);
    }

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
      'super',
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
        gravarSuspensao({ ...dadosSuspensao })
          .then(() => {
            setDadosSuspensaoForm(dadosSuspensaoForm);
            history.goBack();
          })
          .catch(() =>
            message.error('Suspensão já existe e está ativa. Verifique!'),
          );
      });
    } else {
      message.error('Funcionário não tem permissão para editar suspensão.');
    }
  }

  const handleSalvaNovoTipoDeSuspensao = async () => {
    try {
      if (!novoTipoDeSuspensao.trim()) {
        message.error('Por favor, digite o novo tipo de suspensão.');
        return;
      }

      const novoTipo = await gravarTipoDeSuspensao(novoTipoDeSuspensao);

      setTiposSuspensao([
        ...tiposSuspensao,
        { id: novoTipo.id, mensagem: novoTipoDeSuspensao },
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
                handleTipoChange(e);
                if (e.target.value !== 'matricula') {
                  form.setFieldsValue({ tipo: undefined });
                } else {
                  form.setFieldsValue({ tipo: e.target.value });
                }
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
              },
              () => ({
                validator(_, value) {
                  if (!value) {
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
              value={novoTipoDeSuspensao}
            >
              {tiposSuspensao.map((tipo) => (
                <Select.Option key={tipo.id} value={tipo.id}>
                  {tipo.mensagem}
                </Select.Option>
              ))}
              <Select.Option
                key="novo"
                value="novo"
                style={{
                  backgroundColor: 'blue',
                  fontWeight: 'bold',
                  color: 'white',
                }}
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

export default FormParamSuspensao;
