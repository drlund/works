import React, { useState, useEffect, useMemo } from 'react';
import {
  Row, Col, Input, Upload, Card, Form, Divider, Radio, Tag, message, Button
} from 'antd';
import _ from 'lodash';
import { useSelector } from 'react-redux';

import { InboxOutlined } from '@ant-design/icons';

import { InputMoeda } from 'components/numberformat/NumberFormat';
import StyledCardPrimary from 'components/styledcard/StyledCard';
import TudoOk from './ValidarFunciComp/TudoOk';

const { TextArea } = Input;
const { Dragger } = Upload;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function MostraConfirmacao({ dados, negativas, confirmar }) {
  const [form] = Form.useForm();

  const protocolo = useSelector((state) => state.designacao.protocolo);

  const cor = _.isEmpty(dados.negativas) ? '#74B4C4' : '#FB630B';

  const [tipoDesloc, setTipoDesloc] = useState('');
  const [, setTudoOk] = useState(false);

  const changeTipoDesloc = (event) => {
    setTipoDesloc(event.target.value);
  };

  useEffect(() => {
    setTudoOk(true);
  }, [protocolo]);

  const normFile = (e) => {
    // ? 'Upload event: e'

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const Limitrofes = useMemo((elem, analise) => (
    <Row align="middle">
      <Col span={8}>
        <span>
          {negativas[elem].texto}
          :
          {' '}
        </span>
        {analise[elem].valor}
      </Col>
      <Col span={16}>
        <Row>
          <Col>
            <Form.Item
              label={negativas[elem].label}
              labelAlign="left"
              rules={[{ required: true, message: 'Necessário Escolher entre Hospedagem e Deslocamento Diário' }]}
            >
              <Radio.Group onChange={changeTipoDesloc} value={tipoDesloc}>
                <Radio value={1}>Hospedagem</Radio>
                <Radio value={2}>Desloc. Diário</Radio>
              </Radio.Group>
            </Form.Item>
            {
              tipoDesloc === 1 ? (
                <Card>
                  <Form.Item
                    {...layout}
                    label="Quantidade Diárias"
                    labelAlign="left"
                  >
                    <Tag />
                  </Form.Item>
                  <Form.Item
                    {...layout}
                    label="Valor Deslocamento"
                    labelAlign="left"
                    rules={[{ required: true, message: 'Valor do Deslocamento obrigatório!' }]}
                  >
                    <InputMoeda />
                  </Form.Item>
                  <Form.Item
                    {...layout}
                    label="Valor Diário Hospedagem"
                    labelAlign="left"
                    rules={[{ required: true, message: 'Valor Diário da Hospedagem obrigatório!' }]}
                  >
                    <InputMoeda />
                  </Form.Item>
                  <Form.Item
                    {...layout}
                    label="Valor Diário Alimentação"
                    labelAlign="left"
                    rules={[{ required: true, message: 'Valor Diário da Alimentação obrigatório!' }]}
                  >
                    <InputMoeda />
                  </Form.Item>
                  <Form.Item
                    {...layout}
                    label="Valor Total"
                    labelAlign="left"
                  />
                </Card>
              )

                : (
                  <Card>
                    <Form.Item
                      {...layout}
                      label="Quantidade Diárias (dias úteis)"
                      labelAlign="left"
                    >
                      <Tag />
                    </Form.Item>
                    <Form.Item
                      {...layout}
                      label="Valor Diário Deslocamento"
                      labelAlign="left"
                      rules={[{ required: true, message: 'Valor do Deslocamento obrigatório!' }]}
                    >
                      <InputMoeda />
                    </Form.Item>
                    <Form.Item
                      {...layout}
                      label="Valor Diário Alimentação"
                      labelAlign="left"
                      rules={[{ required: true, message: 'Valor do Deslocamento obrigatório!' }]}
                    >
                      <InputMoeda />
                    </Form.Item>
                    <Form.Item
                      {...layout}
                      label="Valor Total"
                      labelAlign="left"
                    />
                  </Card>
                )
            }
            <Form.Item rules={[{ required: true, message: 'Obrigatório apresentar documento digitalizado!' }]}>
              <Dragger
                key={elem}
                name={elem}
                valuePropName={elem}
                getValueFromEvent={normFile}
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
              >
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p className="ant-upload-text">Clique aqui ou arraste até aqui os arquivos a enviar</p>
                <p className="ant-upload-hint">Envie os arquivos que comprovem a necessidade de flexibilização desta regra</p>
              </Dragger>
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  ));

  const Outros = useMemo((elem, analise) => (
    <Row align="middle">
      <Col span={8}>
        <span>
          {negativas[elem].texto}
          :
          {' '}
        </span>
        {analise[elem].valor}
      </Col>
      <Col span={16}>
        <Row>
          <Col>
            <Form.Item
              label={negativas[elem].label}
              labelAlign="left"
              rules={[{ required: true, message: 'Necessário Informar o Motivo para Liberação da Movimentação' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item rules={[{ required: true, message: 'Obrigatório apresentar documento digitalizado!' }]}>
              <Dragger
                key={elem}
                name={elem}
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
              >
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p className="ant-upload-text">Clique aqui ou arraste até aqui os arquivos a enviar</p>
                <p className="ant-upload-hint">Envie os arquivos que comprovem a necessidade de flexibilização desta regra</p>
              </Dragger>
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  ));

  const renderNormal = (elem, analise) => {
    if (elem === 'limitrofes') {
      return (
        <>
          <Limitrofes elem={elem} analise={analise} />
          <Divider />
        </>
      );
    }
    return (
      <>
        <Outros elem={elem} analise={analise} />
        <Divider />
      </>
    );
  };

  const render = () => {
    let renderItens = [];

    if (dados.negativas) {
      renderItens = dados.negativas.map((elem) => renderNormal(elem, negativas[elem]));
    }

    const adicionalInfo = {
      adicionalInfo: {
        nome: 'adicionalInfo',
        label: 'Caso queira enviar informações adicionais, por favor use este campo',
        texto: 'Informações Adicionais (Opcional)'
      }
    };
    renderItens = [
      ...renderItens,
      renderNormal('adicionalInfo', adicionalInfo)
    ];

    return renderItens;
  };

  const onFinish = async () => {
    try {
      form.validateFields()
        .catch((error) => message.error(error));

      confirmar();
    } catch (errorInfo) {
      message.error('Problema ao confirmar movimentação!');
    }
  };

  return (
    (dados && negativas) && (
      <StyledCardPrimary
        title="Confirmação"
        headStyle={{
          textAlign: 'center', fontWeight: 'bold', background: `${cor}`, fontSize: '1.3rem'
        }}
        bodyStyle={{ padding: 5 }}>
        <Card style={{ textAlign: 'center' }}>
          <>
            <Form
              form={form}
              name="confirm"
              onFinish={onFinish}
            >
              {
                render()
              }
            </Form>
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button type="primary" htmlType="submit">Confirmar</Button>
              </Col>
            </Row>
            <TudoOk protocolo={200200200200} />
          </>
          <div teste />
        </Card>
      </StyledCardPrimary>
    )
  );
}
export default React.memo(MostraConfirmacao);
