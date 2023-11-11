import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import FluxoAprovacao from "./aprovacoes/FluxoAprovacao";

import { Col, Row, message } from "antd";
import BBSpinning from "components/BBSpinning/BBSpinning";
import { connect } from "react-redux";
import { toggleSideBar } from "services/actions/commons";
import { fetchSolicitacaoAprovacao } from "services/ducks/Encantar.ducks";
import DadosSolicitacao from "./solicitacoes/DadosSolicitacao";
import AreaAprovacao from "./aprovacoes/AreaAprovacao";
import StyledCardPrimary from "components/styledcard/StyledCardPrimary";
import AcessDenied from "../errors/AccessDenied";
const Aprovacao = (props) => {
  
  const [fetching, setFetching] = useState(false);
  const [solicitacao, setSolicitacao] = useState(null);
  const [semAcesso, setSemAcesso] = useState(false);
  const { idSolicitacao } = useParams();

  const cbGetSolicitacao = useCallback(
    (idSolicitacao) => {
      setFetching(true);
      return fetchSolicitacaoAprovacao(idSolicitacao)
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

  //UseEffect
  const { toggleSideBar } = props;
  useEffect(() => {
    toggleSideBar(false);
  }, [toggleSideBar]);

  useEffect(() => {
    cbGetSolicitacao(idSolicitacao);
  }, [cbGetSolicitacao, idSolicitacao]);

  if (semAcesso) {
    return <AcessDenied />;
  }

  return (
    <BBSpinning spinning={fetching}>
      <Row>
        <Col style={{ minHeight: 700 }} span={8}>
          <StyledCardPrimary
            style={{ minHeight: 650 }}
            noShadow={false}
            bodyStyle={{ padding: "34px 24px 34px 24px" }}
            title={
              <Row>
                <Col span={12}>Fluxo Aprovação</Col>
              </Row>
            }
          >
            {solicitacao && (
              <>
                <AreaAprovacao
                  reloadAprovacao={() => cbGetSolicitacao(idSolicitacao)}
                  solicitacao={solicitacao}
                />
                <FluxoAprovacao solicitacao={solicitacao} />
              </>
            )}
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
            {solicitacao && <DadosSolicitacao solicitacao={solicitacao} excluirAbas={[  "fluxoUtilizado" ]} verificaPermEdicaoCarta={true}/>}
          </StyledCardPrimary>
        </Col>
      </Row>
    </BBSpinning>
  );
};

export default connect(null, {
  toggleSideBar,
})(Aprovacao);
