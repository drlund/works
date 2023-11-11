import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Space, Upload } from "antd";
import { postCanal } from '../apiCalls/apiPodcasts';

export default function CriarCanalForm() {
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = () => {
    postCanal(form.getFieldsValue())
      .then(() => {
        message.success('Canal incluído com sucesso!');
        onReset();
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Envie um arquivo .png ou .jpg');
    }
    return isJpgOrPng ;
  };

  return (
    <Form
      name="incluirCanal"
      labelCol={{
        span: 4,
      }}
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
      <Form.Item
        label="Nome canal"
        name="nome"
        rules={[
          {
            required: true,
            message: 'Inclua o nome do canal',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Imagem de Capa "
        name="imagem"
        fileList={['name']}
        tooltip="Dimensões da imagem: 200x200 pixels"
        rules={[
          {
            required: true,
            message: 'Inclua uma imagem para a capa do canal',
          },
        ]}
      > 
        <Upload type="file" name="capa" accept="image/png, image/jpeg" maxCount={1} data-testid="uploadCanalPodcasts" beforeUpload={beforeUpload}>
          <Button icon={<UploadOutlined />}>Clique para enviar</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        label="Descrição"
        name="descricao"
        rules={[
          {
            required: true,
            message: 'Inclua uma descrição para o canal',
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 4,
          span: 16,
        }}
      >
        <Space>
          <Button type="secondary" htmlType="reset" onClick={onReset}>
            Limpar
          </Button>
          <Button type="primary" htmlType="submit">
            Criar
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}