import React, { useState } from "react";

import { Col, Row, Timeline, Avatar, Typography, Button, Modal } from "antd";
import ReactHtmlParser from "react-html-parser";
import { getProfileURL } from "utils/Commons";

const { Paragraph, Text } = Typography;

const JustificativaHistorico = (props) => {
  const [showModalJustificativa, setShowModalJustificativa] = useState(false);
  const { justificativa } = props;
  return (
    <>
      <Button
        size="small"
        type="primary"
        onClick={() => setShowModalJustificativa(true)}
      >
        Justificativa
      </Button>
      <Modal
        width={1000}
        title={"Justificativa da ação"}
        footer={
          <Button
            type="primary"
            onClick={() => setShowModalJustificativa(false)}
          >
            Fechar
          </Button>
        }
        onCancel={() => setShowModalJustificativa(false)}
        visible={showModalJustificativa}
      >
        <div>{ReactHtmlParser(justificativa)}</div>
      </Modal>
    </>
  );
};

const HistoricoSolicitacao = (props) => {
  const { solicitacao } = props;

  return (
    <Row>
      <Col span={24}>
        <Timeline>
          {solicitacao &&
            solicitacao.historico.map((acaoHistorico) => {
              return (
                <Timeline.Item
                  dot={
                    <Avatar src={getProfileURL(acaoHistorico.matriculaFunci)} />
                  }
                >
                  <Paragraph>
                    <Text strong>
                      {`${acaoHistorico.matriculaFunci} - ${acaoHistorico.nomeFunci}`}
                    </Text>
                  </Paragraph>
                  <Paragraph>
                    <Text> {`${acaoHistorico.acao.descricao}`} </Text>
                  </Paragraph>
                  {acaoHistorico.justificativa !== null && (
                    <Paragraph>
                      <JustificativaHistorico
                        justificativa={acaoHistorico.justificativa}
                      />
                    </Paragraph>
                  )}
                  <Paragraph>
                    <Text type="secondary" style={{ fontSize: "90%" }}>
                      {`${acaoHistorico.createdAt}`}
                    </Text>
                  </Paragraph>
                </Timeline.Item>
              );
            })}
        </Timeline>
      </Col>
    </Row>
  );
};

export default HistoricoSolicitacao;
