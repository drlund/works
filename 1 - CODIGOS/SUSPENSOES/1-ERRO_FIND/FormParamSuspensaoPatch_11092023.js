/* eslint-disable no-restricted-syntax */
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
import history from 'history.js';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useSelector } from 'react-redux';
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';
import useUsuarioLogado from 'hooks/useUsuarioLogado';
import {
  getTipoSuspensao,
  gravarTipoDeSuspensao,
  getTiposJurisdicoes,
  getSuspensoes,
  patchSuspensao,
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
 * @property {string} id
 *
 */

/**
 * @param {Object} props
 * @param {object} props.location
 * @param {LocationState} props.location.state
 */

// /**
//  * @param {Object} props
//  * @param {object} props.param
//  * @param {props} param.location
//  */

function FormParamSuspensaoPatch({ location }) {
  const tipoInputRef = useRef(null);
  const id = parseInt(location.state.id, 10);
  const { tipo, tipoSuspensao, validade } = location.state;
  const [suspensaoData, setSuspensaoData] = useState(null);
  const [validaJurisdicao, setValidaJurisdicao] = useState([]);
  const [tipoInputValue, setTipoInputValue] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [tiposSuspensao, setTiposSuspensao] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoTipoDeSuspensao, setNovoTipoDeSuspensao] = useState('');
  const [dadosJurisdicoes, setDadosJurisdicoes] = useState({});
  const [, setTipoSelecionadoValidator] = useState('');
  const [, setValidade] = useState(null);
  const [, setDadosSuspensoesForm] = useState();
  const [tipoSelecionadoTemp, setTipoSelecionadoTemp] = useState('');
  const [selecionaTipo, setSelecionaTipo] = useState('');

  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);
  const [form] = Form.useForm();
  const dadosDoUsuario = useUsuarioLogado();
  const [formData, setFormData] = useState({
    tipo: '',
    valor: '',
    validade: '',
    tipoSuspensao: '',
  });

  useEffect(() => {
    if (location.state) {
      const { tipo: valor, tipoSuspensao, validade } = location.state;
      setFormData({
        valor,
        validade,
        tipoSuspensao,
      });
    }
  }, [location.state]);

  useEffect(() => {
    if (id && tipo) {
      getSuspensoes().then((data) => {
        const tipoSuspensoesKeys = Object.keys(data);
        let suspensao = null;
        for (const key of tipoSuspensoesKeys) {
          suspensao = data[key].find((item) => item.id === id);
          if (suspensao) {
            break;
          }
        }
        if (suspensao) {
          setSuspensaoData(suspensao);
        }
      });
    }
  }, [id, tipo]);

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

  const tipoSelecionadoMap = {
    'Vice Presidencia': 'cd_vicepres_juris',
    'Unid. Estratégica': 'cd_diretor_juris',
    'Unid. Tática': 'cd_super_juris',
    Comercial: 'cd_gerev_juris',
    Prefixo: 'prefixo',
    Matrícula: 'matricula',
  };

  const handleTipoChange = (/** @type {{ target: { value: any; }; }} */ e) => {
    const valorSelecionado = e.target.value;

    if (!tipoJurisdicoesMap[valorSelecionado]) {
      message.error('Opção de tipo selecionada inválida!');
      return;
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
      case 'super':
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

  /**
   * @param {any} value
   * @param {string} tipoSelecionado
   */
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
      (/** @type {{ [s: string]: any; } | ArrayLike<any>} */ item) =>
        Object.values(item)[0],
    );
    return valoresDaJurisdicao.includes(value);
  }

  useEffect(() => {
    if (tipoSelecionado && tipoInputRef.current) {
      tipoInputRef.current.focus();
    }
  }, [tipoSelecionado, id]);

  const editaSuspensao = async (/** @type {any} */ id) => {
    try {
      const dadosSuspensoes = await getSuspensoes();

      const tipos = [
        'Vice Presidencia',
        'Unidade Estratégica',
        'Unidade Tática',
        'Super Comercial',
        'Prefixo',
        'Matricula',
      ];

      let registroEncontrado = null;

      for (const tipo of tipos) {
        registroEncontrado = dadosSuspensoes[tipo].find(
          (/** @type {{ id: any; }} */ item) => item.id === id,
        );
        if (registroEncontrado) {
          break;
        }
      }
      
      const tipoToColumnMap = {
        'Vice Presidencia': 'vicePresi',
        'Unidade Estratégica': 'diretoria',
        'Unidade Tática': 'super',
        'Super Comercial': 'gerev',
        'Prefixo': 'prefixo',
        'Matricula': 'matricula',
      };

      const column = tipoToColumnMap[tipo];
      const idDados = {id};
      const { tipo, tipoSuspensao, validade } = idDados;

      history.push({
        pathname: `/movimentacoes/editar-suspensao/`,
        state: {
          id: record.id,
          tipo: column,
          tipoSuspensao: record.tipoSuspensao,
          validade: record.validade,
        },
      });

      if (registroEncontrado) {
        setFormData({
          tipo: registroEncontrado[
            tipoSelecionadoMap[registroEncontrado.tipoSuspensao]
          ],
          validade: moment(registroEncontrado.validade),
          tipoSuspensao: registroEncontrado.tipoSuspensao,
        });

        if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
          form.validateFields().then(() => {
            patchSuspensao({ ...dadosSuspensoes })
              .then((dadosSuspensoesForm) => {
                setDadosSuspensoesForm(dadosSuspensoesForm);
                history.goBack();
              })
              .catch(() => message.error('Falha ao editar suspensão!'));
          });
        }
      }
    } catch (erro) {
      message.error('Erro ao buscar/editar dados:', erro);
    }
  };

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

  const renderComponentesInput = () => {
    if (selecionaTipo !== 'matricula') {
      return (
        <InputPrefixoAlcada
          disabled
          value={tipoInputValue}
          tipoSelecionado={tipoSelecionado}
          ref={tipoInputRef}
        />
      );
    }
    return (
      <InputFunciSuspensao
        disabled
        value={tipoInputValue}
        tipoSelecionado={tipoSelecionado}
      />
    );
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
          form={form}
          {...layout}
          name="control-ref"
          onFinish={editaSuspensao}
          initialValues={{ tipo, tipoSuspensao, validade }}
        >
          <Form.Item label="Tipo">
            <Radio.Group
              disabled
              value={formData.valor}
              onChange={(e) => {
                handleTipoChange(e);
                setTipoSelecionadoValidator(e.target.value);
              }}
            >
              <Radio value={tipoSelecionadoMap['Vice Presidencia']}>
                {' '}
                Vice Presidência{' '}
              </Radio>
              <Radio value={tipoSelecionadoMap['Unid. Estratégica']}>
                {' '}
                Unid. Estratégica{' '}
              </Radio>
              <Radio value={tipoSelecionadoMap['Unid. Tática']}>
                {' '}
                Unid. Tática{' '}
              </Radio>
              <Radio value={tipoSelecionadoMap.Comercial}> Comercial </Radio>
              <Radio value={tipoSelecionadoMap.Prefixo}> Prefixo </Radio>
              <Radio value={tipoSelecionadoMap['Matrícula']}> Matrícula </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="tipo"
            label="Tipo"
            rules={[
              {
                required: true,
                message: 'Por favor, selecione um tipo!',
              },
              () => ({
                validator(_, value) {
                  const tipoSelecionado = tipoSelecionadoTemp;
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
                    'O tipo selecionado não é válido para esta opção.',
                  );
                },
              }),
            ]}
          >
            {renderComponentesInput()}
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
          <Form.Item
            name="validade"
            label="Validade"
            required
            valuePropName="date"
          >
            <DatePicker
              placeholder="Data de validade"
              format="DD/MM/YYYY"
              onChange={(date) => setValidade(moment(date))}
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

export default FormParamSuspensaoPatch;
