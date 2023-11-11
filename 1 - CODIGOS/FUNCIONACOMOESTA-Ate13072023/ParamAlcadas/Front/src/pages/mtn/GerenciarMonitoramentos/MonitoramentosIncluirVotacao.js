import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, message, Divider, Tabs } from "antd";
import { useParams } from "react-router-dom";
import { fetchDadosMonitoramento } from "../../../services/ducks/MtnComite.ducks";
import BBSpining from "components/BBSpinning/BBSpinning";
import IncluirVersaoForm from "./IncluirVersaoForm";
import InstrucoesIncluirVersao from "./InstrucoesIncluirVersao";
import DadosVersaoAtual from "./DadosVersaoAtual";
import HistoricoVersoes from "./HistoricoVersoes";
import DadosMonitoramento from "./DadosMonitoramento";

const MonitoramentosIncluirVotacao = (props) => {
  const { idMonitoramento } = useParams();

  const [dadosMonitoramento, setDadosMonitoramento] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFetchDadosMonitoramento = useCallback(() => {
    setLoading(true);
    fetchDadosMonitoramento(idMonitoramento)
      .then((fetchedDadosMonitoramento) => {
        message.success("Dados atualizados com sucesso");
        setDadosMonitoramento(fetchedDadosMonitoramento);
      })
      .catch((error) => {
        message.error("Erro ao recuperar dados");
      })
      .then(() => {
        setLoading(false);
      });
  }, [idMonitoramento]);

  useEffect(() => {
    if (dadosMonitoramento === null) {
      onFetchDadosMonitoramento();
    }
  }, [dadosMonitoramento, onFetchDadosMonitoramento]);

  if (dadosMonitoramento === null) {
    return null;
  }

  const { versaoAtual, versoes } = dadosMonitoramento;

  return (
    <BBSpining spinning={loading}>
      <Row gutter={[0, 20]} style={{ paddingBottom: 15 }}>
        <Col span={22} offset={1}>
          <Divider orientation="left">Dados Monitoramento</Divider>
        </Col>
        <Col span={22} offset={1}>
          <DadosMonitoramento dadosMonitoramento={dadosMonitoramento} />
        </Col>
        <Col span={22} offset={1}>
          <Divider orientation="left">Versões</Divider>
        </Col>
        <Col span={22} offset={1}>
          <Tabs type="card">
            <Tabs.TabPane tab="Nova Versão" key="nova_versao">
              <Row gutter={[0, 20]}>
                <Col span={24}>
                  <InstrucoesIncluirVersao />
                </Col>
                <Col span={24}>
                  <IncluirVersaoForm
                    versaoAtual={versaoAtual}
                    idMonitoramento={idMonitoramento}
                    onFetchDadosMonitoramento={onFetchDadosMonitoramento}
                  />
                </Col>
              </Row>
            </Tabs.TabPane>
            {versaoAtual && (
              <Tabs.TabPane tab="Versão Atual" key="versao_atual">
                <DadosVersaoAtual
                  setLoading={setLoading}
                  versaoAtual={versaoAtual}
                />
              </Tabs.TabPane>
            )}
            {versoes && versoes.length > 0 && (
              <Tabs.TabPane tab="Histórico de versões" key="historico_versoes">
                <HistoricoVersoes versoes={dadosMonitoramento.versoes} />
              </Tabs.TabPane>
            )}
          </Tabs>
        </Col>
      </Row>
    </BBSpining>
  );
};

export default MonitoramentosIncluirVotacao;
