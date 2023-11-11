import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, Typography, Tabs, message } from "antd";
import { verifyPermission } from "utils/Commons";
import IrParaSolicitacao from "./reacoes/IrParaSolicitacao";
import TabelaSolicitacoesParaReacao from "./reacoes/TabelaSolicitacoesParaReacao";
import FiltrosSolicitacoesParaReacao from "./reacoes/FiltrosSolicitacoesParaReacao";
import { fetchSolicitacoesParaReacao } from "services/ducks/Encantar.ducks";
import usePermRegistroReacao from "hooks/encantar/usePermRegistroReacao";
import AccessDenied from "pages/errors/AccessDenied";
import MinhasSolicitacoesParaReacao from "./reacoes/MinhasSolicitacoesParaReacao";
import BBSpinning from "components/BBSpinning/BBSpinning";

const { Paragraph, Title } = Typography;
const { TabPane } = Tabs;
const Reacoes = (props) => {
  const { authState } = props;

  const [filtros, setFiltros] = useState(null);
  const [loading, setLoading] = useState(false);
  const [solicitacoesParaReacao, setSolicitacoesParaReacao] = useState([]);
  const [
    globalPermissionRegistroReacao,
    setGlobalPermissionRegistroReacao,
  ] = useState(false);

  const permRegistroReacao = usePermRegistroReacao();

  useEffect(() => {
    const permAnalisarMTN = verifyPermission({
      ferramenta: "Encantar",
      permissoesRequeridas: ["REACOES_CLIENTES"],
      authState,
    });
    setGlobalPermissionRegistroReacao(permAnalisarMTN);
  }, [authState]);

  useEffect(() => {
    const getSolicitacoesParaReacao = async (filtros) => {
      setLoading(true);
      try {
        const solicitacoes = await fetchSolicitacoesParaReacao(filtros);
        setSolicitacoesParaReacao(solicitacoes);
        setLoading(false);
      } catch (error) {
        message.error("Erro ao recuperar solicitações");
      }
    };

    if (filtros !== null) {
      getSolicitacoesParaReacao(filtros);
    }
  }, [filtros]);

  if (!permRegistroReacao) {
    return (
      <AccessDenied
        nomeFerramenta={"Encantar - Registrar Reações de Clientes"}
      />
    );
  }

  return (
    <BBSpinning spinning={loading}>
    <Row gutter={[0, 20]}>
      
      <Col span={24} style={{ marginTop: 20, marginBottom: 20 }}>
        <Card>
          <Title level={5}>Reações dos clientes</Title>
          <Paragraph>
            Após o envio dos brindes e/ou carta ao cliente é possível que o
            mesmo venha a se manifestar publicamente em relação à ação
            conduzida. Tal manifestação pode ocorrer em Redes Sociais, Fale Com
            seu Gerente, CABB e outros. Quando isso acontecer, é muito
            importante registrá-las, uma vez que isso nos permite acompanhar os
            efeitos das ações na satisfação de nossos clientes.
          </Paragraph>
          <Paragraph>
            Neste módulo da ferramenta, é possível selecionar as ações já
            finalizadas e realizar o registro das reações de nossos clientes.
          </Paragraph>
        </Card>
      </Col>
      <Col span={24}>
        <Tabs type="card">
          <TabPane tab="Minhas Solicitações" key={1}>
            <Row>
              <Col span={24}>
                <MinhasSolicitacoesParaReacao
                  setLoading={(newLoading) => setLoading(newLoading)}
                 />
              </Col>
            </Row>
          </TabPane>
          {globalPermissionRegistroReacao && (
            <TabPane tab="Pesquisar Solicitações" key={2}>
              <Row>
                <Col span={24}>
                  <IrParaSolicitacao />
                  <FiltrosSolicitacoesParaReacao
                    atualizarFiltros={(filtros) => setFiltros(filtros)}
                  />
                </Col>
                <Col span={24}>
                  <TabelaSolicitacoesParaReacao
                    loading={loading}
                    solicitacoesParaReacao={solicitacoesParaReacao}
                  />
                </Col>
              </Row>
            </TabPane>
          )}
        </Tabs>
      </Col>
    </Row>
    </BBSpinning>
  );
};

const mapStateToProps = (state) => {
  return {
    authState: state.app.authState,
  };
};

export default connect(mapStateToProps, {})(Reacoes);
