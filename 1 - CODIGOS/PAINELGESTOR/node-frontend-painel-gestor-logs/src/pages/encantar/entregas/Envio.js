import React, { useEffect, useState } from "react";
import { Row, Col, message, Alert } from "antd";
import {
  fetchSolicitacao,
  salvarRegistroEntrega,
} from "services/ducks/Encantar.ducks";
import DadosEntrega from "../solicitacoes/DadosEntrega";
import BBSpinning from "components/BBSpinning/BBSpinning";
import StyledCardPrimary from "components/styledcard/StyledCardPrimary";
import DadosSolicitacao from "../solicitacoes/DadosSolicitacao";
import RegistroEnvioSolicitacao from "./RegistroEnvioSolicitacao";
import DadosEnvioRegistrado from "./DadosEnvioRegistrado";
import ImprimirEtiquetas from "../ImprimirEtiqueta/ImprimirEtiquetas";
import { useParams } from "react-router-dom";
import ModalEditarLocalEntrega from "./ModalEditarLocalEntrega";

const isReenvio = (solicitacao) => {
  return (
    solicitacao.tratamentoDevolucao !== null &&
    solicitacao.idSolicitacoesStatus === 4
  );
};

const Envio = (props) => {
  const { idSolicitacao } = useParams();
  const [solicitacao, setSolicitacao] = useState(null);
  const [erro, setError] = useState(null);

  const onFetchSolicitacao = (idSolicitacao) => {
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
  };

  const registrarEnvio = (dadosEntrega) => {
    return salvarRegistroEntrega(dadosEntrega, idSolicitacao)
      .then(() => {
        message.success("Registrado com sucesso");
        setSolicitacao(null);
      })
      .catch((erro) => {
        message.error(erro);
      });
  };

  useEffect(() => {
    if (solicitacao === null && erro === null) {
      onFetchSolicitacao(idSolicitacao);
    }
  }, [solicitacao, erro, idSolicitacao]);

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
                <Col span={12}>Registro do Envio</Col>
              </Row>
            }
          >
            {solicitacao && isReenvio(solicitacao) && (
              <Row gutter={[0, 10]} style={{ marginBottom: 10 }}>
                <Col span={24}>
                  <Alert
                    type="error"
                    message="Atenção, esta solicitação já foi devolvida. Favor conferir o endereço do cliente para evitar a devolução novamente."
                  />
                </Col>
              </Row>
            )}
            {solicitacao && (
              <Col span={24}>
                <ModalEditarLocalEntrega
                  fetchSolicitacao={() => setSolicitacao(null)}
                  solicitacao={solicitacao}
                />
                {solicitacao.brindesSelecionados.length > 0 &&
                  solicitacao.enderecoCliente && (
                    <ImprimirEtiquetas solicitacao={solicitacao} />
                  )}
              </Col>
            )}
            {solicitacao && (
              <Row style={{ marginBottom: 15, marginTop: 15 }}>
                <Col span={24}>
                  <DadosEntrega solicitacao={solicitacao} />
                </Col>
              </Row>
            )}
            {solicitacao && solicitacao.envio && !isReenvio(solicitacao) ? (
              <DadosEnvioRegistrado solicitacao={solicitacao} />
            ) : (
              <RegistroEnvioSolicitacao
                registrarEnvio={(dadosEntrega) => registrarEnvio(dadosEntrega)}
                solicitacao={solicitacao}
              />
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
            {solicitacao && (
              <DadosSolicitacao
                solicitacao={solicitacao}
                excluirAbas={["entrega"]}
              />
            )}
          </StyledCardPrimary>
        </Col>
      </Row>
    </BBSpinning>
  );
};

export default Envio;
