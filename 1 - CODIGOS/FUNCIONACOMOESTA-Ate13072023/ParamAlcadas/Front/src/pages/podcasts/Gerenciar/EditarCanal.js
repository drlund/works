import React, { useState } from 'react';
import {
  Button, Form, Modal, Input, message, Tooltip
} from 'antd';
import { EditOutlined, } from '@ant-design/icons';
import { updateCanal } from '../apiCalls/apiPodcasts';

export default function EditarCanal({ record, handleEdit }) {
  const [open, setOpen] = useState(false);
  const [editingCanal, setEditingCanal] = useState(record);
  const [form] = Form.useForm();

  const onEditCanal = () => {
    setEditingCanal({ ...record });
    setOpen(true);
  };

  const resetEditing = () => {
    setOpen(false);
    setEditingCanal(null);
  };

  const updateInfos = () => {
    const { novoNome, novaDescricao } = form.getFieldsValue();
    const canalEditado = { id: editingCanal.id }

    if(Boolean(novoNome) && novoNome !== editingCanal?.nome) {
      canalEditado.novoNome = novoNome
    }

    if(Boolean(novaDescricao) && novaDescricao !== editingCanal?.novaDescricao) {
      canalEditado.novaDescricao = novaDescricao
    }

    return canalEditado
  }


  const onFinish = () => {
    const dados = updateInfos();
    updateCanal(dados)
      .then((updatedRecord) => {
        message.success('Canal atualizado com sucesso');
        setOpen(false);
        handleEdit(updatedRecord);
      })
      .catch((error) => {
        message.error(error.response.data);
      });
    }
 

  return (
    <>
      <Button type="secondary" size="small" onClick={() => onEditCanal()}>
      <Tooltip title="Editar detalhes do canal">
        <EditOutlined />
        </Tooltip>
      </Button>

      <Modal
        title="Editar Canal"
        open={open}
        onCancel={() => resetEditing()}
        onOk={() => onFinish()}
        okText="Salvar"
      >
        <Form labelCol={{
          span: 8,
        }}
          wrapperCol={{
            span: 16,
          }}
          form={form}
          name="editarCanal"
          >
          <Form.Item
            label="id"
            name="id"
            style={{ visibility: 'hidden', display: 'none' }}
            defaultValue={editingCanal?.id}>
            {editingCanal?.id}
          </Form.Item>
          <Form.Item
            label="Nome canal"
            name="novoNome"
            rules={[
              {
                required: true,
                message: 'O canal precisa ter um nome',
              },
            ]}
          >
            <Input
              defaultValue={editingCanal?.nome}
            />
          </Form.Item>
          <Form.Item
            label="Descrição"
            name="novaDescricao"
            rules={[
              {
                required: true,
                message: 'O canal precisa ter uma descrição',
              },
            ]}
          >
            <Input.TextArea
              defaultValue={editingCanal?.descricao}
            />
          </Form.Item>
        </Form>

      </Modal>
    </>
  );
}
