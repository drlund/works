import React, { useState } from "react";
import { Row, Col, Button, Modal, Input, Form, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import ListaPrefixosForm from "components/AntdFormCustomFields/ListaPrefixosForm";
import ListaMatriculasForm from "components/AntdFormCustomFields/ListaMatriculasForm";
import { salvarDadosForaAlcance } from "../../services/ducks/Mtn.ducks";
import AntdUploadForm from "components/AntdUploadForm/AntdUploadForm";

import constants from "utils/Constants";
const { MTN } = constants;
const { FALHA_PRODUTO_SERVICO, IRREGULARIDADE_FUNCIONAL_NAO_COMPROVADA } =
  MTN.medidas;

const { TIPO_FALHA_PRODUTO_SERVICO, ENVOLVIDO_FORA_ALCANCE } =
  MTN.tipoComplemento;

const getTipoComplemento = (medidaSelecionada) => {
  let tipoComplemento = "";
  switch (medidaSelecionada) {
    case FALHA_PRODUTO_SERVICO:
      tipoComplemento = TIPO_FALHA_PRODUTO_SERVICO;
      break;
    case IRREGULARIDADE_FUNCIONAL_NAO_COMPROVADA:
      tipoComplemento = ENVOLVIDO_FORA_ALCANCE;
      break;
    default:
      tipoComplemento = null;
      break;
  }

  return tipoComplemento;
};

const { TextArea } = Input;

const ModalComplementoNaoAlcancado = (props) => {
  const { idMtn } = useParams();

  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const { medidaSelecionada } = props;

  const salvarComplemento = ({ observacao, anexos, complemento }) => {
    setLoading(true);
    let tipoComplemento = getTipoComplemento(medidaSelecionada);

    if (tipoComplemento === null) {
      message.error("Medida selecionada não permite complemento");
      return;
    }

    salvarDadosForaAlcance({
      tipoComplemento,
      idMtn,
      observacao,
      arquivos: anexos && anexos.fileList ? anexos.fileList : [],
      listaForaAlcance: Array.isArray(complemento) ? complemento : [],
    })
      .then(() => {
        message.success("Complemento salvo com sucesso");
        form.resetFields();
        setShowModal(false);
      })
      .catch(() => message.error("Erro ao salvar o complemento"))
      .then(() => {
        setLoading(false);
      });
  };

  if (
    ![FALHA_PRODUTO_SERVICO, IRREGULARIDADE_FUNCIONAL_NAO_COMPROVADA].includes(
      medidaSelecionada
    )
  ) {
    return null;
  }

  const complementos = {};
  complementos[FALHA_PRODUTO_SERVICO] = {
    title: "Informe o prefixo responsável pelo produto",
    description:
      "Aqui você poderá dar informações o(s) prefixo(s) responsáveis pelo produto/serviço que resultaram na ocorrência. Além disso, deverá descrever quais fatos levaram a essa conclusão e incluir eventuais anexos que possam reforçá-la. Essas informações são salvas no momento em que clicar no botão salvar e não ficam disponíveis para o envolvido e não tem relação com o parecer.",
    component: <ListaPrefixosForm form={form} />,
  };

  complementos[IRREGULARIDADE_FUNCIONAL_NAO_COMPROVADA] = {
    title:
      "Informe funcionários envovlidos e que estejam fora da alçada da Super",
    description:
      "Aqui poderá dar informações sobre envolvidos que estão fora da alçada da Super. Essas informações são salvas no momento em que clicar no botão salvar e não ficam disponíveis para o envolvido e não tem relação com o parecer.",
    component: <ListaMatriculasForm form={form} />,
  };

  return (
    <>
      <Button type="primary" onClick={() => setShowModal(true)}>
        Informar Complemento
      </Button>
      <Modal
        width={600}
        title={complementos[medidaSelecionada].title}
        visible={showModal}
        maskClosable={!loading}
        onOk={() => salvarComplemento(form.getFieldsValue())}
        okButtonProps={{ loading: loading }}
        cancelButtonProps={{ loading: loading }}
        onCancel={() => {
          form.resetFields();
          setShowModal(false);
        }}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Row gutter={[0, 20]}>
          <Col span={24}>
            <p>{complementos[medidaSelecionada].description}</p>
          </Col>
          <Col span={24}>
            <Spin spinning={loading}>
              <Form initialValues={{ complemento: {} }} form={form}>
                <Form.Item name="observacao">
                  <TextArea rows={4} placeholder="Descrição do fatos" />
                </Form.Item>
                <AntdUploadForm />
                <Form.Item name="complemento">
                  {complementos[medidaSelecionada].component}
                </Form.Item>
              </Form>
            </Spin>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ModalComplementoNaoAlcancado;
