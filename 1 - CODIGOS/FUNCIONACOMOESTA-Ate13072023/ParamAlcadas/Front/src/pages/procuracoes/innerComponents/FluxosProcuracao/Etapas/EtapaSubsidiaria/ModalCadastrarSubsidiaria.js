import {
  Alert, Button, Col, Form,
  Input, message, Modal, Row, Select, Typography
} from 'antd';
import React, { useState } from 'react';
import MaskedInput from 'react-text-mask';
import styled from 'styled-components';

import useUnidadesFederacao from 'hooks/useUnidadesFederacao';
import MASCARAS from 'utils/Masks';
import cadastrarSubsidiaria from './apiCalls/cadastrarSubsidiaria';

const { MASK_CNPJ, MASK_CEP } = MASCARAS;
const { Paragraph } = Typography;
const { Option } = Select;

/**
 * @param {{ onGetListaSubsidiarias: () => void }} props
 */
const ModalCadastrarSubsidiaria = ({ onGetListaSubsidiarias }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [errosValidacao, setErrosValidacao] = useState(null);
  const ufs = useUnidadesFederacao();

  const onCadastrarSubsidiaria = () => {
    const dadosSubsidiaria = form.getFieldsValue();
    setErrosValidacao(null);
    cadastrarSubsidiaria(dadosSubsidiaria)
      .then(() => {
        form.resetFields();
        setVisible(false);
        setErrosValidacao(null);
        onGetListaSubsidiarias();
        message.success('Subsidiária cadastrada com sucesso');
      })
      .catch((error) => {
        const msgErro = Array.isArray(error) ? (
          <Paragraph style={{ textAlign: 'justify' }}>
            Os seguintes erros foram encontrados:
            <ul>
              {error.map((erro) => <li key={erro}>{erro}</li>)}
            </ul>
          </Paragraph>
        ) : (
          error
        );

        setErrosValidacao(msgErro);
      });
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Cadastrar Subsidiária
      </Button>
      <Modal
        title="Cadastro de Subsidiária"
        open={visible}
        onOk={onCadastrarSubsidiaria}
        okText="Cadastrar"
        cancelText="Cancelar"
        width={700}
        onCancel={() => setVisible(false)}
      >
        <Row gutter={[0, 20]}>
          <Col span={24}>
            <Paragraph>
              Preencha o formulário abaixo com as informações necessárias para
              cadastrar uma subsidiária.
            </Paragraph>
            <Paragraph>
              Após salvas, as informações poderão ser utilizadas no
              cadastramento de procurações.
            </Paragraph>
          </Col>

          {errosValidacao !== null && (
            <Col span={24}>
              <Alert
                message="Erros de validação"
                description={errosValidacao}
                type="error"
                showIcon
              />
            </Col>
          )}
          <Col span={24}>
            <FormWithLabelNoWrap {...layout} form={form}>
              <Form.Item
                name="nome"
                label="Nome Completo"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="nomeReduzido"
                label="Nome Reduzido"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="cnpj" label="CNPJ" rules={[{ required: true }]}>
                <MaskedInput
                  className="ant-input"
                  mask={MASK_CNPJ}
                  placeholder="00.000.000/0000-00"
                />
              </Form.Item>
              <Form.Item
                name="endereco"
                label="Endereço"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="complemento"
                label="Complemento"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="bairro"
                label="Bairro"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="cep" label="CEP" rules={[{ required: true }]}>
                <MaskedInput
                  className="ant-input"
                  mask={MASK_CEP}
                  placeholder="00000-000"
                />
              </Form.Item>
              <Form.Item
                name="municipio"
                label="Município"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="uf" label="UF" rules={[{ required: true }]}>
                <Select>
                  {
                    Object.keys(ufs).map(
                      (key) => (
                        <Option key={key}>
                          {ufs[/** @type {keyof typeof ufs} */ (key)]}
                        </Option>
                      )
                    )
                  }
                </Select>
              </Form.Item>
            </FormWithLabelNoWrap>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ModalCadastrarSubsidiaria;

const FormWithLabelNoWrap = styled(Form)`
  & .ant-form-item-label {
    white-space: normal;
    text-align: start;
  }

  & .ant-row {
    line-height: 1.2em;
  }
`;
