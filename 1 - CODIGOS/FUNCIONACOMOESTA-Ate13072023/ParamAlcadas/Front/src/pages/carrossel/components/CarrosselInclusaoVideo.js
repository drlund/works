import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button, Typography, Form, Upload, DatePicker, Space, message
} from 'antd';
import styled from "styled-components";
import { postVideo } from '../apiCalls/apiCarrossel';

const dateFormat = 'DD/MM/YYYY';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 32,
  },
};

const FormItemPersonalizado = styled(Form.Item)`
   .ant-form-item-control-input-content {
    flex: none;
  }
  .ant-tooltip-content {
    display: none;
  }
`;

export default function InclusaoVideo() {
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = () => {
    postVideo(form.getFieldsValue())
      .then(() => {
        message.success('Vídeo incluído com sucesso!');
        onReset();
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const disabledDate = (current) => (
    new Date(current).getDay() === 0 ||
    new Date(current).getDay() === 6
  );

  return (
    <>
      <Typography.Paragraph>
        Preencha as informações abaixo para incluir um vídeo na programação.
      </Typography.Paragraph>
      <Form {...layout} form={form} name="control-hooks" onSubmitCapture={onFinish}>
        <FormItemPersonalizado name="dataInicioReproducao" label="Data de Reprodução do Vídeo" rules={[{ required: true }]}>
          <DatePicker format={dateFormat} disabledDate={disabledDate} />
        </FormItemPersonalizado>
        <FormItemPersonalizado name="video" label="Vídeo" fileList={['name']} rules={[{ required: true }]}>
          <Upload accept="video/*,.mp4" maxCount={1} data-testid="uploadCarrossel">
            <Button icon={<UploadOutlined />}>Fazer upload do vídeo</Button>
          </Upload>
        </FormItemPersonalizado>
        <FormItemPersonalizado {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Enviar
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Cancelar
            </Button>
          </Space>
        </FormItemPersonalizado>
      </Form>
    </>
  );
}


//  &. 