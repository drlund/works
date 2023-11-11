import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  Row,
  Col,
  Rate,
  Spin,
  message,
} from "antd";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import AntdUploadForm from "components/AntdUploadForm/AntdUploadForm";
import { avancarNoFluxo } from "services/ducks/Encantar.ducks";

const { TextArea } = Input;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const formInitialValues = {
  justificativa: "",
  avaliacao: 0,
  anexos: [],
};

const validarDados = (dadosAprovacao) => {
  const { justificativa, avaliacao } = dadosAprovacao;
  return new Promise((resolve, reject) => {
    const erros = [];
    if (!justificativa || justificativa === "") {
      erros.push("Justificativa é obrigatória!");
    }

    if (!avaliacao || avaliacao === 0 || avaliacao < 0 || avaliacao > 5) {
      erros.push("Valor da avaliação inválido");
    }

    if (erros.length > 0) {
      for (const erro of erros) {
        message.error(erro);
      }
      reject(erros);
    }

    resolve();
  });
};

const FormAprovacao = (props) => {
  const [form] = Form.useForm();
  const [fetching, setFetching] = useState(false);
  const [modalData, setModalData] = useState({
    showModal: false,
    tipo: null,
    mensagem: "",
  });

  const onSalvarAprovacao = async (tipo, dadosAprovacao) => {
    try {
      setFetching(true);
      await validarDados(dadosAprovacao);
      await avancarNoFluxo(props.idSolicitacao, { tipo, ...dadosAprovacao });
      setModalData({ showModal: false, tipo: null, mensagem: "" });
      form.resetFields();
      setFetching(false);
      await props.reloadAprovacao();
    } catch (erro) {
      message.error(erro);
      setFetching(false);
    }
  };

  return (
    <>
      <Form {...layout} initialValues={formInitialValues} form={form}>
        <Form.Item name="justificativa" label="Justificativa: ">
          <TextArea rows={5} />
        </Form.Item>

        <Form.Item name="avaliacao" label="Avalie esta solicitação">
          <Rate />
        </Form.Item>

        <AntdUploadForm form={form} />

        <Form.Item>
          <Button
            style={{ marginRight: 10 }}
            type="primary"
            danger
            onClick={() => {
              setModalData({
                showModal: true,
                modalAction: () =>
                  onSalvarAprovacao("indeferir", form.getFieldsValue()),
                mensagem:
                  "Deseja realmente indeferir essa solicitação? Essa ação é irreversível!",
                icone: (
                  <CloseCircleOutlined
                    style={{ fontSize: 50, color: "#FF4D4F" }}
                  />
                ),
              });
            }}
          >
            Indeferir
          </Button>

          <Button
            type="primary"
            onClick={() => {
              setModalData({
                showModal: true,
                modalAction: () =>
                  onSalvarAprovacao("deferir", form.getFieldsValue()),
                mensagem: "Deseja realmente deferir essa solicitação?",
                icone: (
                  <CheckCircleOutlined
                    style={{ fontSize: 50, color: "#52C41A" }}
                  />
                ),
              });
            }}
          >
            Deferir
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title={"Confirmação"}
        visible={modalData.showModal}
        onOk={() => modalData.modalAction()}
        onCancel={() => setModalData({ ...modalData, showModal: false })}
        cancelButtonProps={{loading: fetching}}
        okButtonProps={{loading: fetching}}        
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <Spin spinning={fetching}>
          <Row>
            <Col span={4}>{modalData.icone} </Col>
            <Col span={20}>{modalData.mensagem}</Col>
          </Row>
        </Spin>
      </Modal>
    </>
  );
};

export default FormAprovacao;
