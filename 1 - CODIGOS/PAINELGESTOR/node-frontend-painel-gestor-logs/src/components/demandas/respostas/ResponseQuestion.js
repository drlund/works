import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RespostaCurtaResp from './RespostaCurtaResp';
import ParagrafoResp from './ParagrafoResp';
import MultiplaEscolhaResp from './MultiplaEscolhaResp';
import CaixasdeSelecaoResp from './CaixasdeSelecaoResp';
import ListaSuspensaResp from './ListaSuspensaResp';
import styled from 'styled-components';
import InfoLabel from 'components/infolabel/InfoLabel';
import ReactHtmlParser from 'react-html-parser'; 

const QuestionTitle = styled.div`
  font-size: 1.2rem;
  margin-bottom: ${props => props.hasDescription && '0px'};
  margin-bottom: ${props => !props.hasDescription && '8px'};
`;

const QuestionDescription = styled.div`
  font-size: 0.8rem;
  margin-bottom: 8px;
  padding-left: 22px;
`;

const QuestionContainer = styled.div`
  margin-bottom: 15px;
  padding: 20px;
  background-color: #eee;
  &:hover {
    background-color: #B1CBE0;
    transition: background-color 0.5s ease;
  }
`;

//Tipos de resposta disponiveis
const RespTypes = [
  {
    tipo: 'respostaCurta',
    component: (props) => <RespostaCurtaResp {...props} />
  },
  {
    tipo: 'paragrafo',
    component: (props) => <ParagrafoResp {...props} />
  },
  {
    tipo: 'multiplaEscolha',
    component: (props) => <MultiplaEscolhaResp {...props} />
  },
  {
    tipo: 'caixasSelecao',
    component: props => <CaixasdeSelecaoResp {...props} />
  },
  {
    tipo: 'listaSuspensa',
    component: props => <ListaSuspensaResp {...props} />
  }
]

const TipoIndefinido = () => {
  return <div>Tipo de resposta não definido.</div>
}

/**
 * Classe Generica que representa uma questão no componente ResponderDemanda.
 * Renderiza o componente adequado de acordo com o tipoResposta do objeto contido em this.props.question.
 */
class ResponseQuestion extends Component {
  render() {
    if (!this.props.question) {
      return <TipoIndefinido />
    }

    const selectedType = RespTypes.filter(item => item.tipo === this.props.question.tipoResposta);

    if (!selectedType.length) {
      return <TipoIndefinido />
    }

    const RespComponent = selectedType[0].component;    

    return (
      <QuestionContainer>
        <QuestionTitle hasDescription={this.props.question["descricao"] && this.props.question.descricao.length}>
          <div style={{float: 'left', paddingRight: '7px'}}> {this.props.question.obrigatoria && <InfoLabel type="error" showIcon={false}>&nbsp;*</InfoLabel>} {this.props.number + ") "}</div>
          <div style={{paddingLeft: '22px'}}>
            { ReactHtmlParser(this.props.question.texto) }
            
          </div>
        </QuestionTitle>
        <QuestionDescription>
          { ReactHtmlParser(this.props.question.descricao) || null}
        </QuestionDescription>
        <RespComponent {...this.props} />
      </QuestionContainer>
    )
  }
}

ResponseQuestion.propTypes = {
  question: PropTypes.object.isRequired,
  number: PropTypes.number.isRequired,
  response: PropTypes.object,
  errorList: PropTypes.array,
  updateResponse: PropTypes.func
}

export default ResponseQuestion;