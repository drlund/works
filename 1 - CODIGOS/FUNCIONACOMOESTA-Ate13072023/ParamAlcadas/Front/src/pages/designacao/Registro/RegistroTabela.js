import React, { useState, useEffect, useCallback } from "react";
import StyledCardPrimary from "components/styledcard/StyledCardPrimary";
import SearchTable from "components/searchtable/SearchTable";
import PageLoading from "components/pageloading/PageLoading";
import { showConcluidos, setDocumento } from "services/ducks/Designacao.ducks";
import _ from "lodash";

import {
  Button,
  Modal,
  message,
  Row,
  Col,
  Typography,
  Card,
  Divider,
  Skeleton,
  Drawer,
} from "antd";

import { RedoOutlined } from "@ant-design/icons";
import TabelaDesignacao from "pages/designacao/Commons/TabelaDesignacao";

import 'pages/designacao/Commons/TabelaDesignacao.css';
import ConteudoDrawer from "./ConteudoDrawer";

const { Text, Title } = Typography;

function RegistroTabela() {
  const [concluidos, setConcluidos] = useState();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [solicitacao, setSolicitacao] = useState();

  const mostraPendencias = useCallback(() => {
    setLoading((loading) => true);
    showConcluidos()
      .then((concluidos) => setConcluidos(concluidos))
      .catch((error) => message.error(error))
      .then(() => setLoading(false));
  }, []);

  useEffect(() => {

    let isMounted = true;

    isMounted && setLoading(true);
    showConcluidos()
      .then((concluidos) => isMounted && setConcluidos(concluidos))
      .catch((error) => message.error(error))
      .then(() => isMounted && setLoading(false));

    return () => isMounted = false
  }, [setConcluidos, setLoading]);

  const confirmaSisBB = () => {
    setDocumento({
      id: solicitacao.id,
      id_historico: 30,
      texto: null,
      tipo: null,
    })
      .then((result) => {
        setSolicitacao(null);
        mostraPendencias();
      })
      .catch((error) => message.error(error))
      .then(() => setModalVisible(false));
  };

  const cancelaSisBB = () => {
    setDocumento({
      id: solicitacao.id,
      id_historico: 20,
      texto:
        "\nProcesso Necessita de Reanálise por Inconsistência de Informações.",
      tipo: null,
    })
      .then((result) => {
        setSolicitacao(null);
        mostraPendencias();
      })
      .catch((error) => message.error(error))
      .then(() => setModalVisible(false));
  };

  const renderTabelaRegistro = () => {
    return (
      <SearchTable
        columns={TabelaDesignacao({
          comp: "registro",
          metodos: {
            confirmaExecucao: confirmaExecucao,
          },
        })}
        locale={{
          emptyText: loading && <><Skeleton active /><Skeleton active /><Skeleton active /></>
        }}
        dataSource={concluidos}
        size="small"
        loading={
          loading
            ? {
              spinning: loading,
              indicator: <PageLoading customClass="flexbox-row" />,
            }
            : false
        }
      ></SearchTable>
    );
  };

  const confirmaExecucao = (solicitacao) => {
    setSolicitacao(prev => solicitacao);
  };

  useEffect(() => {
    setModalVisible(!!solicitacao);
  }, [solicitacao]);

  const closeModal = () => {
    setSolicitacao(null);
  };

  const conteudoModal = () => {
    if (!solicitacao) {
      return null;
    }

    return (
      <Card
        title={<Title level={3}>Confirmação da {solicitacao.nomeTipo}</Title>}
        headStyle={{ textAlign: "center" }}
      >
        {solicitacao.tipo === 1 && (
          <>
            <Card
              title={<Title level={4}>Onde gravar?</Title>}
              headStyle={{ textAlign: "center" }}
            >
              <Col style={{ textAlign: "center" }}>
                <Text strong>SisBB - Sistema ARH 2.13</Text>
              </Col>
            </Card>
            <Divider />
            <Row>
              <Col span={12}>
                <Card
                  title={<Title level={4}>Designado</Title>}
                  headStyle={{ textAlign: "center" }}
                >
                  <Row>
                    <Col>Funcionário:</Col>
                  </Row>
                  <Row>
                    <Col offset={2} span={20}>
                      <Text strong>
                        {solicitacao.chaveFunciIndicado}{" "}
                        {_.isNil(solicitacao.nomeFunciIndicado)
                          ? "Matrícula Fora da Base"
                          : solicitacao.nomeFunciIndicado}{" "}
                        {_.isNil(solicitacao.nomeFunciIndicado)
                          ? "Matrícula Fora da Base"
                          : solicitacao.prefixoLotacaoFunciIndicado}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>Prefixo de Origem:</Col>
                  </Row>
                  <Row>
                    <Col offset={2} span={20}>
                      <Text strong>
                        {solicitacao.prefixoOrigem} {solicitacao.nomePrefixoOrigem}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>Função de Origem:</Col>
                  </Row>
                  <Row>
                    <Col offset={2} span={20}>
                      <Text strong>
                        {solicitacao.codFuncaoOrigem}{" "}
                        {solicitacao.nomeFuncaoOrigem}
                      </Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title={<Title level={4}>Movimentação</Title>}
                  headStyle={{ textAlign: "center" }}
                >
                  <Row>
                    <Col>Função de Destino:</Col>
                  </Row>
                  <Row>
                    <Col offset={2} span={20}>
                      <Text strong>
                        {solicitacao.codFuncaoDestino}{" "}
                        {solicitacao.nomeFuncaoDestino}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>Prefixo de Destino:</Col>
                  </Row>
                  <Row>
                    <Col offset={2} span={20}>
                      <Text strong>
                        {solicitacao.prefixoDestino} {solicitacao.nomePrefixoDestino}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>Período:</Col>
                  </Row>
                  <Row>
                    <Col offset={2} span={20}>
                      <Text strong>
                        {solicitacao.dataInicioMovimentacao} a{" "}
                        {solicitacao.dataFimMovimentacao} (
                        {solicitacao.qtdeDiasTotais}{" "}
                        {solicitacao.qtdeDiasTotais > 1 ? "dias" : "dia"})
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>Funci Ausente:</Col>
                  </Row>
                  <Row>
                    <Col offset={2} span={20}>
                        {
                          solicitacao.chaveFunciAusente &&
                            <Text strong>
                              {solicitacao.chaveFunciAusente}{" "}
                              {_.isNil(solicitacao.nomeFunciAusente)
                                ? "Matrícula Fora da Base"
                                : solicitacao.nomeFunciAusente}
                            </Text>
                        }
                    </Col>
                  </Row>
                  {
                    solicitacao.motivosAusencia.length > 0 &&
                      <>
                        <Row>
                          <Col>Motivos:</Col>
                        </Row>
                        <Row>
                          <Col offset={2} span={20}>
                            {
                              solicitacao.motivosAusencia.map((motivo, index) => {
                                const indice = solicitacao.motivosAusencia.length - index;
                                const indiceCorrigido = [1, 2].includes(indice) ? indice : 0;
                                const tag = [0, 2].includes(indiceCorrigido) && <br />;
                                const complemIndice = [
                                  ',',
                                  '.',
                                  ', e',
                                ]

                                return (
                                  <React.Fragment key={index}>
                                    <Text strong>{motivo + complemIndice[indiceCorrigido]}</Text>{tag}
                                  </React.Fragment>
                                )
                              })
                            }
                          </Col>
                        </Row>
                      </>
                  }
                </Card>
              </Col>
            </Row>
            <Divider />
          </>
        )}
        {(solicitacao.tipo === 2 ||
          (solicitacao.tipo === 1 && solicitacao.superRegional)) && (
            <>
              <Card
                title={<Title level={4}>Onde gravar?</Title>}
                headStyle={{ textAlign: "center" }}
              >
                <Col style={{ textAlign: "center" }}>
                  <Text strong>SisBB - Sistema ARH 2.13</Text>
                </Col>
              </Card>
              <Divider />
              <Card title="Adido">
                <Row>
                  <Col>Funcionário:</Col>
                </Row>
                <Row>
                  <Col offset={2} span={20}>
                    <Text strong>
                      {solicitacao.chaveFunciIndicado}{" "}
                      {_.isNil(solicitacao.nomeFunciIndicado)
                        ? "Matrícula Fora da Base"
                        : solicitacao.nomeFunciIndicado}
                    </Text>
                  </Col>
                </Row>
                <Row>
                  <Col>Prefixo de Origem:</Col>
                </Row>
                <Row>
                  <Col offset={2} span={20}>
                    <Text strong>
                      {solicitacao.prefixoOrigem} {solicitacao.nomePrefixoOrigem}
                    </Text>
                  </Col>
                </Row>
              </Card>
              <Card title="Movimentação">
                <Row>
                  <Col>Prefixo de Destino:</Col>
                </Row>
                <Row>
                  <Col offset={2} span={20}>
                    <Text strong>
                      {solicitacao.prefixoDestino} {solicitacao.nomePrefixoDestino}
                    </Text>
                  </Col>
                </Row>
                <Row>
                  <Col>Função de Destino:</Col>
                </Row>
                <Row>
                  <Col offset={2} span={20}>
                    <Text strong>
                      {solicitacao.codFuncaoDestino}{" "}
                      {solicitacao.nomeFuncaoDestino}
                    </Text>
                  </Col>
                </Row>
                  {
                    solicitacao.motivosAusencia.length > 0 &&
                      <>
                        <Row>
                          <Col>Motivos:</Col>
                        </Row>
                        <Row>
                          <Col offset={2} span={20}>
                            {
                              solicitacao.motivosAusencia.map((motivo, index) => {
                                const indice = solicitacao.motivosAusencia.length - index;
                                const indiceCorrigido = [1, 2].includes(indice) ? indice : 0;
                                const tag = [0, 2].includes(indiceCorrigido) && <br />;
                                const complemIndice = [
                                  ',',
                                  '.',
                                  ', e',
                                ]

                                return (
                                  <React.Fragment key={index}>
                                    <Text strong>{motivo + complemIndice[indiceCorrigido]}</Text>{tag}
                                  </React.Fragment>
                                )
                              })
                            }
                          </Col>
                        </Row>
                      </>
                  }
                <Row>
                  <Col>Período:</Col>
                </Row>
                <Row>
                  <Col offset={2} span={20}>
                    <Text strong>
                      {solicitacao.dataInicioMovimentacao} a{" "}
                      {solicitacao.dataFimMovimentacao} (
                      {solicitacao.qtdeDiasTotais}{" "}
                      {solicitacao.qtdeDiasTotais > 1 ? "dias" : "dia"})
                    </Text>
                  </Col>
                </Row>
              </Card>
              <Divider />
            </>
          )}
        <Card>
          <Row>
            <Col span={21}>
              Ao clicar no botão{" "}
              <Text style={{ color: "blue" }}>CONFIRMAR</Text>, você{" "}
              <Text strong>confirma que registrou os comandos</Text> necessários
              para realizar a Movimentação Transitória, referente ao protocolo
              <Text style={{ fontSize: "1.2em" }} keyboard>
                {solicitacao.protocolo}
              </Text>
              .
            </Col>
            <Col span={3}>
              <Button block type="primary" onClick={confirmaSisBB}>
                CONFIRMAR
              </Button>
            </Col>
          </Row>
        </Card>
        <Divider />
        <Card>
          <Row>
            <Col span={21}>
              Ao clicar no botão <Text style={{ color: "red" }}>CANCELAR</Text>,
              você devolve o processo para reanálise, a partir da SuperAdm.
            </Col>
            <Col span={3}>
              <Button block type="primary" danger onClick={cancelaSisBB}>
                CANCELAR
              </Button>
            </Col>
          </Row>
        </Card>
      </Card>
    );
  };

  const modal = () => {
    return (
      <Modal
        visible={modalVisible}
        width={"60%"}
        destroyOnClose
        centered
        maskClosable={false}
        onOk={closeModal}
        closable={false}
        onCancel={closeModal}
        footer={[
          <Button key={1} onClick={closeModal}>
            Fechar
          </Button>,
        ]}
      >
        {conteudoModal()}
      </Modal>
    );
  };

  const closeDrawer = () => {
    setDrawerVisible((ant) => false);
  }

  const openDrawer = () => {
    setDrawerVisible((ant) => true);
  }

  const drawer = () => {
    return (
      <Drawer
        visible={drawerVisible}
        width={"60%"}
        destroyOnClose
        maskClosable
        closable={false}
        onCancel={closeDrawer}
        footer={[
          <Button key={1} onClick={closeDrawer}>
            Fechar
          </Button>,
        ]}
      >
        <ConteudoDrawer />
      </Drawer>
    );
  };

  return (
    <>
      <StyledCardPrimary
        title={<Title level={3}>Quadro de Solicitações a Registrar</Title>}
      >
        <Row gutter={[0, 10]}>
          <Col span={2} offset={20}>
            <Button block type="primary" onClick={() => openDrawer()}>Templates</Button>
          </Col>
          <Col span={1} offset={1}>
            <Button onClick={mostraPendencias}>
              <RedoOutlined />
            </Button>
          </Col>
        </Row>
        {renderTabelaRegistro()}
      </StyledCardPrimary>
      {modal()}
      {drawer()}
    </>
  );
}

export default React.memo(RegistroTabela);
