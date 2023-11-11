import React, { useState } from "react";
import { Row, Col, Form, Upload, Button, Popconfirm, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import RichEditor from "components/richeditor/RichEditor";
import { ExclamationCircleOutlined } from "@ant-design/icons";


const menuRichEditor = {
  insert: {
    title: "Insert",
    items:
      "image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime",
  },
};

const validarFormData = (formData) => {
  if (!formData || !formData.justificativa) {
    return new Promise((resolve, reject) => reject("Preencha a Justificativa"));
  }

  return new Promise((resolve, reject) => {
    resolve();
  });
};

const FormCancelarSolicitacao = (props) => {
  const [formData, setFormData] = useState({});
  const { idSolicitacao } = props;

  return (
    <Row style={{ marginTop: 15 }} gutter={[0, 20]}>
      <Col span={24}>
        <Popconfirm
          placement="bottom"
          title={
            "Tem certeja que deseja concelar essa solicitação? Essa operação é irreversível!"
          }
          onConfirm={() => {
            validarFormData(formData)
              .then(() => {
                props.salvarCancelamento({ ...formData, idSolicitacao });
              })
              .catch((erro) => {
                message.error(erro);
              });
          }}
          icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          okText="Sim"
          cancelText="Não"
        >
          <Button type={"danger"}>Registrar Cancelamento</Button>
        </Popconfirm>
      </Col>
      <Col span={24}>
        <Form>
          <Form.Item
            labelAlign="left"
            label="Justificativa para o cancelamento da solicitação"
          >
            <RichEditor
              onBlur={(e) => {
                setFormData({
                  ...formData,
                  justificativa: e.target.getContent(),
                });
              }}
              menu={menuRichEditor}
              height={500}
            />
          </Form.Item>
          <Form.Item name="anexos" valuePropName="anexos">
            <Upload
              disabled={props.disabled ? props.disabled : false}
              onChange={(event) => {
                setFormData({
                  ...formData,
                  anexos: event.fileList,
                });
              }}
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
        </Form>
      </Col>
    </Row>
  );
};

export default FormCancelarSolicitacao;
