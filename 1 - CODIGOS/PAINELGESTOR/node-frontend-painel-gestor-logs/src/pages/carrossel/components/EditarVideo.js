import React, { useState } from 'react';
import {
  Button, DatePicker, Form, Modal, message
} from 'antd';
import moment from 'moment';
import { updateVideo } from '../apiCalls/apiCarrossel';
import { regexNomeVideo } from '../helpers/regex';

const dateFormat = 'DD/MM/YYYY';
const layout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 8,
  },
};

export default function EditarVideo({ record, handleEdit }) {
  const [open, setOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [form] = Form.useForm();

  const onEditVideo = () => {
    setOpen(true);
    setEditingVideo({ ...record });
  };

  const resetEditing = () => {
    setOpen(false);
    setEditingVideo(null);
  };
  const onFinish = () => {
    const novaData = moment(form.getFieldValue('novaDataInicioReproducao')).format('YYYY-MM-DD');
    const dados = { id: record.id, novaDataInicioReproducao: novaData };
    updateVideo(dados)
      .then((updatedRecord) => {
        message.success('Data de reprodução editada com sucesso!');
        setOpen(false);
        handleEdit(updatedRecord);
      })
      .catch((error) => {
        message.error(error.response.data);
      });
    
  };

  return (
    <>
      <Button type="secondary" size="small" onClick={() => onEditVideo(record)}>
        Editar
      </Button>

      <Modal
        title="Editar Vídeo"
        open={open}
        onCancel={() => resetEditing()}
        onOk={() => onFinish()}
        okText="Salvar"
      >
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item name="novaDataInicioReproducao" label="Data de Reprodução do Vídeo" rules={[{ required: true }]}>
            <DatePicker format={dateFormat} defaultValue={moment(`${editingVideo?.dataInicioReproducao}`)} />
          </Form.Item>
          <Form.Item name="video" label="Vídeo">
            <a href={`https://super.intranet.bb.com.br/superadm/assets/files/pages/${editingVideo?.urlVideo}`} target="_blank" rel="noreferrer">{regexNomeVideo(editingVideo?.urlVideo)}</a>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
