import React, { Component } from "react";
import PageLoading from "components/pageloading/PageLoading";
import InfoLabel from "components/infolabel/InfoLabel";
import { connect } from "react-redux";
import {
  fetchResponderDemanda,
  fetchResposta,
  registrarRespostas,
  salvarRascunhoRespostas,
  excluirOcorrencia,
  fetchRespostasAnteriores,
} from "services/actions/demandas";
import { toggleFullScreen, toggleSideBar } from "services/actions/commons";
import { Row, Col, message, Button, Divider, Skeleton, Modal } from "antd";
import moment from "moment";
import ResponseQuestion from "components/demandas/respostas/ResponseQuestion";
import { isOptionValidateType } from "utils/Commons";
import ListaRegistros from "./ListaRegistros";
import ListaRespostasAnteriores from "./ListaRespostasAnteriores";
import ReactHtmlParser from "react-html-parser";
import styled from "styled-components";
import { StatusDemandas } from "../Types";
import _ from "lodash";

const HeaderPanel = styled.div`
  background-color: #7999b2;
  margin-top: -24px;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 12px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  min-height: 40px;
  text-align: center;
  border-bottom: 3px solid #5f788b;
  margin-bottom: 15px;
`;

const HeaderDescription = styled.div`
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  padding-right: 24px;
  min-height: 40px;
  border-bottom: 2px solid #7999b2;
  margin-bottom: 15px;
`;

const ActionButtons = styled.div`
  text-align: center;
  padding: 30px;
  padding-top: 15px;
`;

class ResponderDemanda extends Component {
  state = {
    loading: true,
    loadingOccurence: false,
    saving: false,
    found: true,
    perguntas: [],
    dadosResposta: {
      respostas: {},
    },
    respostasAnteriores: [],
    idDemanda: this.props.match.params.id,
    hashLista: null,
  };


  fetchDemandaData = () => {
    this.props.fetchResponderDemanda({
      idDemanda: this.state.idDemanda,
      responseHandler: {
        successCallback: this.onFetchedData,
        errorCallback: this.onFetchError,
      },
    });
  };

  componentDidMount() {
    this.fetchDemandaData();
    //coloca a aplicacao em fullscreen.
    this.props.toggleFullScreen(true);
  }

  onFetchedData = (hashLista = null) => {
    //Caso seja o módulo lista
    if (this.isModuloLista() && !hashLista) {
      this.setState({ loading: false });
      return;
    }

    if (this.isRespostaInfinita()) {
      this.props.fetchRespostasAnteriores({
        idDemanda: this.state.idDemanda,
        responseHandler: {
          successCallback: (respostasAnteriores) => {
            this.setState({ loading: false, respostasAnteriores });
          },
          errorCallback: () => {
            message.error("Não foi possível recuperar as respostas anteriores");
            this.setState({ loading: false });
          },
        },
      });
      return;
    }

    //Caso não seja módulo
    this.props.fetchResposta({
      idDemanda: this.state.idDemanda,
      hashLista,
      responseHandler: {
        successCallback: this.onFetchResposta,
      },
    });
  };

  onFetchResposta = (dadosResposta) => {
    const tmpDados = { ...dadosResposta };
    tmpDados.isRascunho = tmpDados.dataRegistro ? false : true;

    this.setState(
      { loading: false, loadingOccurence: false, dadosResposta: tmpDados },
      () => {
        //se nao tiver um rascunho registrado e for a primeira vez que o formulario
        //estiver sendo respondido, salva um novo rascunho.
        if (
          Object.keys(this.state.dadosResposta).length === 0 ||
          !this.state.dadosResposta.respostas ||
          Object.keys(this.state.dadosResposta.respostas).length === 0
        ) {
          if (
            this.isModuloLista() &&
            (!this.state.hashLista || this.isFormFinalizado())
          ) {
            //se for utilizado o modulo lista nao deve salvar o rascunho no inicio
            //apenas quando o usuario selecionar alguma ocorrencia
            return;
          }

          this.props.salvarRascunhoRespostas({
            idDemanda: this.state.idDemanda,
            respostas: {},
            idRascunho: "",
            hashLista: this.state.hashLista,
            responseHandler: {
              successCallback: this.onSaveDraftSuccess,
            },
          });
        }
      }
    );
  };

  onFetchError = (what) => {
    if (what) {
      message.error(what);
    } else {
      message.error("Demanda não localizada!");
    }
    let whatError = what
      ? what
      : "Esta demanda não foi localizada na nossa base de dados!";
    this.setState({ found: false, loading: false, whatError });
  };

  renderHeader = () => {
    return (
      <React.Fragment>
        <HeaderPanel>
          <h2 style={{ color: "#fff" }}>{this.props.formData.geral.titulo}</h2>
        </HeaderPanel>
        <HeaderDescription>
          {ReactHtmlParser(this.props.formData.geral.descricao)}
        </HeaderDescription>
      </React.Fragment>
    );
  };

  /**
   * Metodo utilitario que verifica se o tipo de pergunta possui
   * validacao habilitada e se é de um tipo de pergunta com
   * decisao de fluxo.
   */
  possuiFluxoDecisao = (question) => {
    if (
      (isOptionValidateType(question.tipoResposta) && question.showValidacao) ||
      (!isOptionValidateType(question.tipoResposta) &&
        question.showFluxoValidacao)
    ) {
      return true;
    }

    return false;
  };

  /**
   * Metodo chave do motor de decisao. Obtem o index da proxima pergunta e se
   * o botao de enviar respostas deve estar habilitado ou nao.
   */
  nextQuestion(actualIndex, questionList, responsesList) {
    if (questionList.length === 0 || actualIndex + 1 >= questionList.length) {
      return { nextIndex: null, enableFinish: false };
    }

    let question = questionList[actualIndex];

    if (this.possuiFluxoDecisao(question)) {
      //verifica se esta respondida, se estiver obtem a proxima pergunta
      if (
        responsesList &&
        responsesList[question.id] &&
        responsesList[question.id].value !== ""
      ) {
        let targetQuestion = responsesList[question.id];
        let answer = targetQuestion.value;
        let nextQuestionId = null;

        if (isOptionValidateType(question.tipoResposta)) {
          const optionsList = question.dadosResposta.optionsList;
          //compara a resposta com as opcoes e obtem o id da proxima pergunta
          for (let i = 0; i < optionsList.length; ++i) {
            if (optionsList[i].text === answer) {
              if (
                optionsList[i]["validation"] &&
                optionsList[i]["validation"]["proximaPergunta"]
              ) {
                nextQuestionId = optionsList[i].validation.proximaPergunta;
                break;
              }
            }
          }
        } else {
          //se o form ainda estiver em edicao, verifica a validade do campo da resposta
          if (!this.state.dadosResposta.dataRegistro) {
            if (!targetQuestion.isValid) {
              return { nextIndex: null, enableFinish: false };
            }
          }

          if (question.dadosResposta["fluxoValidacao"]) {
            nextQuestionId =
              question.dadosResposta["fluxoValidacao"]["proximaPergunta"];
          }
        }

        if (!nextQuestionId) {
          // :( nao achou a proxima pergunta ... alguma coisa errada que nao ta certa.
          //nao deveria entrar aqui.
          return { nextIndex: null, enableFinish: false };
        }

        //supondo que ta tudo certo com o id da proxima pergunta,
        //verifica se nao eh a ultima ou direciona para o fim do formulario.
        let finalState = ["finalizaFormulario", "ultimaPergunta"];

        if (finalState.includes(nextQuestionId)) {
          return { nextIndex: null, enableFinish: true };
        } else if (nextQuestionId === "proximaPergunta") {
          let nextIndex = actualIndex + 1;
          if (nextIndex >= questionList.length) {
            return { nextIndex: null, enableFinish: false };
          }
          return { nextIndex, enableFinish: false };
        } else {
          let nextQuestionIndex = null;
          //obtem o id da proxima pergunta na lista
          for (let j = 0; j < questionList.length; ++j) {
            if (questionList[j].id === nextQuestionId) {
              nextQuestionIndex = j;
              break;
            }
          }

          if (nextQuestionIndex < actualIndex) {
            //protecao para nao poder voltar a uma questao anterior.
            return { nextIndex: null, enableFinish: false };
          } else {
            return { nextIndex: nextQuestionIndex, enableFinish: false };
          }
        }
      } else {
        //nao respondida.. interrompe e nao habilita o botao finalizar
        return { nextIndex: null, enableFinish: false };
      }
    } else {
      //fluxo continuo
      let nextIndex = actualIndex + 1;
      if (nextIndex >= questionList.length) {
        return { nextIndex: null, enableFinish: true };
      }

      return { nextIndex, enableFinish: false };
    }
  }

  /**
   * Metodo que retorna a lista de perguntas filtradas pelas validacoes de decisao
   * existentes.
   */
  filterListByDecisions = (listaRender, listaPerguntas, respostas) => {
    //faz o filtro de decisao da lista de perguntas
    let questionData = {};
    let question = listaPerguntas[0];

    //adiciona a primeira pergunta
    listaRender.push(question);

    questionData = this.nextQuestion(0, listaPerguntas, respostas);

    if (questionData.nextIndex !== null) {
      do {
        question = listaPerguntas[questionData.nextIndex];

        //adiciona a proxima pergunta
        if (question) {
          listaRender.push(question);
        }

        //busca a proxima pergunta
        questionData = this.nextQuestion(
          questionData.nextIndex,
          listaPerguntas,
          respostas
        );
      } while (questionData.nextIndex !== null);
    }

    return questionData;
  };

  /**
   * Verifica se foi utilizado o modulo lista na criacao da demanda.
   */
  isModuloLista = () => {
    return this.props?.formData?.publicoAlvo?.tipoPublico === "lista";
  };

  /**
   *  Verifica se foi utilizado o lista simples e permite respostas infinitas.
   */
  isRespostaInfinita = () => {
    return (
      this.props.formData?.publicoAlvo?.tipoPublico === "publicos" &&
      !this.props.formData?.publicoAlvo?.respostaUnica
    );
  };

  renderQuestions = () => {
    if (this.isModuloLista() && !this.state.hashLista) {
      return;
    }

    const respostas = this.state.dadosResposta["respostas"]
      ? this.state.dadosResposta["respostas"]
      : {};

    if (this.isRespostaInfinitaVencida() && _.isEmpty(respostas)) {
      return null;
    }  
  
    const listaPerguntas = [...this.props.formData.perguntas];
    const listaRender = [];
    let questionData = this.filterListByDecisions(
      listaRender,
      listaPerguntas,
      respostas
    );

    //verifica se todas as repostas estao preenchidas e validadas para habilitar o botao de enviar respostas
    let allRespsValid = true;

    for (let i = 0; i < listaRender.length; ++i) {
      let id = listaRender[i].id;
      let testResponse = respostas[id];

      if (!testResponse) {
        //verifica se a resposta esta na lista de perguntas e se a mesma eh obrigatoria
        //pode nao estar respondida, mas nao ser obrigatoria...
        let ehObrigatoria = false;

        for (let pergunta of listaPerguntas) {
          if (pergunta.id === id) {
            if (pergunta.obrigatoria) {
              ehObrigatoria = true;
              break;
            }
          }
        }

        if (ehObrigatoria) {
          //pergunta eh obrigatoria e nao foi respondida.
          allRespsValid = false;
          break;
        }
      } else if (testResponse.isValid === false) {
        allRespsValid = false;
        break;
      }
    }

    if (allRespsValid) {
      //ok. todas as repostas estao validas a principio.
      questionData.enableFinish = true;
    } else {
      questionData.enableFinish = false;
    }

    //renderiza a lista filtrada
    return (
      <React.Fragment>
        {listaRender.map((pergunta, index) => {
          return (
            <Skeleton
              active={this.state.saving}
              loading={this.state.saving}
              key={pergunta.id}
            >
              <ResponseQuestion
                key={pergunta.id}
                question={pergunta}
                number={index + 1}
                isReadonly={
                  this.state.dadosResposta.dataRegistro ? true : false
                }
                onUpdateResponse={this.onUpdateResponse}
                response={
                  respostas && respostas[pergunta.id]
                    ? respostas[pergunta.id]
                    : null
                }
              />
            </Skeleton>
          );
        })}
        {this.renderActionButtons(questionData.enableFinish)}
      </React.Fragment>
    );
  };

  renderActionButtons = (enableFinish) => {
    if (!this.state.dadosResposta.dataRegistro) {
      //apenas apresenta o botao se o formulario não tiver sido finalizado.
      let buttonText = this.state.saving
        ? "Salvando as respostas"
        : "Enviar Respostas";

      return (
        <React.Fragment>
          <Divider />
          <ActionButtons>
            <Button
              type="primary"
              size="large"
              loading={this.state.saving}
              onClick={this.onShowConfirmDialog}
              disabled={!enableFinish}
            >
              {buttonText}
            </Button>
          </ActionButtons>
        </React.Fragment>
      );
    }
  };

  onShowConfirmDialog = () => {
    let title = this.isModuloLista()
      ? "Finalizar Respostas da Ocorrência"
      : "Finalizar Respostas do Formulário";
    let infoText = this.isModuloLista() ? null : (
      <InfoLabel type="error" showIcon={false}>
        Atenção: Não será possível editar após finalizar
      </InfoLabel>
    );

    Modal.confirm({
      title,
      centered: true,
      maskClosable: false,
      onOk: this.onTrySave,
      content: (
        <p>
          Deseja finalizar o preenchimento do formulário e enviar as suas
          respostas?
          <br />
          {infoText}
        </p>
      ),
    });
  };

  onTrySave = () => {
    //validando os dados das perguntas x respostas para entao fazer a finalizacao do
    //formulario
    const respostas = this.state.dadosResposta["respostas"]
      ? this.state.dadosResposta["respostas"]
      : {};
    const listaPerguntas = [...this.props.formData.perguntas];
    const listaRender = [];
    this.filterListByDecisions(listaRender, listaPerguntas, respostas);

    let allRespsValid = true;
    //lista final - ignora as perguntas respondidas que nao estao no fluxo atual.
    const finalResponseList = {};

    for (let i = 0; i < listaRender.length; ++i) {
      let id = listaRender[i].id;

      if (!respostas[id]) {
        //verifica se a resposta esta na lista de perguntas e se a mesma eh obrigatoria
        //pode nao estar respondida, mas nao ser obrigatoria...
        let ehObrigatoria = false;

        for (let pergunta of listaPerguntas) {
          if (pergunta.id === id) {
            if (pergunta.obrigatoria) {
              ehObrigatoria = true;
              break;
            }
          }
        }

        if (ehObrigatoria) {
          //pergunta eh obrigatoria e nao foi respondida.
          allRespsValid = false;
          break;
        }
      } else if (respostas[id].isValid === false) {
        allRespsValid = false;
        break;
      } else {
        //remove o atributo isValid da resposta
        delete respostas[id].isValid;
        finalResponseList[id] = respostas[id];
      }
    }

    if (allRespsValid) {
      //ok. todas as repostas estao validas para o fluxo definido.
      this.setState({ saving: true }, () => {
        this.onSaveResponses(finalResponseList);
      });
    } else {
      message.warning(
        "Atenção! Existem pergunta(s) que não foram validadas/respondidas. Verifique."
      );
    }
  };

  onSaveResponses = (responseList) => {
    this.props.registrarRespostas({
      idDemanda: this.state.idDemanda,
      respostas: responseList,
      hashLista: this.state.hashLista,
      responseHandler: {
        successCallback: this.onSaveSuccess,
        errorCallback: this.onSaveError,
      },
    });
  };

  onSaveSuccess = (result) => {
    let dadosResposta = { ...this.state.dadosResposta };
    delete dadosResposta.dataSalvamento;
    dadosResposta.dataRegistro = result.dataRegistro;
    dadosResposta.dadosAutor = result.dadosAutor;
    dadosResposta.isRascunho = false;

    message.success("Respostas registradas com sucesso!");

    this.setState(
      { saving: false, dadosResposta, loadingOccurence: true },
      () => {
        if (this.isModuloLista()) {
          //se for utilizado o modulo lista, atualiza a lista de ocorrencias com os registros respondidos
          this.props.fetchResponderDemanda({
            idDemanda: this.state.idDemanda,
            responseHandler: {
              successCallback: () => {
                this.setState({ loadingOccurence: false });
              },
              errorCallback: (what) => message.error(what),
            },
          });
        } else if (this.isRespostaInfinita()) {
          this.setState({ loading: true, dadosResposta: { repostas: {} } });
          this.fetchDemandaData();
        }
      }
    );
  };

  onSaveError = () => {
    this.setState({ saving: false });
    message.error(
      "Ocorreu um erro ao salvar a suas respostas. As respostas estão em rascunho, tente novamente mais tarde."
    );
  };

  onSaveResponsesDraft = () => {
    if (this.state.dadosResposta.isRascunho) {
      let idRascunho = this.state.dadosResposta.isRascunho
        ? this.state.dadosResposta.id
        : "";

      //agenda o salvamento do rascunho 5s depois da alteracao das respostas
      //a fim de diminuir a frequencia de salvamento.
      setTimeout(() => {
        this.props.salvarRascunhoRespostas({
          idDemanda: this.state.idDemanda,
          respostas: this.state.dadosResposta.respostas,
          idRascunho,
          hashLista: this.state.hashLista,
          responseHandler: {
            successCallback: this.onSaveDraftSuccess,
          },
        });
      }, 5000);
    }
  };

  onSaveDraftSuccess = (result) => {
    let dadosResposta = {
      ...this.state.dadosResposta,
      isRascunho: true,
      dataSalvamento: result.dataSalvamento,
      id: result.idRascunho,
    };

    if (this.state.dadosResposta.isRascunho) {
      this.setState({ dadosResposta });
    }
  };

  onUpdateResponse = (questionId, responseData) => {
    let actualList = { ...this.state.dadosResposta.respostas };
    actualList[questionId] = responseData;
    let dadosResposta = { ...this.state.dadosResposta, respostas: actualList };
    this.setState({ dadosResposta }, () => this.onSaveResponsesDraft());
  };

  visualizaAnterior = (newDados) => {
    this.setState({ dadosResposta: { ...newDados } });
  };

  renderRespostasAnteriores = () => {
    if (this.isRespostaInfinita()) {
      return (
        <ListaRespostasAnteriores
          novaResposta={() => this.setState({ dadosResposta: {} })}
          visualizaAnterior={this.visualizaAnterior}
          respostasAnteriores={this.state.respostasAnteriores}
          demandaVencida={this.isRespostaInfinitaVencida()}
        />
      );
    }
  };

  renderListaOcorrencias = () => {
    if (this.isModuloLista()) {
      return (
        <ListaRegistros
          dadosLista={this.props.formData.publicoAlvo.lista}
          onVizualizeOccurrence={this.onVizualizeOccurrence}
          onResolveOccurrence={this.onResolveOccurrence}
          onDeleteOccurrence={this.onDeleteOccurrence}
          loading={this.state.loadingOccurence}
        />
      );
    }
  };

  /**
   * Caso esteja o usando o modulo Lista, obtem os dados da resposta
   * para o hash indicado.
   */
  onVizualizeOccurrence = (hashLista) => {
    if (this.state.hashLista !== hashLista) {
      this.setState(
        { loadingOccurence: true, dadosResposta: { respostas: {} } },
        () => {
          this.setState({ hashLista }, () => {
            this.onFetchedData(hashLista);
          });
        }
      );
    }
  };

  /**
   * Caso esteja usando o modulo Lista, informa o hash que devera usar ao
   * salvar os dados do rascunho/resposta.
   */
  onResolveOccurrence = (hashLista) => {
    if (this.state.hashLista !== hashLista) {
      this.setState(
        { loadingOccurence: true, dadosResposta: { respostas: {} } },
        () => {
          this.setState({ hashLista }, () => {
            this.onFetchedData(hashLista);
          });
        }
      );
    }
  };

  onDeleteOccurrence = (hashLista) => {
    if (hashLista) {
      const tmpHash = hashLista;

      this.setState(
        {
          loadingOccurence: true,
          hashLista: null,
          dadosResposta: { respostas: {} },
        },
        () => {
          this.props.excluirOcorrencia({
            idDemanda: this.state.idDemanda,
            hashLista: tmpHash,
            responseHandler: {
              successCallback: () => this.onDeleteOccurrenceSuccess(),
              errorCallback: (what) => {
                message.error(what);
                this.setState({ loadingOccurence: false });
              },
            },
          });
        }
      );
    }
  };

  onDeleteOccurrenceSuccess = () => {
    message.success("Resposta da ocorrência removida com sucesso!");

    this.setState({ loadingOccurence: false }, () => {
      this.fetchDemandaData();
    });
  };

  renderRespostaObrigatoria = () => {
    if (this.isModuloLista() && !this.state.hashLista) {
      return;
    }

    if (this.isRespostaInfinitaVencida()) {
      return null;
    }

    return (
      <Col span={12}>
        <InfoLabel showIcon={false} type="error">
          * Resposta Obrigatória
        </InfoLabel>
      </Col>
    );
  };

  isFormFinalizado = () => {
    return (
      !this.state.dadosResposta.isRascunho &&
      this.state.dadosResposta.dataRegistro
    )
  };

  isRespostaInfinitaVencida = () => {
    return (
      this.isRespostaInfinita() &&
      moment(this.props.formData.geral.dataExpiracao) < moment()
    )
  }

  render() {
    //Caso esteja carregando
    if (this.state.loading) {
      return <PageLoading />;
    }
    //Caso de erros
    if (!this.state.found) {
      return (
        <InfoLabel type="error" showicon style={{ marginLeft: "20px" }}>
          {this.state.whatError}
        </InfoLabel>
      );
    }

    if (this.props.formData.geral) {
      //verifica se a demanda nao esta publicada
      if (this.props.formData.geral.status !== StatusDemandas.PUBLICADA && !this.isFormFinalizado()) {
        return (
          <React.Fragment>
            {this.renderHeader()}
            <Row>
              <Col span={24}>
                <InfoLabel
                  type="error"
                  showicon
                  style={{ marginLeft: "20px", fontSize: "16px" }}
                >
                  Status atual da demanda não permite que a mesma seja
                  respondida.
                </InfoLabel>
              </Col>
            </Row>
          </React.Fragment>
        );
      } else if (
        !this.isFormFinalizado() &&
        moment(this.props.formData.geral.dataExpiracao) < moment() &&
        !this.isRespostaInfinita()
      ) {
        //demanda nao finalizada e com o prazo de resposta expirado e nao eh resposta infinita
        return (
          <React.Fragment>
            {this.renderHeader()}
            <Row>
              <Col span={24}>
                <InfoLabel
                  type="error"
                  showicon
                  style={{ marginLeft: "20px", fontSize: "16px" }}
                >
                  Esta demanda está com prazo de validade expirado! Consulte a{" "}
                  <b>área responsável</b> pela demanda para mais informações.
                </InfoLabel>
              </Col>
            </Row>
          </React.Fragment>
        );
      }
    }

    if (this.isModuloLista() && this.state.loadingOccurence) {
      return (
        <React.Fragment>
          {this.renderHeader()}
          {this.renderListaOcorrencias()}

          <Row style={{ marginBottom: "10px" }}>
            <Col span={12}>
              <InfoLabel showIcon={false} type="info">
                Carregando ocorrência...
              </InfoLabel>
            </Col>
          </Row>

          <div>
            <PageLoading />
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {this.renderHeader()}
        {
          /*  Verificar se esa chamada é necessária, uma vez que neste ponto já se sabe que não é módulo lista */

          this.renderListaOcorrencias()
        }
        {this.renderRespostasAnteriores()}

        <Row style={{ marginBottom: "10px" }}>
          {this.renderRespostaObrigatoria()}

          {this.state.dadosResposta.isRascunho && (
            <Col span={6} push={6}>
              <b>Último salvamento automático:</b>
              {moment(this.state.dadosResposta.dataSalvamento).format(
                " DD/MM/YY HH:mm:ss"
              )}
            </Col>
          )}

          {this.props.formData.geral.dadosContato && (
            <Col span={24}>
              <b> Dados para contato: </b>{" "}
              {this.props.formData.geral.dadosContato}
            </Col>
          )}
          {this.isFormFinalizado() && (
            <Col span={12}>
              <b>Data da finalização do formulário:</b>
              {moment(this.state.dadosResposta.dataRegistro).format(
                " DD/MM/YY HH:mm:ss"
              )}
              &nbsp;&nbsp;<b>Autor:</b>&nbsp;
              {this.state.dadosResposta.dadosAutor.chave}-
              {this.state.dadosResposta.dadosAutor.nome_guerra}
            </Col>
          )}
        </Row>

        {this.renderQuestions()}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return { formData: state.demandas.demanda_atual };
};

export default connect(mapStateToProps, {
  fetchResponderDemanda,
  fetchResposta,
  fetchRespostasAnteriores,
  registrarRespostas,
  salvarRascunhoRespostas,
  toggleFullScreen,
  toggleSideBar,
  excluirOcorrencia,
})(ResponderDemanda);
