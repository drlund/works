import React, { useState, useMemo } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Modal,
  Row,
  Col,
  Typography,
  Select,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import { incluirVersaoMonitoramento } from "../../../services/ducks/MtnComite.ducks";
import styles from "./IncluirVersaoForm.module.scss";
import BBSpining from "components/BBSpinning/BBSpinning";
import history from "history.js";
import constants from "utils/Constants";
const { MTN_COMITE } = constants;
const { ACOES_PARA_VOTACAO } = MTN_COMITE;
const { Text } = Typography;
const { Option } = Select;
const dadosVersaoDefault = {
  tipoVotacao: null,
  motivacao: "",
  documento: null,
};

/**
 * Ações que exigem que a visão possua uma versão atual para ser executada
 */
const ACOES_EXIGEM_VERSAO_ATUAL = [
  ACOES_PARA_VOTACAO.SUSPENDER,
  ACOES_PARA_VOTACAO.INATIVAR,
  ACOES_PARA_VOTACAO.ATIVAR,
];

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

const IncluirVersaoForm = (props) => {
  const { idMonitoramento, onFetchDadosMonitoramento, versaoAtual } = props;

  const [dadosVersao, setDadosVersao] = useState(dadosVersaoDefault);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const onChangeDocumento = (newFile) => {
    if (newFile.type !== "application/pdf") {
      message.error("O documento deve ser um PDF");
      return;
    }

    setDadosVersao({ ...dadosVersao, documento: newFile });
  };

  const onSalvarVersao = () => {
    setLoading(true);
    incluirVersaoMonitoramento(idMonitoramento, dadosVersao)
      .then(() => {
        message.success("Sucesso ao gravar nova versão");
        setShowModal(false);
        setDadosVersao(dadosVersaoDefault);
        onFetchDadosMonitoramento();
        history.push(`/mtn/gerenciar-monitoramentos`);
      })
      .catch((erro) => {
        message.error(erro);
      })
      .then(() => {
        setLoading(false);
      });
  };

  const acoesPermitidas = useMemo(() => {
    return (
      Object.keys(ACOES_PARA_VOTACAO)
        //Quando a visão não tiver versão atual, as ações disponíveis serão filtradas
        .filter((acaoKey) => {
          return (
            versaoAtual !== null ||
            (versaoAtual === null &&
              !ACOES_EXIGEM_VERSAO_ATUAL.includes(ACOES_PARA_VOTACAO[acaoKey]))
          );
        })
    );
  }, [versaoAtual]);

  return (
    <>
      <Modal
        closable={!loading}
        maskClosable={!loading}
        title="Confirmar Inclusão"
        okText="Incluir parâmetros"
        onOk={onSalvarVersao}
        cancelButtonProps={{ loading: loading }}
        okButtonProps={{ type: "danger", loading: loading }}
        visible={showModal}
        onCancel={() => setShowModal(false)}
      >
        <BBSpining spinning={loading}>
          <Row>
            <Col offset={1}>
              <div className={styles.wrapperMsgConfirmacao}>
                <ExclamationCircleOutlined
                  style={{ color: "red", fontSize: 30 }}
                />
                <Text>
                  Ao incluir um novo conjunto de parâmetros, você estará{" "}
                  <Text type="danger" strong>
                    cancelando
                  </Text>{" "}
                  eventuais parâmetros que estejam atualmente aprovados. Tem
                  certeza que deseja continuar?
                </Text>
              </div>
            </Col>
          </Row>
        </BBSpining>
      </Modal>
      <BBSpining spinning={loading}>
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          labelAlign="left"
          layout="horizontal"
        >
          <Form.Item label="Tipo de Votação: ">
            <Select
              style={{ width: 250 }}
              onChange={(value) => {
                setDadosVersao({
                  ...dadosVersao,
                  tipoVotacao: value,
                });
              }}
            >
              {acoesPermitidas.map((acaoKey) => {
                return (
                  <Option value={ACOES_PARA_VOTACAO[acaoKey]}>
                    {ACOES_PARA_VOTACAO[acaoKey]}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Motivação:">
            <Input.TextArea
              value={dadosVersao.motivacao}
              onChange={(e) => {
                setDadosVersao({
                  ...dadosVersao,
                  motivacao: e.target.value,
                });
              }}
              rows={5}
            />
          </Form.Item>

          <Form.Item name="documento" label="Documento" valuePropName="anexos">
            <Upload
              multiple={false}
              disabled={props.disabled ? props.disabled : false}
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
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            {dadosVersao.documento && dadosVersao.documento.name && (
              <ArquivoUpload documento={dadosVersao.documento} />
            )}
          </Form.Item>
        </Form>
        <Button type="primary" onClick={() => setShowModal(true)}>
          Enviar para votação
        </Button>
      </BBSpining>
    </>
  );
};

export default IncluirVersaoForm;
