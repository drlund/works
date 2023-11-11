import React, { useState } from "react";
import { Timeline, Typography, Button, Modal, Card, Avatar } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import styles from "./fluxoAprovacao.module.scss";
import { getProfileURL, getHumanGramURL } from "utils/Commons";
import ListaAnexosEncantar from "../ListaAnexosEncantar";

const { Text, Paragraph } = Typography;

const getDadosTimeline = (fluxoAtual, fluxo) => {
  // Finalizado e deferido
  if (fluxo.finalizadoEm && fluxo.tipoFinalizacao === "deferir") {
    return {
      icone: <CheckCircleOutlined style={{ color: "green" }} />,
      mensagem: `Deferido por ${fluxo.matriculaFinalizacao} - ${fluxo.nomeFinalizacao} em ${fluxo.finalizadoEm}`,
      justificativa: fluxo.justificativa,
    };
  }
  // Finalizado e indeferido
  if (fluxo.finalizadoEm && fluxo.tipoFinalizacao === "indeferir") {
    return {
      icone: <CloseCircleOutlined style={{ color: "red" }} />,
      mensagem: `Indeferido por ${fluxo.matriculaFinalizacao} - ${fluxo.nomeFinalizacao} em ${fluxo.finalizadoEm}`,
      justificativa: fluxo.justificativa,
    };
  }

  // Finalizado à revelia
  if (fluxo.finalizadoEm && fluxo.tipoFinalizacao === "revelia") {
    return {
      icone: <StopOutlined style={{ color: "red" }} />,
      mensagem: `Fechado à revelia.`,
    };
  }

  // Fluxo atual
  if (fluxo.sequencia === fluxoAtual.sequencia) {
    return {
      mensagem: `Pendente aprovação`,
    };
  }

  //Pendente
  if (fluxo.sequencia > fluxoAtual.sequencia) {
    return {
      pendente: true,
      icone: <ClockCircleOutlined style={{ color: "gray" }} />,
      mensagem: `Aguardando parecer dos fluxos anteriores`,
    };
  }
};

const FluxoAprovacao = (props) => {
  const [dadosModal, setDadosModal] = useState(null);

  const { solicitacao } = props;
  const { fluxoUtilizado, fluxoAtual } = solicitacao;
  return (
    <div style={{ marginTop: 45 }}>
      <Timeline>
        {fluxoUtilizado.map((fluxo, index) => {
          const dadosTimeline = getDadosTimeline(fluxoAtual, fluxo);
          return (
            <Timeline.Item dot={dadosTimeline.icone} color={dadosTimeline.cor} key={index + 1}>
              <Paragraph
                strong={dadosTimeline.pendente === true ? false : true}
              >{`${fluxo.prefixoAutorizador} - ${fluxo.nomePrefixoAutorizador}`}</Paragraph>
              <Paragraph type="secondary">{dadosTimeline.mensagem}</Paragraph>
              {fluxo.finalizadoEm && fluxo.justificativa && (
                <Button
                  size="small"
                  type="primary"
                  onClick={() => setDadosModal(fluxo)}
                >
                  {" "}
                  Visualizar{" "}
                </Button>
              )}
            </Timeline.Item>
          );
        })}
      </Timeline>

      <Modal
        footer={
          <Button type="primary" onClick={() => setDadosModal(null)}>
            Fechar
          </Button>
        }
        onCancel={() => setDadosModal(null)}
        visible={dadosModal !== null}
      >
        {dadosModal !== null && (
          <Card
            title={
              <>
                <Avatar src={getProfileURL(dadosModal.matriculaFinalizacao)} />{" "}
                {
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={getHumanGramURL(dadosModal.matriculaFinalizacao)}
                  >
                    {dadosModal.nomeFinalizacao}
                  </a>
                }
              </>
            }
            style={{ width: "95%", marginTop: 16 }}
          >
            <div className={styles.cardContent}>
              <div className={styles.cardJustificativa}>
                {dadosModal.justificativa}
              </div>
                <Text strong> Anexos: </Text>
              <div className={styles.listaAnexos}>
                <ListaAnexosEncantar anexos={dadosModal.anexos} />
              </div>
              <div className={styles.dataFinalizacao}>
                <Text strong>{dadosModal.finalizadoEm}</Text>
              </div>
            </div>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default FluxoAprovacao;
