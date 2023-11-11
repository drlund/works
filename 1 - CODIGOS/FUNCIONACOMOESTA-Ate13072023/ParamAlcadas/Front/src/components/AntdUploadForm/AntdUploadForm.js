import React from "react";
import { Upload, Form, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";


/**
 *  Componente de upload de arquivos para ser utilizado dentro do contexto de um Form do Antd

 */

const AntdUploadForm = (props) => {

  return (
    <Form.Item name="anexos" valuePropName="anexos">
      <Upload
        disabled={props.disabled ? props.disabled : false}
        customRequest={({ onSuccess }) => {
          //Hack para dizer ao componente que o arquivo foi carregado com sucesso
          setTimeout(() => {
            onSuccess("ok");
          }, 0);
        }}
        name="logo"
        listType="picture"
      >
        <Button icon={<UploadOutlined />}>Selecione os anexos</Button>
      </Upload>
    </Form.Item>
  );
};

export default AntdUploadForm;
