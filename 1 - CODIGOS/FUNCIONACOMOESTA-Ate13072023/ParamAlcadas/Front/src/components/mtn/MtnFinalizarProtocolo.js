import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Input,
  Form,
  Select,
  Checkbox,
  message,
  Spin,
} from "antd";
import { finalizarMtnSemEnvolvido } from "../../services/ducks/Mtn.ducks";
import ListaPrefixosForm from "components/AntdFormCustomFields/ListaPrefixosForm";
import ListaMatriculasForm from "components/AntdFormCustomFields/ListaMatriculasForm";
import AntdUploadForm from "components/AntdUploadForm/AntdUploadForm";
import { useParams } from "react-router-dom";
const { TextArea } = Input;
const { Option } = Select;

const MtnFinalizaProtocolo = (props) => {
  const { idMtn } = useParams();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [informarComplemento, setInformarComplemento] = useState(false);

  const [form] = Form.useForm();

  const TIPOS_ENCERRAMENTO = [
    {
      texto: "Falha em produto/processo",
      valor: "falhaProdutoServico",
      msgComplemento: "Informar diretoria(s) responsável pelo produto/serviço?",
      msgComplementoVazio: "Informe ao menos um prefixo responsável",
      complemento: <ListaPrefixosForm form={form} />,
    },
    {
      texto: "Envolvido não identificado",
      valor: "envolvidoNaoIdentificado",
      complemento: <p>Observacao</p>,
    },
    {
      texto: "Envolvido fora do alcance da Super",
      valor: "envolvidoForaAlcance",
      msgComplemento: "Informar funcionário fora do alcance?",
      msgComplementoVazio: "Informe ao menos um funcionário responsável",
      complemento: <ListaMatriculasForm form={form} />,
    },
    {
      texto: "Irregularidade Funcional Não Comprovada",
      valor: "irregularidadeFuncionalNaoEnvolvida",      
      complemento: <p>Observacao</p>,
    },
  ];

  useEffect(() => {
    if (showModal === false) {
      form.resetFields();
      setTipoSelecionado(null);
      setInformarComplemento(false);
    }
  }, [showModal, form]);

  const getTipoEncerramento = () => {
    const tipoEncerramento = TIPOS_ENCERRAMENTO.find((tipo) => {
      return tipo.valor === tipoSelecionado;
    });

    return tipoEncerramento;
  };

  const isComplementoVazio = ({ complemento, possuiComplemento }) => {
    return (
      possuiComplemento === true &&
      (!complemento.keys || complemento.length === 0)
    );
  };

  const isObservacaoVazia = (observacao) => {
    if (!observacao || observacao === "") {
      return false;
    }
    return true;
  };

  const validarFinalizarSemEnvolvidos = (finalizacao) => {
    const { observacao } = finalizacao;

    const dadosTipoEncerramento = getTipoEncerramento();
    const complementoVazio = isComplementoVazio(finalizacao);
    const observacaoVazia = isObservacaoVazia(observacao);

    if (!dadosTipoEncerramento) {
      return new Promise((resolve, reject) =>
        reject("Informe o tipo de encerramento")
      );
    }

    if (!observacaoVazia) {
      return new Promise((resolve, reject) =>
        reject("A observação é obrigatória")
      );
    }

    if (complementoVazio) {
      return new Promise((resolve, reject) =>
        reject(dadosTipoEncerramento.msgComplementoVazio)
      );
    }

    return new Promise((resolve, reject) => resolve("Gravado com sucesso"));
  };

  const onEncerrarProtocoloSemEnvolvidos = (idMtn, values) => {
    setLoading(true);
    validarFinalizarSemEnvolvidos({ idMtn, ...values })
      .then(() => {
        finalizarMtnSemEnvolvido({ idMtn, ...values })
          .then(() => {
            message.success("MTN finalizado com sucesso");
            setShowModal(false);
            props.fetchMtn();
          })
          .catch(() => {
            message.error("Erro ao encerrar envolvido");
          })
          .then(() => {
            setLoading(false);
          });
      })
      .catch((msgErro) => {
        setLoading(false);
        message.error(msgErro);
      });
  };

  const renderComplemento = () => {
    if (tipoSelecionado === null) {
      return null;
    }

    const tipoEncerramento = getTipoEncerramento(tipoSelecionado);

    const hasComplemento = tipoEncerramento.msgComplemento ? true : false;
    if (!hasComplemento) {
      return null;
    }

    return (
      <>
        {hasComplemento && (
          <Form.Item
            initialValue={false}
            name="possuiComplemento"
            valuePropName="checked"
          >
            <Checkbox
              onChange={(e) => {
                setInformarComplemento(e.target.checked);
              }}
            >
              {tipoEncerramento.msgComplemento}
            </Checkbox>
          </Form.Item>
        )}

        {informarComplemento && (
          <Form.Item name="complemento">
            {
              TIPOS_ENCERRAMENTO.find((tipo) => {
                return tipo.valor === tipoSelecionado;
              }).complemento
            }
          </Form.Item>
        )}
      </>
    );
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Finalizar protocolo</Button>
      <Modal
        title="Finalizar Protocolo Sem Envolvidos"
        visible={showModal}
        onOk={() =>
          onEncerrarProtocoloSemEnvolvidos(idMtn, form.getFieldsValue())
        }
        okButtonProps={{ disabled: !tipoSelecionado, loading: loading }}
        cancelButtonProps={{ loading: loading }}
        onCancel={() => setShowModal(false)}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <Row gutter={[0, 20]}>
          <Col span={24}>
            <Spin spinning={loading}>
              <Form initialValues={{ complemento: {} }} form={form}>
                <Form.Item name="tipoEncerramento">
                  <Select
                    onChange={(value) => setTipoSelecionado(value)}
                    placeholder="Tipo do Encerramento"
                    allowClear
                  >
                    {TIPOS_ENCERRAMENTO.map((tipo, index) => {
                      return (
                        <Option
                          key={`option-tipo-encerramento-${index}`}
                          value={tipo.valor}
                        >
                          {tipo.texto}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item name="observacao">
                  <TextArea rows={4} placeholder="Observação" />
                </Form.Item>
                <AntdUploadForm />
                {renderComplemento()}
              </Form>
            </Spin>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default MtnFinalizaProtocolo;
