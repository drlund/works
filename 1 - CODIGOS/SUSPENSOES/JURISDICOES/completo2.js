/**
 * A função `isValidTipoValue` não está sendo utilizada no código fornecido. Portanto, podemos removê-la sem afetar o funcionamento do código.
 * 
 * Certifique-se de que os valores dos `Radio` estejam correspondendo exatamente aos valores das chaves do objeto `tipoJurisdicoesMap`. Se os 
 * valores dos `Radio` estiverem diferentes, ajuste-os para que estejam em conformidade com as chaves do objeto `tipoJurisdicoesMap`. Isso deve 
 * resolver o problema de validação dos valores selecionados.
 * 
 * Vamos refazer o código sem a função `isValidTipoValue`. Aqui está a versão atualizada:
 */

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

function FormParamSuspensao() {
  const tipoInputRef = useRef(null);
  const [tipoInputValue, setTipoInputValue] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [tiposSuspensao, setTiposSuspensao] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoTipoDeSuspensao, setNovoTipoDeSuspensao] = useState('');
  const [tiposJurisdicoes, setTiposJurisdicoes] = useState([]);
  const [, setValidade] = useState(null);

  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);
  const [form] = Form.useForm();
  const dadosDoUsuario = useUsuarioLogado();

  const handleNovoTipoDeSuspensaoChange = (/** @type {{ target: { value: React.SetStateAction<string>; }; }} */ e) => {
    setNovoTipoDeSuspensao(e.target.value);
  };

  const {
    prefixo: prefixoUsuario,
    matricula,
    nome_usuario: nomeUsuario,
  } = dadosDoUsuario;

  const tipoJurisdicoesMap = {
    cd_vicepres_juris: 'vicePresi',
    cd_diretor_juris: 'diretoria',
    cd_super_juris: 'super',
    cd_gerev_juris: 'gerev',
    cd_redeage_juris: 'prefixo',
  };

  const handleTipoChange = (/** @type {{ target: { value: any; }; }} */ e) => {
    const valorSelecionado = e.target.value;

    if (!tipoJurisdicoesMap[valorSelecionado]) {
      message.error('Opção de tipo selecionada inválida!');
      return;
    }

    const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];
    setTipoSelecionado(valorRadioGroup);

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
        break;
      default:
        formatoInput = 'Escolha um tipo de entrada!';
        break;
    }

    form.setFieldsValue({ tipo: '' });
    form.setFields([{ name: 'tipo', value: '' }]);
    setTipoInputValue(formatoInput);
  };

  useEffect(() => {
    const fetchTiposSuspensao = async () => {
      try {
        const data = await getTipoSuspensao();
        const dadosJurisdicoes = await getTiposJurisdicoes()
       
        setTiposSuspensao(data);
        const idsTiposJurisdicoes = Object.values(dadosJurisdicoes);

        setTiposJurisdicoes(idsTiposJurisdicoes);
      } catch (error) {
        message.error('Erro ao buscar os tipos de suspensão:', error);
      }
    };

    fetchTiposSuspensao();
  }, []);

  useEffect(() => {
    if (tipoSelecionado && tipoInputRef.current) {
      tipoInputRef.current.focus();
    }
  }, [tipoSelecionado]);

  function incluirSuspensao() {
    const dadosForm = form.getFieldsValue();
    if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
      return gravarSuspensao(dadosForm);
    }
    return incluirSuspensao();
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

      setTiposSuspensao([
        ...tiposSuspensao,
        { id: 'novo_id', mensagem: novoTipoDeSuspensao },
      ]);

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
          form={form}
          {...layout}
          name="control-ref"
          onFinish={incluirSuspensao}
        >
          <Form.Item label="Tipo">
            <Radio.Group onChange={handleTipoChange}>
              <Radio value="cd_vicepres_juris"> Vice Presidência </Radio>
              <Radio value="cd_diretor_juris"> Unid. Estratégica </Radio>
              <Radio value="cd_super_juris"> Unid. Tática </Radio>
              <Radio value="cd_gerev_juris"> Comercial </Radio>
              <Radio value="cd_redeage_juris"> Prefixo </Radio>
              <Radio value="matricula"> Matrícula </Radio>
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
            ]}
          >
            <InputPrefixoAlcada
              placeholder="Tipo"
              value={tipoInputValue}
              ref={tipoInputRef}
            />
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
          <Form.Item name="validade" label="Validade" required>
            <DatePicker
              placeholder="Data de validade"
              format="DD/MM/YYYY"
              onChange={(date) => setValidade(date)}
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
              // onClick={() => history.goBack()}
              onClick={() => gravarSuspensao(form.getFieldsValue())}
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
