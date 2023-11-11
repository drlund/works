import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Form,
  Select,
  Input,
  message,
  Upload,
  Button,
  Modal,
  Typography,
} from "antd";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import styles from "../GerenciarMonitoramentos/IncluirVersaoForm.module.scss";
import BBSpining from "components/BBSpinning/BBSpinning";
import constants from "utils/Constants";
import { salvarTratamentoPedidoAlteracao } from "services/ducks/MtnComite.ducks";
import history from "history.js";

const { Text, Paragraph } = Typography;

const { MTN_COMITE } = constants;
const { ACOES_TRATAR_ALTERACAO } = MTN_COMITE;
const ACOES = [ACOES_TRATAR_ALTERACAO.ACEITAR, ACOES_TRATAR_ALTERACAO.RECUSAR];

const { Option } = Select;

const ArquivoUpload = (props) => {
  const { documento } = props;
  return (
    <div className={styles.arquivoWrapper}>
      <div
        className={styles.link}
        onClick={() => {
          window.open(URL.createObjectURL(documento));
        }}
      >
        {documento.name}
      </div>
    </div>
  );
};

const defaultValues = {
  acao: null,
  justificativa: "",
  documento: null,
};

const FormTratarPedidoAlteracao = (props) => {
  const { loading, setLoading, idVersao } = props;
  const [tratamentoAlteracao, setTratamentoAlteracao] = useState(defaultValues);

  const [showModal, setShowModal] = useState(false);

  const isCamposValidos = () => {
    if (tratamentoAlteracao.acao === null) {
      return false;
    }

    if (!tratamentoAlteracao.justificativa) {
      return false;
    }

    if (
      tratamentoAlteracao.acao === ACOES_TRATAR_ALTERACAO.ACEITAR &&
      !tratamentoAlteracao.documento
    ) {
      return false;
    }

    return true;
  };

  const onChangeDocumento = (newFile) => {
    if (newFile.type !== "application/pdf") {
      message.error("O documento deve ser um PDF");
      return;
    }

    setTratamentoAlteracao({ ...tratamentoAlteracao, documento: newFile });
  };

  const onChangeTratamentoAlteracao = (field, value) => {
    const newTratamentoAlteracao = {
      ...tratamentoAlteracao,
      [field]: value,
    };
    setTratamentoAlteracao(newTratamentoAlteracao);
  };

  const onSalvarTratamentoPedidoAlteracao = () => {
    setLoading(true);
    salvarTratamentoPedidoAlteracao(idVersao, tratamentoAlteracao)
      .then(() => {
        setShowModal(false);
        history.push("/mtn/gerenciar-monitoramentos/");
        setLoading(false);
      })
      .catch((error) => message.error(error))
      .then(() => {
        setLoading(false);
      });
  };

  const getTypeMsgConfirmacao = () => {
    switch (tratamentoAlteracao.acao) {
      case ACOES_TRATAR_ALTERACAO.ACEITAR:
        return "success";
      case ACOES_TRATAR_ALTERACAO.RECUSAR:
        return "danger";
      default:
        return "secondary";
    }
  };

  useEffect(() => {
    if (tratamentoAlteracao.acao === ACOES_TRATAR_ALTERACAO.RECUSAR) {
      setTratamentoAlteracao((prev) => ({ ...prev, documento: null }));
    }
  }, [tratamentoAlteracao.acao]);

  const camposValidos = isCamposValidos();
  const typeMsgConfirmacao = getTypeMsgConfirmacao();

  return (
    <>
      <Modal
        title="Confirmação"
        visible={showModal}
        okText="Confirmar"
        closable={!loading}
        maskClosable={!loading}
        okButtonProps={{ loading }}
        cancelButtonProps={{ loading }}
        onOk={() => onSalvarTratamentoPedidoAlteracao()}
        onCancel={() => setShowModal(false)}
      >
        <BBSpining spinning={loading}>
          <Row>
            <Col offset={1}>
              <div className={styles.wrapperMsgConfirmacao}>
                <ExclamationCircleOutlined
                  style={{ color: "red", fontSize: 40 }}
                />
                <div>
                  <Paragraph>
                    Deseja confirmar a operação abaixo? Ela é irreversível!
                  </Paragraph>
                  <Paragraph style={{ marginLeft: 15 }}>
                    <ul>
                      <li>
                        <Text type={typeMsgConfirmacao}>
                          {tratamentoAlteracao.acao}
                        </Text>{" "}
                        o pedido para alterar versão proposta para o monitoramento.
                      </li>
                    </ul>
                  </Paragraph>
                </div>
              </div>
            </Col>
          </Row>
        </BBSpining>
      </Modal>
      <Form labelCol={{ span: 2 }} wrapperCol={{ span: 8 }} labelAlign="left">
        <Form.Item label="Ação">
          <Select
            onChange={(option) => onChangeTratamentoAlteracao("acao", option)}
          >
            {ACOES.map((acao) => {
              return <Option value={acao}>{acao}</Option>;
            })}
          </Select>
        </Form.Item>
        <Form.Item label="Justificativa">
          <Input.TextArea
            onChange={(e) => {
              onChangeTratamentoAlteracao("justificativa", e.target.value);
            }}
            disabled={tratamentoAlteracao.acao === null}
            rows={5}
          />
        </Form.Item>

        <Form.Item
          name="documento"
          label="Novo Documento"
          valuePropName="anexos"
        >
          <Upload
            multiple={false}
            disabled={
              tratamentoAlteracao.acao === ACOES_TRATAR_ALTERACAO.RECUSAR
            }
            onChange={(e) => {
              onChangeDocumento(e.file.originFileObj);
            }}
            showUploadList={false}
            fileList={[]}
            customRequest={({ onSuccess }) => {
              //Hack para dizer ao componente que o arquivo foi carregado com sucesso
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
            name="logo"
            listType="picture"
          >
            <Button
              icon={<UploadOutlined />}
              disabled={
                tratamentoAlteracao.acao === ACOES_TRATAR_ALTERACAO.RECUSAR ||
                tratamentoAlteracao.acao === null
              }
            >
              Upload
            </Button>
          </Upload>
          {tratamentoAlteracao.documento &&
            tratamentoAlteracao.documento.name && (
              <ArquivoUpload documento={tratamentoAlteracao.documento} />
            )}
        </Form.Item>
      </Form>
      <Button
        type="primary"
        disabled={!camposValidos}
        onClick={() => setShowModal(true)}
      >
        Registrar
      </Button>
    </>
  );
};

export default FormTratarPedidoAlteracao;
