import React, { useEffect } from 'react';
import { Form, Input, Modal, Select, message } from 'antd';

import { postFerramenta } from '../../apiCalls/ferramentaCall';

function CadastrarFeraramentaModal({ open, onClose, refreshStatus}) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [open]);

  const onFinish = async () => {
    try {
      await form.validateFields();
      try {
        const ferramenta = form.getFieldsValue()
        await postFerramenta(ferramenta);
        refreshStatus();
        form.resetFields();
        onClose();
        message.success('Ferramenta criada com sucesso!');
      } catch (err) {
        message.error(`Não foi possível criar a ferramenta. Error: ${err}`);
      } 
    } catch (error) {
      message.error('Campos Obrigatórios não preenchidos.');
    }
  };

  return (
    <Modal
      title="Cadastrar nova ferramenta"
      open={open}
      onOk={onFinish}
      cancelText="Cancelar"
      width={700}
      onCancel={() => onClose()}
    >
       <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
        <Form.Item
          name="nome"
          label="Nome"
          rules={[{ required: true, message: 'Por favor, insira o nome da ferramenta' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="descricao"
          label="Descrição"
          rules={[{ required: true, message: 'Por favor, insira a descrição da ferramenta' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="rootPath"
          label="Root Path"
          rules={[{ required: true, message: 'Por favor, insira o path da ferramenta' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="host"
          label="Host"
          rules={[{ required: true, message: 'Por favor, insira o host da ferramenta' }]}
        >
          <Select placeholder="Selecione o Host">
            <Select.Option value="v8">V8</Select.Option>
            <Select.Option value="php">PHP</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="codigoStatus"
          label="Status"
          rules={[{ required: true, message: 'Por favor, selecione o status da ferramenta' }]}
        >
          <Select placeholder="Selecione o status">
            <Select.Option value="1">On Line</Select.Option>
            <Select.Option value="2">Em Manutenção</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CadastrarFeraramentaModal;
