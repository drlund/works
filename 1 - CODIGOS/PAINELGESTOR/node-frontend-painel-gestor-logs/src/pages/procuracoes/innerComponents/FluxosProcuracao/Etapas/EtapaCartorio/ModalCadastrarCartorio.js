import {
  Alert, Button, Col, Form,
  Input, message, Modal, Row, Select, Typography
} from 'antd';
import React, { useState } from 'react';
import MaskedInput from 'react-text-mask';

import { useCartorios } from '@/pages/procuracoes/contexts/CartorioContext';
import useUnidadesFederacao from 'hooks/useUnidadesFederacao';
import MASCARAS from 'utils/Masks';

import cadastrarCartorio from './apiCalls/cadastrarCartorio';

const { MASK_CNPJ, MASK_CEP } = MASCARAS;
const { Paragraph } = Typography;
const { Option } = Select;

const ModalCadastrarCartorio = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [errosValidacao, setErrosValidacao] = useState(null);
  const ufs = useUnidadesFederacao();
  const { reload: reloadCartorios } = useCartorios();

  const onCadastrarCartorio = () => {
    const dadosCartorio = form.getFieldsValue();
    setErrosValidacao(null);
    cadastrarCartorio(dadosCartorio)
      .then(() => {
        form.resetFields();
        setVisible(false);
        setErrosValidacao(null);
        reloadCartorios();
        message.success('Cartório cadastrado com sucesso');
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
        Cadastrar Cartório
      </Button>
      <Modal
        title="Cadastro de cartório"
        open={visible}
        onOk={onCadastrarCartorio}
        okText="Cadastrar"
        cancelText="Cancelar"
        width={700}
        onCancel={() => setVisible(false)}
      >
        <Row gutter={[0, 20]}>
          <Col span={24}>
            <Paragraph>
              Preencha o formulário abaixo com as informações necessárias para
              cadastrar um cartório.
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
            <Form {...layout} form={form}>
              <Form.Item name="nome" label="Nome" rules={[{ required: true }]}>
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
            </Form>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ModalCadastrarCartorio;
