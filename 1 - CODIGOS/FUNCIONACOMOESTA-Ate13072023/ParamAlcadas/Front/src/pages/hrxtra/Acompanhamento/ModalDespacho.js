import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, Tag } from 'antd';
import PageLoading from 'components/pageloading/PageLoading';
import React, { useState } from 'react';
import { enviarParecer } from 'services/ducks/HoraExtra.ducks';
import Confirmacao from 'pages/hrxtra/Acompanhamento/Confirmacao';
import Constants from 'pages/hrxtra/Helpers/Constants';

const {Option} = Select;
const {confirm} = Modal;
const Constantes = {...Constants};

function ModalDespacho({id, solicitacao, status, dadosHE, fecharModal}) {

  const [form] = Form.useForm();

  const [processando, setProcessando] = useState(false);
  const [qtdeHorasEnabled, setQtdeHorasEnabled] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [sucesso, setSucesso] = useState(null);
  const [textAreaContador, setTextAreaContador] = useState(0);

  const enviar = (valores) => {
    setProcessando(prev => true);
    enviarParecer(valores)
      .then((resultado) => setSucesso(prev => resultado))
      .catch(error => error)
      .then(() => {
        setProcessando(prev => false);
        setConcluido(prev => true);
      })
  }

  const confirmar = async () => {
    form.validateFields()
      .then(valores => {

        valores.id = solicitacao.id;
        valores.fotoResumoGeral = dadosHE;

        confirm({
          title: 'Confirma Despacho?',
          icon: <ExclamationCircleOutlined />,
          content: (
            <>
              <Row>
                <Col>
                  Protocolo da Solicitação:<br /><Tag style={{whiteSpace: 'break-spaces'}}>{valores.protocolo}</Tag>
                </Col>
              </Row>
              <Row>
                <Col>
                  Seu Despacho:<br /><Tag style={{whiteSpace: 'break-spaces'}}>{valores.parecer} :: {([Constantes.STATUS_SUPER_ADM, Constantes.STATUS_SUPER_NEG, Constantes.STATUS_AUTORIZADO, Constantes.STATUS_DEACORDO].includes(valores.parecer) && valores.qtdHorasAut) && `${valores.qtdHorasAut} H${valores.qtdHorasAut > 0 ? 'S' : ''}`}</Tag><br />
                </Col>
              </Row>
              <Row>
                <Col>
                  Sua Justificativa:<br /><Tag style={{whiteSpace: 'break-spaces'}}>{String(valores.justificativa).toUpperCase()}</Tag>
                </Col>
              </Row>
            </>
          ),
          onOk() {
            enviar(valores);
          },
          onCancel() {
            return;
          },
        });
      })
      .catch(error => true);
  }

  return (
    <Card>
    {
      processando ? <PageLoading customClass="flexbox-row" /> :
      concluido ? <Confirmacao protocolo={solicitacao.protocolo} sucesso={sucesso} /> :
      <Form
        name="despacho"
        form={form}
        labelAlign="left"
        layout="vertical"
        onValuesChange={(changedValues, allValues) => {
          setQtdeHorasEnabled([Constantes.STATUS_DEACORDO, Constantes.STATUS_AUTORIZADO].includes(allValues.parecer));
          setTextAreaContador(allValues.justificativa ? allValues.justificativa.length : 0);
        }}
      >
        <Form.Item label='Protocolo' name='protocolo' initialValue={solicitacao.protocolo}>
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Seu Despacho"
          name="parecer"
          required={true}
          rules={[{ required: true, message: 'Selecione uma opção!' }]}
        >
          <Select>
            {
              status === 1 && <Option key="DE ACORDO">DE ACORDO</Option>
            }
            {
              status === 2 && <Option key="AUTORIZADO">AUTORIZADO</Option>
            }
            <Option key="INDEFERIDO">INDEFERIDO</Option>
          </Select>
        </Form.Item>
        {
          qtdeHorasEnabled &&
            <Form.Item
              label={'Quantidade de Horas Autorizadas :: Máximo de ' + (solicitacao.qtd_hrs_aut_1_desp || solicitacao.qtd_horas_sol) + ' hora(s)'}
              name="qtdHorasAut"
              required={true}
              initialValue={1}
              rules={[
                { required: true, message: 'Necessário indicar a quantidade de horas!' }
              ]}
            >
              <InputNumber min={1} max={solicitacao.qtd_hrs_aut_1_desp || solicitacao.qtd_horas_sol} />
            </Form.Item>
        }
        <Form.Item
          label="Parecer"
          name="justificativa"
          required={true}
          rules={[
            { required: true, message: 'Justifique sua decisão, mínimo de 20 caracteres!' },
            { min: 20, message: 'Mínimo de 20 caracteres!'}
          ]}
        >
          <Input.TextArea rows={5} maxLength={1000} />
        </Form.Item>
        <Row>
          <Col span={18}></Col>
          <Col span={6} style={{textAlign: 'right'}}>{textAreaContador}/1000</Col>
        </Row>
        <Form.Item><Button type="primary" onClick={confirmar}>Próximo</Button></Form.Item>
      </Form>
    }
    </Card>
  )
}

export default React.memo(ModalDespacho);
