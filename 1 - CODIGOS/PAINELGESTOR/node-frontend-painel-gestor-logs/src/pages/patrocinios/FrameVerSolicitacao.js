import React from "react";
import { message, Row, Col, Divider, Button } from "antd";
import { UndoOutlined } from "@ant-design/icons";
import SacPDF from "./SacPDF";
import PageLoading from "components/pageloading/PageLoading";
import AccessDenied from "pages/errors/AccessDenied";
import Error from "pages/errors/Error";
import {
  getPerguntas,
  getTpSolic,
  hashPerguntas,
  getIdPergunta,
  tipoCampoResposta,
} from "services/ducks/Patrocinios.ducks";
import { connect } from "react-redux";
import ButtonPrintPdf from "components/buttonprintpdf";
import _ from "lodash";

class FrameVerSolicitacao extends React.Component {
  state = {
    pageLoading: false,
    tiposSolicitacao: [],
    perguntas: [],
    solicitacao: null,
    notAllowed: false,
    msgError: "",
  };

  componentDidMount() {
    this.setState({ pageLoading: true }, () => {
      // busca os tipos de solicitação
      getTpSolic({
        responseHandler: {
          successCallback: (tiposSolicitacao) =>
            this.setState({ tiposSolicitacao }),
          errorCallback: () =>
            message.error("Falha ao obter os tipos de solicitação."),
        },
      });

      getPerguntas({
        idSolicitacao: this.props.idSolicitacao,
        sequencial: 1,
        responseHandler: {
          successCallback: ({ perguntas, solicitacao }) =>
            this.setState(
              { solicitacao, perguntas, pageLoading: false },
              () => {
                const pergNomeEvento = getIdPergunta(
                  perguntas,
                  hashPerguntas.NomeEvento
                );
                const pergDataInicioEvento = getIdPergunta(
                  perguntas,
                  hashPerguntas.DataInicioEvento
                );
                const pergDataFimEvento = getIdPergunta(
                  perguntas,
                  hashPerguntas.DataFimEvento
                );

                this.setState({
                  perguntas: perguntas.filter(
                    (perg) =>
                      ![
                        pergNomeEvento.id,
                        pergDataInicioEvento.id,
                        pergDataFimEvento.id,
                      ].includes(perg.id)
                  ),
                });
              }
            ),
          errorCallback: (error) =>
            this.setState({ pageLoading: false }, () => {
              // Se acesso não permitido à informação limitada
              if (error.status === 403) {
                this.setState({ notAllowed: true });
              } else {
                this.setState({ msgError: error.data }, () =>
                  message.error(error.data)
                );
              }
            }),
        },
      });
    });
  }

  renderCamposSolicitacao() {
    const { solicitacao, tiposSolicitacao } = this.state;

    if (solicitacao && tiposSolicitacao.length) {
      const tpSolicitacao = _.find(tiposSolicitacao, {
        id: solicitacao.idTipoSolicitacao,
      });
      const descricaoTpSolicitacao = tpSolicitacao
        ? tpSolicitacao.descricao
        : "";

      const perguntasSolicitacao = [
        {
          id: "idTipoSolicitacao",
          descricaoPergunta: "Tipo de Solicitação",
          resposta: { descricaoResposta: descricaoTpSolicitacao },
        },
        {
          id: "prefixoSolicitante",
          descricaoPergunta: "Super Solicitante",
          resposta: {
            descricaoResposta: `${solicitacao.prefixoSolicitante} - ${solicitacao.nomeSolicitante}`,
          },
        },
        {
          id: "nomeEvento",
          descricaoPergunta: "Nome do Evento",
          resposta: { descricaoResposta: solicitacao.nomeEvento },
        },
        {
          id: "dataInicioEvento",
          descricaoPergunta: "Data Início do Evento",
          resposta: { descricaoResposta: solicitacao.dataInicioEvento },
        },
        {
          id: "dataFimEvento",
          descricaoPergunta: "Data Fim do Evento",
          resposta: { descricaoResposta: solicitacao.dataFimEvento },
        },
      ];

      return <Row>{this.renderFields(perguntasSolicitacao)}</Row>;
    }
  }

  getCamposResposta(perguntas) {
    const campoRecorrencia = this.getCampoRecorrencia();
    let camposResposta = _.filter(
      perguntas,
      (campo) => campo.id !== campoRecorrencia.id
    ); // Exclui o campo de Recorrência

    // Verifica se tem algum campo do tipo "radio_subperguntas". Caso positivo, inclui o campo de subpergunta.
    camposResposta = camposResposta.reduce((result, campo, index) => {
      result.push(campo);

      if (
        campo.tipo &&
        campo.tipo.id &&
        campo.tipo.id === tipoCampoResposta.radioSubperguntas &&
        campo.resposta &&
        campo.resposta.descricaoResposta &&
        campo.opcoes
      ) {
        let descricaoResposta =
          campo.resposta && campo.resposta.descricaoResposta
            ? JSON.parse(campo.resposta.descricaoResposta)
            : "";
        const keysResposta = Object.keys(descricaoResposta);
        descricaoResposta =
          descricaoResposta && keysResposta.length
            ? descricaoResposta[keysResposta[0]]
            : "";

        const opcoes = campo.opcoes.find(
          (opcao) => opcao.id === Number(keysResposta[0])
        );

        const subopcoes = opcoes ? JSON.parse(opcoes.subopcoes) : "";

        if (subopcoes) {
          result.push({
            id: `idRadioSubpergunta${index}`,
            descricaoPergunta:
              subopcoes && subopcoes.descricao ? subopcoes.descricao : "",
            resposta: { descricaoResposta },
          });
        }
      }

      return result;
    }, []);

    return camposResposta;
  }

  renderCamposResposta() {
    const { perguntas } = this.state;

    if (perguntas) {
      const camposResposta = this.getCamposResposta(perguntas);

      return <Row>{this.renderFields(camposResposta)}</Row>;
    }
  }

  renderCamposRecorrencia() {
    const { solicitacao } = this.state;
    const campoRecorrencia = this.getCampoRecorrencia(true);

    if (campoRecorrencia && solicitacao) {
      const { recorrencia } = solicitacao;
      let fields = null;
      let fieldAvalicaoResultado = [];

      if (
        campoRecorrencia.resposta &&
        campoRecorrencia.resposta.descricaoResposta === "Sim" &&
        recorrencia
      ) {
        fields = [
          {
            id: "nmEventoRecorrencia",
            descricaoPergunta: "Evento",
            resposta: { descricaoResposta: recorrencia.nomeEvento },
          },
          {
            id: "dtEventoRecorrencia",
            descricaoPergunta: "Data",
            resposta: { descricaoResposta: recorrencia.dtEvento },
          },
          {
            id: "vlEventoRecorrencia",
            descricaoPergunta: "Valor",
            resposta: { descricaoResposta: recorrencia.valorEvento },
          },
        ];

        fieldAvalicaoResultado = [
          {
            id: "avaliacaoEventoRecorrencia",
            descricaoPergunta: "Avaliação do Resultado",
            resposta: {
              descricaoResposta: recorrencia.avaliacaoResultado
                ? recorrencia.avaliacaoResultado
                : "",
            },
          },
        ];
      }

      return (
        <Row>
          {this.renderFields([campoRecorrencia], 0)}
          {fields && (
            <React.Fragment>
              <Divider />
              <Col
                span={24}
                style={{
                  marginBottom: 10,
                  padding: "3px 8px 3px 8px",
                  backgroundColor: "GhostWhite",
                  border: "1px solid #d9d9d9",
                  borderRadius: 3,
                }}
              >
                <h3
                  style={{
                    fontWeight: "bold",
                    color: "DimGray",
                    marginBottom: 0,
                  }}
                >
                  Recorrência
                </h3>
              </Col>

              {this.renderFields(fields, 20)}

              {this.renderFields(fieldAvalicaoResultado, 0, true)}
            </React.Fragment>
          )}
        </Row>
      );
    }
  }

  // Identifica qual campo do formulário se refere à recorrência
  getCampoRecorrencia(descricaoResposta = false) {
    const { perguntas } = this.state;

    if (perguntas) {
      const recorrencia = {
        ..._.find(perguntas, { hashPergunta: "recorrencia" }),
      };

      if (descricaoResposta && recorrencia && recorrencia.resposta) {
        const respostaRecorrencia = _.find(recorrencia.opcoes, {
          id: Number(recorrencia.resposta.descricaoResposta),
        }).descricao;

        if (respostaRecorrencia) {
          recorrencia.resposta = { descricaoResposta: respostaRecorrencia };
        }
      }

      return recorrencia;
    }

    return null;
  }

  renderFields = (fields, marginBottom = 30, fullLength = false) => {
    marginBottom = marginBottom || marginBottom === 0 ? marginBottom : 30;
    fields = fields.filter(
      (field) =>
        !field.opcoes || !field.opcoes.length || !field.opcoes[0].idTipoArquivo
    );

    return fields.map((campo) => {
      if (!Object.keys(campo).length) {
        return null;
      }

      let descricaoResposta =
        campo.resposta && campo.resposta.descricaoResposta
          ? campo.resposta.descricaoResposta
          : "";

      if (campo.tipo && campo.tipo.id && descricaoResposta) {
        if (
          [
            tipoCampoResposta.radio,
            tipoCampoResposta.radioSubperguntas,
          ].includes(campo.tipo.id)
        ) {
          if (campo.tipo.id === tipoCampoResposta.radioSubperguntas) {
            const respostaRadioSubperguntas = JSON.parse(descricaoResposta);
            const keys = Object.keys(respostaRadioSubperguntas);
            descricaoResposta = keys.length ? keys[0] : "";
          }

          const respostaRadio = campo.opcoes.find(
            (opcao) => opcao.id === Number(descricaoResposta)
          );

          if (respostaRadio) {
            descricaoResposta = respostaRadio.descricao;
          }
        }
      }

      const fieldLength =
        descricaoResposta.length > campo.descricaoPergunta.length
          ? descricaoResposta.length
          : campo.descricaoPergunta.length;
      let colLength = fieldLength > 12 ? parseInt(fieldLength / 6) : 3;
      colLength = fullLength ? 24 : colLength; // Se fullLength for TRUE, então o campo será a linha toda.

      return (
        <Col
          key={campo.id}
          span={colLength}
          style={{ marginBottom, marginRight: 20, minWidth: 150 }}
        >
          <Col flex={12} style={{ marginBottom: 5 }}>
            <span style={{ fontWeight: "bold" }}>
              {campo.descricaoPergunta}
            </span>
          </Col>
          <Col
            flex={12}
            style={{
              padding: "3px 8px 3px 8px",
              border: "1px solid #d9d9d9",
              borderRadius: 3,
              minHeight: 30,
            }}
          >
            {descricaoResposta}
          </Col>
        </Col>
      );
    });
  };

  render() {
    const { pageLoading, notAllowed, msgError } = this.state;

    if (pageLoading) {
      return <PageLoading />;
    }

    if (notAllowed) {
      return (
        <>
          <Button
            icon={<UndoOutlined />}
            onClick={this.props.onClickButtonVoltar}
          >
            Voltar
          </Button>
          <AccessDenied nomeFerramenta={"Patrocínios"} showMessage={false} />
        </>
      );
    }

    if (msgError) {
      return (
        <>
          <Button
            icon={<UndoOutlined />}
            onClick={this.props.onClickButtonVoltar}
          >
            Voltar
          </Button>
          <Error nomeFerramenta={"Patrocínios"} mensagemErro={msgError} />
        </>
      );
    }

    const hideButton = !!this.props.hideButton;
    const { solicitacao, perguntas, tiposSolicitacao } = this.state;

    return (
      <React.Fragment>
        {this.renderCamposSolicitacao()}
        {this.renderCamposResposta()}
        {this.renderCamposRecorrencia()}

        <Divider />

        <Row justify="center" style={{ marginBottom: 20 }}>
          {hideButton ? (
            solicitacao && (
              <ButtonPrintPdf
                document={() => (
                  <SacPDF
                    solicitacao={solicitacao}
                    perguntas={this.getCamposResposta(perguntas)}
                    tiposSolicitacao={tiposSolicitacao}
                    campoRecorrencia={this.getCampoRecorrencia()}
                    matricula={this.props.authState.sessionData["chave"]}
                  />
                )}
                orientation="portrait"
                showLayoutConfirm={false}
                filename={
                  `Sac_${solicitacao.prefixoSolicitante}_` +
                  _.snakeCase(solicitacao.nomeEvento)
                }
              />
            )
          ) : (
            <Button
              icon={<UndoOutlined />}
              style={{ paddingLeft: 30, paddingRight: 30 }}
              onClick={this.props.onClickButtonVoltar}
            >
              Voltar
            </Button>
          )}
        </Row>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authState: state.app.authState,
  };
};
export default connect(mapStateToProps)(FrameVerSolicitacao);
