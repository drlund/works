import React, { Component } from 'react'
import PageLoading from 'components/pageloading/PageLoading';
import InfoLabel from 'components/infolabel/InfoLabel';
import { connect } from 'react-redux';
import { Row, Col, Button, Divider, Skeleton, Modal } from 'antd';
import ResponseQuestion from 'components/demandas/respostas/ResponseQuestion';
import { isOptionValidateType } from 'utils/Commons';
import ListaRegistros from '../responder/ListaRegistros';
import ReactHtmlParser from 'react-html-parser'; 
import styled from 'styled-components';
import _ from 'lodash';

const HeaderPanel = styled.div`
  background-color: #7999b2;
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
  padding-left: 34px;
  padding-right: 34px;
  min-height: 40px;
  border-bottom: 2px solid #7999b2;
  margin-bottom: 15px;
`;

const ActionButtons = styled.div`
  text-align: center;
  padding: 30px;
  padding-top:15px;
`;

class VisualizarFormulario extends Component {
  state = {       
    saving: false,
    clearForm: false,
    dadosResposta: {
      respostas: {}
    }
  };

  renderHeader = () => {
    return (
      <React.Fragment>
        <HeaderPanel>
          <h2 style={{color: '#fff'}}>{this.props.formData.geral.titulo}</h2>
        </HeaderPanel>
        <HeaderDescription>
          {ReactHtmlParser( this.props.formData.geral.descricao )}
        </HeaderDescription>
      </React.Fragment>
    )
  }

  /**
   * Metodo utilitario que verifica se o tipo de pergunta possui
   * validacao habilitada e se é de um tipo de pergunta com 
   * decisao de fluxo.
   */
  possuiFluxoDecisao = (question) => {
    if (( isOptionValidateType(question.tipoResposta) && question.showValidacao) || 
        ( !isOptionValidateType(question.tipoResposta) && question.showFluxoValidacao)) {
      return true;
    }

    return false;
  }

  /**
   * Metodo chave do motor de decisao. Obtem o index da proxima pergunta e se
   * o botao de enviar respostas deve estar habilitado ou nao.
   */
  nextQuestion(actualIndex, questionList, responsesList) {
    if (questionList.length === 0 || (actualIndex+1) >= questionList.length) {
      return {nextIndex: null, enableFinish: false};
    }

    let question = questionList[actualIndex];

    if (this.possuiFluxoDecisao(question)) {
      //verifica se esta respondida, se estiver obtem a proxima pergunta
      if (responsesList && responsesList[question.id] && responsesList[question.id].value !== "") {
        let targetQuestion = responsesList[question.id];
        let answer = targetQuestion.value;
        let nextQuestionId = null;

        if (isOptionValidateType(question.tipoResposta)) {
          const optionsList = question.dadosResposta.optionsList;
          //compara a resposta com as opcoes e obtem o id da proxima pergunta
          for (let i=0; i < optionsList.length; ++i) {
            if (optionsList[i].text === answer) {
              if (optionsList[i]['validation'] && optionsList[i]['validation']['proximaPergunta']) {
                nextQuestionId = optionsList[i].validation.proximaPergunta;
                break;
              }
            }
          }
        } else {
          if (!targetQuestion.isValid) {
            return {nextIndex: null, enableFinish: false};  
          } else {
            if (question.dadosResposta['fluxoValidacao']) {
              nextQuestionId = question.dadosResposta['fluxoValidacao']['proximaPergunta'];
            }
          }
        }

        if (!nextQuestionId) {
          // :( nao achou a proxima pergunta ... alguma coisa errada que nao ta certa.
          //nao deveria entrar aqui.
          return {nextIndex: null, enableFinish: false}; 
        }

        //supondo que ta tudo certo com o id da proxima pergunta,
        //verifica se nao eh a ultima ou direciona para o fim do formulario.
        let finalState = ["finalizaFormulario", "ultimaPergunta"];

        if (finalState.includes(nextQuestionId)) {
          return {nextIndex: null, enableFinish: true};
        } else if (nextQuestionId === "proximaPergunta") {
          let nextIndex = actualIndex + 1;
          if (nextIndex >= questionList.length) {
            return { nextIndex: null, enableFinish: false};
          }    
          return { nextIndex, enableFinish: false}    
        } else {
          let nextQuestionIndex = null;
          //obtem o id da proxima pergunta na lista
          for (let j=0; j < questionList.length; ++j) {
            if (questionList[j].id === nextQuestionId) {
              nextQuestionIndex = j;
              break;
            }
          }

          if (nextQuestionIndex < actualIndex) {
            //protecao para nao poder voltar a uma questao anterior.
            return { nextIndex: null, enableFinish: false};
          } else {
            return { nextIndex: nextQuestionIndex, enableFinish: false};
          }
          
        }

      } else {
        //nao respondida.. interrompe e nao habilita o botao finalizar
        return {nextIndex: null, enableFinish: false};
      }
    } else {
      //fluxo continuo
      let nextIndex = actualIndex + 1;
      if (nextIndex >= questionList.length) {
        return { nextIndex: null, enableFinish: true};
      }

      return { nextIndex, enableFinish: false}
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
          questionData = this.nextQuestion(questionData.nextIndex, listaPerguntas, respostas);  
        } while (questionData.nextIndex !== null);
      }

      return questionData;
  }

  /**
   * Verifica se foi utilizado o modulo lista na criacao da demanda.
   */
  isModuloLista = () => {
    return this.props.formData.publicoAlvo && this.props.formData.publicoAlvo.tipoPublico === "lista";
  }

  renderQuestions = () => {

    const respostas = this.state.dadosResposta['respostas'] ? this.state.dadosResposta['respostas'] : {};
    const listaPerguntas = [ ...this.props.formData.perguntas ];
    const listaRender = [];
    let questionData = this.filterListByDecisions(listaRender, listaPerguntas, respostas);

    //verifica se todas as repostas estao preenchidas e validadas para habilitar o botao de enviar respostas
    let allRespsValid = true;

    for (let i=0; i < listaRender.length; ++i) {
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
        {listaRender.map((pergunta,index) => {      
          return (
            <Skeleton 
              active={this.state.saving} 
              loading={this.state.saving}
              key={pergunta.id}
            >
              <ResponseQuestion 
                key={pergunta.id} 
                question={pergunta} 
                number={index+1}
                isReadonly={this.state.dadosResposta.dataRegistro ? true : false}
                onUpdateResponse={this.onUpdateResponse}
                response={(respostas && respostas[pergunta.id]) ? respostas[pergunta.id] : null}
              />
            </Skeleton>
          )
        })}
        {this.renderActionButtons(questionData.enableFinish)}
      </React.Fragment>
    )
  }

  renderActionButtons = (enableFinish) => {
    if (!this.state.dadosResposta.dataRegistro) {
      //apenas apresenta o botao se o formulario não tiver sido finalizado.
      let buttonText = this.state.saving ? "Salvando as respostas" : "Enviar Respostas";

      return (
        <React.Fragment>
          <Divider/>
          <ActionButtons>
            <Button 
              type="primary" 
              size="large" 
              loading={this.state.saving}
              onClick={this.onShowConfirmDialog}
              disabled={!enableFinish}
              style={{marginRight: '15px'}}
            >
              {buttonText}
            </Button>

            <Button 
              type="danger" 
              size="large" 
              loading={this.state.saving}
              onClick={this.onResetForm}
            >
              Limpar Formulário
            </Button>
          </ActionButtons>
        </React.Fragment>
      )  
    }
  }

  onShowConfirmDialog = () => {
    let title = this.isModuloLista() ? "Finalizar Respostas da Ocorrência" : "Finalizar Respostas do Formulário";
    let infoText = <InfoLabel type="error" showIcon={false}>
                      ISTO É APENAS UMA VISUALIZAÇÃO: AS RESPOSTAS NÃO SERÃO ENVIADAS!
                   </InfoLabel>;

    Modal.confirm({
      title,
      centered: true,
      maskClosable: false,
      onOk: () => {},
      content: 
      <p>
        Deseja finalizar o preenchimento do formulário e enviar as suas respostas?
        <br />
        {infoText}
      </p>
    });
  }

  onResetForm = () => {
    this.setState({ dadosResposta: { respostas: {} }, clearForm: true}, () => {
      this.setState({clearForm: false})
    });
  }

  onUpdateResponse = (questionId, responseData) => {
    let actualList = {...this.state.dadosResposta.respostas};
    actualList[questionId] = responseData;
    let dadosResposta = {...this.state.dadosResposta, respostas: actualList};
    this.setState({ dadosResposta });
  }

  renderListaOcorrencias = () => {
    if (this.isModuloLista()) {
      const fakeData = {
        headers : [ 
            "Público", 
            "Regional", 
            "Prefixo", 
            "Dependência", 
            "Carteira", 
            "MCI", 
            "Pilar", 
            "Operação", 
            "Produto", 
            "Nº Modalidade", 
            "Nome modalidade", 
            "Saldo op. (R$)", 
            "Saldo atraso (R$)"
        ],
        dados : [ 
            {
                "0" : "F9999999",
                "1" : "4444",
                "2" : "8888",
                "3" : "EMPRESA M&M",
                "4" : "1234",
                "5" : "000000000",
                "6" : "PJ",
                "7" : "5555555555",
                "8" : "333",
                "9" : "11",
                "10" : "RENEGOCIACAO ESPECIAL",
                "11" : "8684536,55",
                "12" : "261484,21",
                "hash" : "6edb986c6e4f6881b4b8ff35d875424a",
                "key" : "6edb986c6e4f6881b4b8ff35d875424a",
                "ocorrenciaRespondida": "Não"
            }
        ]
      };

      if (this.props.formData.publicoAlvo.lista ) {
        let { lista } = this.props.formData.publicoAlvo;

        if (!_.isEmpty(this.props.formData.publicoAlvo.lista.dados)) {
          fakeData.headers = [...lista.headers];
          fakeData.dados = lista.dados.slice(0, 5).map(elem => {
            return { ...elem, ocorrenciaRespondida: "Não"}
          })
        }
      }
      
      return (
        <ListaRegistros 
          dadosLista={{...fakeData}} 
          onVizualizeOccurrence={this.onVizualizeOccurrence}
          onResolveOccurrence={this.onResolveOccurrence}
          onDeleteOccurrence={this.onDeleteOccurrence}
          loading={false}
        />
      )
    }
  }

  onVizualizeOccurrence = (hashLista) => {
  }

  onResolveOccurrence = (hashLista) => {
  }

  onDeleteOccurrence = (hashLista) => {
  }

  renderRespostaObrigatoria = () => {
    if (this.isModuloLista() && !this.state.hashLista) {
      return;
    }

    return (
      <Col span={12}>
        <InfoLabel showIcon={false} type="error">* Resposta Obrigatória</InfoLabel>
      </Col>
    )
  }

  isFormFinalizado = () => {
    return !this.state.dadosResposta.isRascunho && this.state.dadosResposta.dataRegistro;
  }

  render() {

    if (this.state.clearForm) {
      return <PageLoading />
    }

    if (!this.props.formData.perguntas || !this.props.formData.perguntas.length) {
      return (
        <React.Fragment>
          {this.renderHeader()}

          <Row style={{marginBottom: '10px'}}>
            <Col span={12}>
              <InfoLabel showIcon={false} type="info">Nenhuma resposta criada nesta demanda.</InfoLabel>
            </Col>
          </Row>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        {this.renderHeader()}
        <div style={{ paddingLeft: '14px', paddingRight: '14px'}}>
          {this.renderListaOcorrencias()}

          <Row style={{marginBottom: '10px'}}>
            { this.renderRespostaObrigatoria() }
            {
            this.props.formData.geral.dadosContato &&
            <Col span={24}>
              <b>  Dados para contato: </b> {this.props.formData.geral.dadosContato} 
            </Col>
            }
          </Row>

          {this.renderQuestions()}
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return { formData: state.demandas.demanda_atual }
}

export default connect(mapStateToProps, {})(VisualizarFormulario);