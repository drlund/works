import React, { useEffect, useState, useRef } from "react";
import DadosCliente from "./DadosCliente";
import ReactHtmlParser from "react-html-parser";
import RedeSocialTabela from "./RedeSocialTabela";
import { Tabs, Card, Descriptions, Typography, Button, message } from "antd";
import BrindesList, { MODOS } from "../estoque/BrindesList";
import styles from "./finalizarSolicitacao.module.scss";
import FluxoAprovacao from "../aprovacoes/FluxoAprovacao";
import ListaAnexosEncantar from "../ListaAnexosEncantar";
import DadosEnvioRegistrado from "../entregas/DadosEnvioRegistrado.js";
import DadosEntregaCliente from "../entregas/DadosEntregaCliente";
import DadosReacoes from "../reacoes/DadosReacoes";
import DadosCancelamento from "./DadosCancelamento";
import DadosDevolucao from "./DadosDevolucao";
import { verifyPermission } from "utils/Commons";
import { useSelector } from "react-redux";
import PageLoading from "components/pageloading/PageLoading";
import ButtonPrintPdf from "components/buttonprintpdf";
import { atualizaTextoCarta } from "services/ducks/Encantar.ducks";
import useUsuarioLogado from "hooks/useUsuarioLogado";
import CartaPDF from "./CartaPDF";
import RichEditorCarta from "./RichEditorCarta";
import DadosEntrega from "./DadosEntrega";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;


const DadosSolicitacao = (props) => {
  const { solicitacao, excluirAbas } = props;
  const [abas, setAbas] = useState([]);
  const authState = useSelector((state) => state.app.authState);
  const txtCartaAlterado = useRef(solicitacao.txtCarta);
  const [loading, setLoading] = useState(false);
  const usuarioLogado = useUsuarioLogado();

  function salvarAlteracoesCarta() {
    if (!txtCartaAlterado.current.length) {
      message.error("Não houve alterações no texto original da carta!");
      return;
    }

    setLoading(true);
    atualizaTextoCarta(solicitacao.id, txtCartaAlterado.current)
      .then(() => message.success("Texto da Carta alterado com sucesso!"))
      .catch((error) => message.error(error))
      .then(() => setLoading(false));
  }

  function onTextoCartaChange(novoTexto) {
    txtCartaAlterado.current = novoTexto;
  }

  function renderCarta() {
    const hasContent = String(solicitacao.txtCarta).length > 0;

    if (!hasContent) {
      return (
        <Card>
          <Title level={4}> Carta</Title>
          Não foi descrita carta
        </Card>
      );
    } else {
      const permCurador = verifyPermission({
        ferramenta: "Encantar",
        permissoesRequeridas: ["ADM_ENCANTAR", "CURADOR"],
        authState: authState,
      });

      const isPrefixoFluxoAtual =
        solicitacao.fluxoAtual &&
        usuarioLogado.prefixo === solicitacao.fluxoAtual.prefixoAutorizador;

      if (
        (permCurador || isPrefixoFluxoAtual) &&
        props.verificaPermEdicaoCarta
      ) {
        return (
          <Card loading={loading}>
            <Title level={4}> Carta</Title>
            <RichEditorCarta
              updateFunc={onTextoCartaChange}
              txtCarta={txtCartaAlterado.current}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: 20,
              }}
            >
              <ButtonPrintPdf
                showLayoutConfirm={false}
                buttonText="Visualizar PDF"
                document={() => (
                  <CartaPDF
                    txt={txtCartaAlterado.current}
                    orientation={"landscape"}
                  />
                )}
                filename={"carta"}
              />
              <Button
                type="primary"
                style={{ marginLeft: 15 }}
                onClick={salvarAlteracoesCarta}
                loading={loading}
              >
                Salvar Alterações
              </Button>
            </div>
          </Card>
        );
      } else {
        return (
          <>
            <div style={{ marginBottom: 15 }}>
              <ButtonPrintPdf
                showLayoutConfirm={false}
                document={() => (
                  <CartaPDF
                    txt={solicitacao.txtCarta}
                    orientation={"landscape"}
                  />
                )}
                filename={"carta"}
              />
            </div>
            <Card>
              <Title level={4}> Carta</Title>
              {ReactHtmlParser(solicitacao.txtCarta)}
            </Card>
          </>
        );
      }
    }
  }

  const abasPossiveis = [
    {
      aba: "Cancelamento",
      propriedadeChecagem: "cancelamento",
      conteudo: () => {
        return (
          <div className={styles.dadosCliente}>
            <DadosCancelamento dadosCancelamento={solicitacao.cancelamento} />
          </div>
        );
      },
    },
    {
      aba: "Dados Cliente",
      propriedadeChecagem: "dadosCliente",
      conteudo: () => {
        return (
          <Card>
            <div className={styles.dadosCliente}>
              <DadosCliente
                showAlert={false}
                dadosCliente={solicitacao.dadosCliente}
              />
            </div>
          </Card>
        );
      },
    },

    {
      aba: "Rede Social",
      propriedadeChecagem: "redesSociais",
      conteudo: () => {
        return (
          <div className={styles.dadosCliente}>
            <Card title="Redes Sociais">
              <RedeSocialTabela redesSociais={solicitacao.redesSociais} />
            </Card>
          </div>
        );
      },
    },

    {
      aba: "Descrição do Caso",
      propriedadeChecagem: "dadosCliente",
      conteudo: () => {
        return (
          <Card>
            <Descriptions layout="vertical" column={4} size={"small"} bordered>
              <Descriptions.Item span={2} label="Prefixo do Fato">
                {!solicitacao.prefixoFato.prefixo
                  ? `${solicitacao.dadosCliente.prefixoEncarteirado} - ${solicitacao.dadosCliente.nomePrefixo}`
                  : ` ${solicitacao.prefixoFato.prefixo} -  ${solicitacao.prefixoFato.nome}`}
              </Descriptions.Item>
              <Descriptions.Item span={2} label="Produto">
                {solicitacao.produtoBB.descricao}
              </Descriptions.Item>
              <Descriptions.Item span={4} label="Descrição do caso">
                {solicitacao.descricaoCaso}
              </Descriptions.Item>
              {solicitacao.anexos && solicitacao.anexos.length > 0 && (
                <Descriptions.Item span={4} label="Anexos">
                  <div style={{ textAlign: "left" }}>
                    <ListaAnexosEncantar anexos={solicitacao.anexos} />
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        );
      },
    },
    {
      aba: "Dados da Entrega",
      propriedadeChecagem: "dadosEntrega",
      conteudo: () => {
        return (
          <Card>
            <DadosEntrega solicitacao={solicitacao} />{" "}
          </Card>
        );
      },
    },
    {
      aba: "Brindes",
      propriedadeChecagem: "brindesSelecionados",
      conteudo: () => {
        return (
          <Card>
            <Title level={4}> Brinde Selecionado</Title>
            {solicitacao.brindesSelecionados.length > 0 ? (
              <BrindesList
                key={2}
                modo={MODOS.SOLICITACAO_EXIBICAO}
                listData={solicitacao.brindesSelecionados}
                loading={false}
              />
            ) : (
              <Paragraph className={styles.paragraph}>
                Nenhum brinde selecionado
              </Paragraph>
            )}
          </Card>
        );
      },
    },
    {
      aba: "Carta",
      propriedadeChecagem: "txtCarta",
      conteudo: renderCarta,
    },
    {
      aba: "Fluxo Aprovação",
      propriedadeChecagem: "fluxoUtilizado",
      conteudo: () => {
        return <FluxoAprovacao solicitacao={solicitacao} />;
      },
    },
    {
      aba: "Envio",
      propriedadeChecagem: "envio",
      conteudo: () => {
        return <DadosEnvioRegistrado solicitacao={solicitacao} />;
      },
    },
    {
      aba: "Entrega Cliente",
      propriedadeChecagem: "entregaCliente",
      conteudo: () => {
        return <DadosEntregaCliente solicitacao={solicitacao} />;
      },
    },
    {
      aba: "Reações",
      propriedadeChecagem: "reacoes",
      conteudo: () => {
        return <DadosReacoes reacoes={solicitacao.reacoes} />;
      },
    },
    {
      aba: "Devolução",
      propriedadeChecagem: "tratamentoDevolucao",
      conteudo: () => {
        return <DadosDevolucao solicitacao={solicitacao} />;
      },
    },
  ];

  useEffect(() => {
    if (solicitacao && abas.length === 0) {
      const abasPresentes = [];
      for (const abaPossivel of abasPossiveis) {
        if (
          solicitacao[abaPossivel.propriedadeChecagem] &&
          !excluirAbas.includes(abaPossivel.propriedadeChecagem)
        ) {
          abasPresentes.push(abaPossivel);
        }
      }
      setAbas(abasPresentes);
    }
  }, [solicitacao, abas, excluirAbas, abasPossiveis]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <Tabs defaultActiveKey="1" style={{ marginBottom: 32 }}>
      {abas.map((aba, index) => {
        return (
          <TabPane tab={aba.aba} key={index + 1}>
            <div style={{ marginLeft: 5 }}>{aba.conteudo()}</div>
          </TabPane>
        );
      })}
    </Tabs>
  );
};
DadosSolicitacao.defaultProps = {
  excluirAbas: [],
};
export default DadosSolicitacao;
