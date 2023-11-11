import React, { memo, useState } from 'react';
import { message, Button, Result, Form, Typography, Input, Select } from 'antd';
import { complementaGedip, getPrimGest, getAlineas } from 'services/ducks/CtrlDisciplinar/Gedip.ducks';
import PageLoading from 'components/pageloading/PageLoading';
import InputPrefixo from 'components/inputsBB/InputPrefixo';
import 'moment/locale/pt-br';
import _ from 'lodash';
import InputContaCorrente from 'components/inputsBB/InputContaCorrente';
import DateTimePicker from 'components/dateTimePicker/DateTimePicker';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import useEffectOnce from 'utils/useEffectOnce';

const { Text } = Typography;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 10 },
};

const formTailLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 10, offset: 12 },
};

function ComplementoDemissao(props) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [funciResp, setFunciResp] = useState(null);

  const [alineas, setAlineas] = useState([]);

  const [confirmacao, setConfirmacao] = useState(false);

  useEffectOnce(() => {
    getAlineas()
      .then(alins => setAlineas(() => alins))
      .catch(error => message.error(error))
  })

  const complemGedip = async (params) => {

    let valores = {};

    const valorCampos = await form.validateFields();

    valores = {
      id_gedip: props.gedip.id_gedip,
      funci_resp: funciResp && funciResp.matricula,
      prefixoCompar: {
        age_apresentacao: valorCampos.age_apresentacao,
        dt_hr_apres_ag: valorCampos.dt_hr_apres_ag,
      },
      agenciaCC: {
        agencia: valorCampos.agencia,
        cC: valorCampos.cC,
      },
      clinica: {
        dt_hr_agend_cassi: valorCampos.dt_hr_agend_cassi,
        nome_clinica: valorCampos.nome_clinica,
        endereco_clinica: valorCampos.ende_clinica,
      },
      alineas_clt: valorCampos.alineas_clt
    }

    setSaving(() => true);

    complementaGedip(valores)
      .then(() => setConfirmacao(() => true))
      .catch((error) => message.error("Complemento NÃO cadastrado. Favor verificar estado do Ponto Eletrônico!"))
      .then(() => setSaving(() => false))
  }

  const confirmScreen = () => {
    return (
      <Result
        status="success"
        title={<Text>Complemento de Demissão cadastrado com sucesso!</Text>}
      />
    )
  }

  const changePrefixo = (prefixo) => {
    if (_.isEmpty(prefixo)) {
      setFunciResp(() => null );
    } else {
      setLoading(() => true)
      getPrimGest(prefixo)
        .then(funciResp => setFunciResp(() => funciResp))
        .catch(error => message.error(error))
        .then(() => setLoading(() => false))
    }
  }

  const opcoes = () => {
    if (!_.isEmpty(alineas)) {
      return alineas.map(alinea => {
        return <Option key={alinea.alinea}>{alinea.alinea} - {alinea.texto}</Option>
      })
    }

    return alineas;
  }

  const agDebito = () => {
    return <Form.Item label="Agência de Débito" name='agencia' rules={[{ required: true, message: 'Informe o prefixo do funcionário à época da ocorrência!' }]}>
      <InputPrefixo dv={true} style={{ width: '100%' }} />
    </Form.Item>
  }

  const ccDebito = () => {
    return <Form.Item label="Conta Corrente de Débito com DV" name='cC' rules={[{ required: true, message: 'Digite o número da Conta Corrente com DV!' }, { pattern: !/^\d$/gm, message: 'Informe o número da Conta Corrente corretamente!' }]}>
      <InputContaCorrente style={{ width: '100%' }} />
    </Form.Item>
  }

  const agApresent = () => {
    return <Form.Item label="Agência de Apresentação" name='age_apresentacao' rules={[{ required: true, message: 'Informe o prefixo no qual o funcionário deverá se apresentar!' }]}>
      <InputPrefixo onChange={changePrefixo} style={{ width: '100%' }} />
    </Form.Item>
  }

  const nomeClinica = () => {
    return <Form.Item label="Nome da Clínica" name='nome_clinica' rules={[{ required: true, message: 'Informe o nome da Unidade Cassi ou clínica agendada!' }]}>
      <Input style={{ width: '100%' }} />
    </Form.Item>
  }

  const endeClinica = () => {
    return <Form.Item label="Endereço da Clínica" name='ende_clinica' rules={[{ required: true, message: 'Informe o endereço da Unidade Cassi ou clínica agendada!' }]}>
      <Input style={{ width: '100%' }} />
    </Form.Item>
  }

  const alineasClt = () => {
    return <Form.Item label="Alíneas da CLT, Artigo 482" name='alineas_clt' rules={[{ required: true, message: 'Selecione a(s) alínea(s) referente(s) ao presente processo!' }]}>
      <Select mode="multiple" style={{ width: '100%' }}>{opcoes()}</Select>
    </Form.Item>
  }

  const funciRespons = () => {
    if (loading) {
      return <LoadingOutlined />
    }

    if (funciResp) {
      return <Form.Item label="Funcionário Responsável">
        <div>{funciResp.matricula} {funciResp.nome}</div>
      </Form.Item>
    } else {
      return null;
    }
  }

  const dtHrCassi = () => {
    return (
      <Form.Item
        name='dt_hr_agend_cassi'
        label="Data e Hora Agendada CASSI"
        trigger='onChange'
      >
        <DateTimePicker allowClear={false} />
      </Form.Item>
    )
  }

  const dtHrPrefixo = () => {
    return (
      <Form.Item
        name='dt_hr_apres_ag'
        label="Data e Hora de Apresentação na Agência"
        trigger='onChange'
      >
        <DateTimePicker allowClear={false} />
      </Form.Item>
    )
  }

  const confirmButton = () => {
    return <Form.Item {...formTailLayout}>
      <Button type="primary" htmlType="submit">Salvar Dados</Button>
    </Form.Item>
  }

  const renderForm = () => {
    if (saving) {
      return <PageLoading />
    }

    return (
      <Form
        form={form}
        {...formItemLayout}
        onFinish={complemGedip}
        name="ComplementaGedip"
        labelAlign='left'
        initialValues={{ dt_hr_agend_cassi: { date: moment().startOf('days'), time: moment('08:00', 'HH:mm') }, dt_hr_apres_ag: { date: moment().startOf('days'), time: moment('08:00', 'HH:mm') } }}
      >
        {agDebito()}
        {ccDebito()}
        {agApresent()}
        {funciResp && funciRespons()}
        {nomeClinica()}
        {endeClinica()}
        {alineasClt()}
        {dtHrCassi()}
        {dtHrPrefixo()}
        {confirmButton()}
      </Form>
    )
  }

  const render = () => {
    if (confirmacao) {
      return confirmScreen();
    }

    return renderForm();
  }

  return render();

}

export default memo(ComplementoDemissao);