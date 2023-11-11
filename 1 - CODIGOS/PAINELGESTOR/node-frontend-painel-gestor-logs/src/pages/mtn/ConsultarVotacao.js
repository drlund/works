import React, { useState, useEffect, useCallback } from "react";
import { Col, Row, message, Skeleton, Divider, Tabs } from "antd";
import { useParams } from "react-router-dom";
import { fetchDadosMonitoramento } from "../../services/ducks/MtnComite.ducks";
import BBSpining from "components/BBSpinning/BBSpinning";
import DadosMonitoramento from "./GerenciarMonitoramentos/DadosMonitoramento";
import LinhaTempoMonitoramento from "./Monitoramento/LinhaTempoMonitoramento";
import ComiteVotacao from "./VotarVersao/ComiteVotacao";
import VersaoEmVotacao from "./VotarVersao/VersaoEmVotacao";

import styles from "./VotarVersao.module.scss";
const ConsultarVotacao = (props) => {
  const { idMonitoramento } = useParams();
  const [dadosMonitoramento, setDadosMonitoramento] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFetchDadosMonitoramento = useCallback(() => {
    setLoading(true);
    fetchDadosMonitoramento(idMonitoramento)
      .then((fetchedDadosMonitoramento) => {
        if (dadosMonitoramento !== null) {
          message.success("Dados do monitoramento atualizado.");
        }
        setDadosMonitoramento(fetchedDadosMonitoramento);
      })
      .catch((error) => {
        message.error("Erro ao recuperar os dados da votação.");
      })
      .then(() => {
        setLoading(false);
      });
  }, [dadosMonitoramento, idMonitoramento]);

  useEffect(() => {
    if (dadosMonitoramento === null) {
      onFetchDadosMonitoramento();
    }
  }, [onFetchDadosMonitoramento, dadosMonitoramento]);

  if (dadosMonitoramento === null) {
    return (
      <BBSpining spinning={loading}>
        <Skeleton />
      </BBSpining>
    );
  }

  return (
    <BBSpining spinning={loading}>
      <Row style={{ paddingBottom: 20 }}>
        <Col span={22} offset={1}>
          <Divider orientation="left">Dados Monitoramento</Divider>
        </Col>
        <Col span={22} offset={1}>
          <div className={styles.comiteWrapper}>
            {loading ? (
              <Skeleton />
            ) : (
              <Tabs type="card">
                <Tabs.TabPane tab="Dados Básicos" key="dadosBasicos">
                  <DadosMonitoramento dadosMonitoramento={dadosMonitoramento} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Linha do Tempo" key="linhaTempo">
                  <LinhaTempoMonitoramento
                    linhaTempo={
                      dadosMonitoramento.linhaTempo
                        ? dadosMonitoramento.linhaTempo
                        : []
                    }
                  />
                </Tabs.TabPane>
              </Tabs>
            )}
          </div>
        </Col>
        <Col span={11} offset={1}>
          <Divider orientation="left" style={{ marginBottom: 30 }}>
            Votos
          </Divider>
          <div className={styles.comiteWrapper}>
            <ComiteVotacao comite={dadosMonitoramento.versaoAtual.comite} />
          </div>
        </Col>
        <Col span={9} offset={1}>
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Divider orientation="left">Parâmetro em Votação</Divider>
            </Col>
            <Col span={24}>
              <VersaoEmVotacao
                versaoEmVotacao={dadosMonitoramento.versaoAtual}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </BBSpining>
  );
};

export default ConsultarVotacao;
