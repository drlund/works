import React, { useState, useEffect } from "react";
import SearchTable from "../searchtable/SearchTable";
import { FormOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Tooltip,
  Modal,
  Input,
  Form,
  Row,
  Col,
  Upload,
  Button,
  Spin,
  message,
  Select,
} from "antd";
import AlfaSort from "utils/AlfaSort";
import { useSelector, useDispatch } from "react-redux";
import {
  solicitarAlteracaoMedida,
  fetchMedidas,
} from "services/ducks/Mtn.ducks";
import DadosParecerReverterSolicitacao from "./MtnDadosParecerReverterSolicitacao";

const { TextArea } = Input;
const { Option } = Select;

const defaultDados = {
  novaMedida: null,
  txtJustificativa: "",
  listaAnexos: [],
};


const MtnListaPareceres = (props) => {
  //Hooks
  const dispatch = useDispatch();
  const pareceresFinalizados = useSelector(
    ({ mtn }) => mtn.admOcorrencias.reversao.pareceresFinalizados
  );

  
  const [parecerAtual, setParecerAtual] = useState(null);
  const [dadosReversao, setDadosReversao] = useState(defaultDados);
  const [solicitandoReversao, setSolicitandoReversao] = useState(false);
  const [medidas, setMedidas] = useState([]);

  const handleFormChange = (field, value) => {
    const newDadosReversao = { ...dadosReversao };
    newDadosReversao[field] = value;
    setDadosReversao(newDadosReversao);
  };

  useEffect(() => {
    if (parecerAtual === null) {
      setDadosReversao(defaultDados);
    }
  }, [parecerAtual]);

  useEffect(() => {
    fetchMedidas().then((fetchedMedidas) => {
      setMedidas(fetchedMedidas);
    });
  }, []);

  //Funções

  const removeArquivo = (arquivoRemovido) => {
    setDadosReversao((prevData) => {
      return {
        ...prevData,
        listaAnexos: prevData.listaAnexos.filter(
          (arquivo) => arquivo !== arquivoRemovido
        ),
      };
    });
    return;
  };

  const addArquivo = (arquivo) => {
    setDadosReversao((prevData) => {
      return {
        ...prevData,
        listaAnexos: [...prevData.listaAnexos, arquivo],
      };
    });
    return;
  };

  const onSolicitarAlteracaoMedida = () => {
    //TODO Transfeirr o comportamento de solicitar reversão para um hook
    setSolicitandoReversao(true);

    solicitarAlteracaoMedida(
      { ...dadosReversao, idEnvolvido: parecerAtual.idEnvolvido },
      dispatch
    )
      .then(() => {
        setParecerAtual(null);
        message.success("Solicitação de reversão gravada com sucesso.");
        props.reloadFunc();
      })
      .catch((error) => message.error(error))
      .then(() => setSolicitandoReversao(false));
  };

  //Table Columns
  const columns = [
    {
      dataIndex: "nrMtn",
      title: "Nr. Mtn",
      sorter: (a, b) => AlfaSort(a.nrMtn, b.nrMtn),
    },
    {
      dataIndex: "matricula",
      title: "Matrícula",
      sorter: (a, b) => AlfaSort(a.matricula, b.matricula),
    },
    {
      dataIndex: "nomeFunci",
      title: "Nome",
      sorter: (a, b) => AlfaSort(a.matricula, b.matricula),
    },

    {
      title: "Ações",
      align: "center",
      render: (text, record) => (
        <Tooltip title="Solicitar Reversão">
          <FormOutlined
            onClick={() => setParecerAtual({ ...record })}
            className="link-color link-cursor"
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <SearchTable columns={columns} dataSource={pareceresFinalizados} />{" "}
      <Modal
        title="Alteração da Medida"
        visible={parecerAtual}
        onCancel={() => setParecerAtual(null)}
        width={800}
        closable={!solicitandoReversao}
        maskClosable={!solicitandoReversao}
        footer={[
          <Button
            key="back"
            loading={solicitandoReversao}
            onClick={() => setParecerAtual(null)}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={solicitandoReversao}
            onClick={() => onSolicitarAlteracaoMedida()}
          >
            Solicitar Alteração de Medida
          </Button>,
        ]}
      >
        {parecerAtual && (
          <Spin spinning={solicitandoReversao}>
            <Row gutter={[0, 30]}>
              <Col span={24}>
                <DadosParecerReverterSolicitacao envolvido={parecerAtual} />
              </Col>
              <Col span={24}>
                <Form labelAlign="left">
                  <Form.Item label="Nova Medida">
                    <Select
                      value={dadosReversao.novaMedida}
                      onChange={(value) =>
                        handleFormChange("novaMedida", value)
                      }
                    >
                      {medidas.map((medida) => {
                        return (
                          <Option
                            disabled={
                              medida.id === parecerAtual.medidaSelecionada.id
                            }
                            value={medida.id}
                          >
                            {medida.txtMedida}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Justificativa para alteração">
                    <TextArea
                      value={dadosReversao.txtJustificativa}
                      onChange={(evt) => {
                        handleFormChange("txtJustificativa", evt.target.value);
                      }}
                      rows={4}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Upload
                      onRemove={removeArquivo}
                      beforeUpload={addArquivo}
                      fileList={dadosReversao.listaAnexos}
                      customRequest={() => {
                        return;
                      }}
                    >
                      <Button>
                        <UploadOutlined /> Incluir Arquivo
                      </Button>
                    </Upload>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Spin>
        )}
      </Modal>
    </>
  );
};

export default MtnListaPareceres;
