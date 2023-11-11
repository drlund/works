import { Button, Form, Image, message, Modal, Space, Tooltip, Upload } from "antd";
import { useState } from "react";
import { FileImageOutlined, UploadOutlined } from '@ant-design/icons';
import { updateCapaCanal } from '../apiCalls/apiPodcasts';
import { imgFallback } from '../fallbackImage';

export default function EditarCapaCanal({ record, handleEdit }) {
  const [open, setOpen] = useState(false);
  const [editandoCapa, setEditandoCapa] = useState(record);
  const [form] = Form.useForm();

  const onEditandoCapa = () => {
    setEditandoCapa({...record})
    setOpen(true);
  };

  const onFinish = () => {
    updateCapaCanal(form.getFieldsValue())
      .then((updatedRecord) => {
        message.success('Capa atualizada com sucesso');
        resetEditing();
        handleEdit(updatedRecord);
      })
      .catch((error) => {
        message.error(error);
      });
  }

  const resetEditing = () => {
    setOpen(false);
    setEditandoCapa(null);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Envie um arquivo .png ou .jpg');
    }
    return isJpgOrPng;
  };

  return (
    <>
      <Button type="secondary" size="small" onClick={() => onEditandoCapa()}>
        <Tooltip title="Visualizar e editar Imagem de Capa">
          <FileImageOutlined />
        </Tooltip>
      </Button>
      <Form
        name="editarCapa"
        wrapperCol={{
          span: 8,
        }}
        initialValues={{
          remember: true,
        }}
        onSubmitCapture={onFinish}
        autoComplete="off"
        form={form}
      >
        <Modal
          title="Editar Imagem de Capa"
          open={open}
          onOk={() => onFinish()}
          okText="Confirmar"
          onCancel={() => resetEditing()}
          cancelText="Cancelar"
          width={350}
        >
          <Space direction="vertical" align="center" size="large">
            <Image
              fallback={imgFallback}
              width={200}
              height={200}
              src={`${process.env.REACT_APP_ENDPOINT_API_URL}/uploads/multimidia/podcast/${editandoCapa?.imagem}`}
              style={{ backgroundColor: '#f1f1f1' }}
            />
            <Form.Item
              label="id"
              name="id"
              defaultValue={editandoCapa?.id}
              style={{ visibility: 'hidden', display: 'none' }}
              initialValue={editandoCapa?.id}>
              {editandoCapa?.id}
            </Form.Item>
            <Form.Item
              name="novaImagem"
              fileList={['name']}
              tooltip="Dimensões da imagem: 200x200 pixels"
              rules={[
                {
                  required: false,
                  message: 'Inclua uma imagem para a capa do canal',
                },
              ]}
            >
              <Upload
                type="file"
                name="capa"
                accept="image/png, image/jpeg"
                maxCount={1}
                data-testid="uploadCanalPodcasts"
                beforeUpload={beforeUpload}>
                <Button icon={<UploadOutlined />}>Clique para enviar uma nova imagem</Button>
              </Upload>
            </Form.Item>
          </Space>
        </Modal>
      </Form>
    </>
  );
}