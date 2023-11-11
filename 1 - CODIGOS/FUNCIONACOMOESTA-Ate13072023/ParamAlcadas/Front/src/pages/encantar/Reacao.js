import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, message, Tabs } from "antd";
import BBSpinning from "components/BBSpinning/BBSpinning";
import { connect } from "react-redux";
import { toggleSideBar } from "services/actions/commons";
import { fetchSolicitacaoParaReacao } from "services/ducks/Encantar.ducks";
import DadosSolicitacao from "./solicitacoes/DadosSolicitacao";
import StyledCardPrimary from "components/styledcard/StyledCardPrimary";
import AcessDenied from "../errors/AccessDenied";
import HitoricoSolicitacao from "./solicitacoes/HistoricoSolicitacao";
import FormRegistroReacao from "./reacoes/FormRegistroReacao";
import usePermRegistroReacao from "hooks/encantar/usePermRegistroReacao";
import { salvarReacaoSolicitacao } from "services/ducks/Encantar.ducks";
const { TabPane } = Tabs;

const Reacao = (props) => {
  const [fetching, setFetching] = useState(false);
  const [solicitacao, setSolicitacao] = useState(null);
  const [semAcesso, setSemAcesso] = useState(false);
  const permRegistroReacao = usePermRegistroReacao();
  const { idSolicitacao } = useParams();

  const cbGetSolicitacao = useCallback(
    (idSolicitacao) => {
      setFetching(true);
      return fetchSolicitacaoParaReacao(idSolicitacao)
        .then((dadosSolicitacao) => {
          setSolicitacao(dadosSolicitacao);
        })
        .catch((error) => {
          if (error.code === 401) {
            setSemAcesso(true);
          }
          message.error(error.msg);
        })
        .then(() => {
          setFetching(false);
        });
    },
    [setFetching]
  );

  const registrarReacao = async (formData) => {
    try {
      setFetching(true);
      await salvarReacaoSolicitacao(formData, idSolicitacao);
      setFetching(false);
      setSolicitacao(null);
      cbGetSolicitacao(idSolicitacao);
    } catch (error) {
      message.error(error);
      setFetching(false);
    }
  };

  //UseEffect
  const { toggleSideBar } = props;
  useEffect(() => {
    toggleSideBar(false);
  }, [toggleSideBar]);

  useEffect(() => {
    cbGetSolicitacao(idSolicitacao);
  }, [cbGetSolicitacao, idSolicitacao]);

  if (semAcesso || !permRegistroReacao) {
    return <AcessDenied />;
  }

  return (
    <BBSpinning spinning={fetching}>
      <Row>
        <Col span={24}>
          <Tabs type="card">
            <TabPane tab="Registro da Reação" key={1}>
              {solicitacao && (
                <FormRegistroReacao
                  registrarReacao={registrarReacao}
                  idSolicitacao={idSolicitacao}
                  setFetching={(newFetching) => setFetching(newFetching)}
                />
              )}
            </TabPane>
            <TabPane tab="Dados Solicitação" key={2}>
              <Row>
                <Col style={{ minHeight: 700 }} span={8}>
                  <StyledCardPrimary
                    style={{ minHeight: 650 }}
                    noShadow={false}
                    bodyStyle={{ padding: "34px 24px 34px 24px" }}
                    title={
                      <Row>
                        <Col span={12}>Linha do Tempo da Solicitacao</Col>
                      </Row>
                    }
                  >
                    <HitoricoSolicitacao solicitacao={solicitacao} />
                  </StyledCardPrimary>
                </Col>
                <Col span={16}>
                  <StyledCardPrimary
                    style={{ minHeight: 700 }}
                    noShadow={false}
                    bodyStyle={{ padding: "34px 24px 34px 24px" }}
                    title={
                      <Row>
                        <Col span={12}>Dados da Solicitação</Col>
                      </Row>
                    }
                  >
                    {solicitacao && (
                      <DadosSolicitacao solicitacao={solicitacao} />
                    )}
                  </StyledCardPrimary>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </BBSpinning>
  );
};

export default connect(null, {
  toggleSideBar,
})(Reacao);
