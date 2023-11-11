import React, { useState } from "react";
import {
  Row,
  Col,
  Form,
  Select,
  Input,
  Button,
  Alert,
  Modal,
  Upload,
  Typography,
  message,
} from "antd";
import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { votar } from "../../../services/ducks/MtnComite.ducks";
import constants from "../../../utils/Constants";

const { MTN_COMITE } = constants;
const { ACOES_VOTO } = MTN_COMITE;

const { Option } = Select;
const { Paragraph } = Typography;
const { useForm } = Form;
const { APROVAR, ALTERAR } = ACOES_VOTO;

const FormVotar = (props) => {
  const { loading, setLoading, idMonitoramento, onFetchDadosMonitoramento } =
    props;

  const [tipoVoto, setTipoVoto] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [form] = useForm();

  const votoNaoSelecionado = tipoVoto === null;

  const onVotar = () => {
    const dadosVoto = form.getFieldsValue();
    const anexos =
      dadosVoto.anexos && dadosVoto.anexos.fileList
        ? dadosVoto.anexos.fileList
        : [];
    setLoading(true);
    votar(idMonitoramento, { ...dadosVoto, anexos })
      .then(() => {
        message.success("Voto registrado com sucesso");
        onFetchDadosMonitoramento();
      })
      .catch((error) => {
        message.error("Erro ao registrar o voto");
      })
      .then(() => {
        setLoading(false);
      });
  };

  return (
    <Row gutter={[0, 20]}>
      <Col span={24}>
        {tipoVoto === ALTERAR && (
          <Alert
            message="Ao solicitar alterações o campo justificativa deve ser preenchido com os detalhes da alteração desejada. Caso a alteração seja aceita, todos os votos já registrados serão descartados e a votação será reiniciada."
            type="warning"
          />
        )}
      </Col>
      <Col span={24}>
        <Form
          form={form}
          labelCol={{ span: 4 }}
          labelAlign="left"
          wrapperCol={{ span: 20 }}
        >
          <Form.Item name="tipoVoto" label="Voto">
            <Select
              onChange={(value) => {
                setTipoVoto(value);
              }}
              placeholder="Selecione o voto desejado"
            >
              <Option value={APROVAR}>Aprovar</Option>
              <Option value={ALTERAR}>Solicitar Alterações</Option>
            </Select>
          </Form.Item>
          <Form.Item name="justificativa" label="Justificativa">
            <Input.TextArea rows={5} disabled={votoNaoSelecionado} />
          </Form.Item>
          <Form.Item name="anexos" label="Anexos" valuePropName="anexos">
            <Upload
              multiple
              disabled={votoNaoSelecionado}
              customRequest={({ onSuccess }) => {
                //Hack para dizer ao componente que o arquivo foi carregado com sucesso
                setTimeout(() => {
                  onSuccess("ok");
                }, 0);
              }}
              name="logo"
            >
              <Button disabled={votoNaoSelecionado} icon={<UploadOutlined />}>
                Upload
              </Button>
            </Upload>
          </Form.Item>
        </Form>
        <Button
          type="primary"
          onClick={() => setShowModal(true)}
          disabled={votoNaoSelecionado}
          loading={loading}
        >
          Votar
        </Button>
      </Col>
      <Modal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        okText="Votar"
        okButtonProps={{ loading: loading }}
        onOk={() => {
          onVotar();
        }}
      >
        <Row style={{ marginTop: 20 }}>
          <Col span={22} offset={1}>
            <div style={{ display: "flex" }}>
              <ExclamationCircleOutlined
                style={{ fontSize: 50, color: "red" }}
              />
              <Paragraph style={{ paddingLeft: 15 }}>
                Tem certeza que deseja registrar seu voto? Essa operação não
                pode ser desfeita!
              </Paragraph>
            </div>
          </Col>
        </Row>
      </Modal>
    </Row>
  );
};

export default FormVotar;
