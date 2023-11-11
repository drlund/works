import React, { useEffect, useState } from "react";
import { Row, Col, message } from "antd";

import { fetchSolicitacao } from "services/ducks/Encantar.ducks";
import Erro from "components/erros/Erro";
import BBSpinning from "components/BBSpinning/BBSpinning";
import StyledCardPrimary from "components/styledcard/StyledCardPrimary";
import DadosSolicitacao from "./solicitacoes/DadosSolicitacao";
import HitoricoSolicitacao from "./solicitacoes/HistoricoSolicitacao";
import { useParams } from "react-router-dom";

const Solicitacao = (props) => {
  const { idSolicitacao } = useParams();
  const [solicitacao, setSolicitacao] = useState(null);
  const [erro, setError] = useState(null);

  useEffect(() => {
    if (solicitacao === null && erro === null) {
      fetchSolicitacao(idSolicitacao)
        .then((dadosSolicitacao) => {
          setSolicitacao(dadosSolicitacao);
        })
        .catch((error) => {
          if (!error.request) {
            message.error(error);
          }
          if (error.request.status === 404) {
            setError({
              codigo: 404,
              msg:
                "Solicitação não encontrada. Verifique se o identificador está correto",
            });
          } else if (error.request.status === 403) {
            setError({
              codigo: 403,
              msg:
                "Só estão autorizados a consultar esta solicitação os funcionários do prefixo de quem a criou.",
            });
          } else {
            setError({
              codigo: 500,
              msg:
                "Erro de sistema, favor tentar novamente. Caso o problema persista, entre em contato com a Super Adm",
            });
          }
        });
    }
  }, [solicitacao, erro, idSolicitacao]);

  if (erro !== null) {
    return <Erro erro={erro} />;
  }

  return (
    <BBSpinning spinning={solicitacao === null}>
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
            {solicitacao && <DadosSolicitacao solicitacao={solicitacao} />}
          </StyledCardPrimary>
        </Col>
      </Row>
    </BBSpinning>
  );
};

export default Solicitacao;
