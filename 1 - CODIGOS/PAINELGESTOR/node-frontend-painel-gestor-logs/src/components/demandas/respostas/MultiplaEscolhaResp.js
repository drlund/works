import React from 'react';
import BaseResp from './BaseResp';
import { Radio } from 'antd';
import AlertList from 'components/alertlist/AlertList';
import { SingleOptionRespValidate } from './ValidationRespHelper';
import { ArrayShuffle } from 'utils/Commons';
import styled from 'styled-components';
import {  defaultReadonlyStyle,  ReadOnlyHeader, ReadOnlyContent} from './RespUtils';
import _ from 'lodash';

const optionStyle = {
  height: 'auto',
  lineBreak: 'strict',
  whiteSpace: 'normal',
  padding: '4px'
};

const OptionContainer = styled.div`
  display: ${props => props.horizontal ? 'inline' : 'block'}  
  margin-bottom: 4px;
  margin-right: 8px;
  &:hover {
    background-color: #0781f2;
    color: #FFF;
    transition: background-color 0.2s ease;
  }
`;

class MultiplaEscolhaResp extends BaseResp {

  constructor(props) {
    super(props);
    this.state = {
      errorsList: [],
      finalOptionsList: []
    }
  }

  componentDidMount() {
    if (!this.props.isReadonly) {
      let finalOptionsList = [];

      if (this.props.question.ordenarAleatoriamente) {
        finalOptionsList = ArrayShuffle(this.props.question.dadosResposta.optionsList);
      } else {
        finalOptionsList = !_.isEmpty(this.props.question.dadosResposta.optionsList) ?
                            [ ...this.props.question.dadosResposta.optionsList ] : [];
      }
  
      this.setState({finalOptionsList});
    }

    if (!this.props.isReadonly && (this.props.response && this.props.response.value) ) {
      let errorsList = this.autoValidate(this.props.response.value);
      let isValid = errorsList.length === 0;     
      this.props.onUpdateResponse(this.props.question.id, {value: this.props.response.value, isValid});
    }
  }

  /**
   * Metodo responsavel por efetuar uma verificacao na validacao dos dados
   * da resposta contra os argumento de validacao definidos na pergunta.
   * 
   * @return {Array} lista dos erros encontrados na validacao.
   */
  autoValidate = (value) => {
    const {question} = this.props;
    return SingleOptionRespValidate(question, value);
  }

  renderOptions = () => {
    if (_.isEmpty(this.props.question.dadosResposta.optionsList)) {
      return "Erro: Sem opções na lista!";
    }

    let layoutStyle = this.props.question.dadosResposta.layoutHorizontal ? null : optionStyle;

    return this.state.finalOptionsList.map(option => {
      return (
        <OptionContainer key={option.id} horizontal={this.props.question.dadosResposta.layoutHorizontal}>
          <Radio             
            style={layoutStyle}
            value={option.text}          
          >
            {option.text}
          </Radio>
        </OptionContainer>
      )
    })
  }

  onChange = e => {
    if (!this.props.isReadonly) {
      let value = e.target.value;
      let errorsList = this.autoValidate(value);
      let isValid = errorsList.length === 0;
      
      this.setState({ errorsList }, () => {
        this.props.onUpdateResponse(this.props.question.id, {value, isValid});
      });
    }
  }

  render() {
    let defValue = this.props.response && this.props.response.value ? this.props.response.value : "";

    if (this.props.isReadonly) {
      if (defValue.length) {
        return (
          <div style={defaultReadonlyStyle}>
            <ReadOnlyHeader>Resposta:</ReadOnlyHeader>
            <ReadOnlyContent>{defValue}</ReadOnlyContent>
          </div>
        )
      } else {
        return (
          <div style={defaultReadonlyStyle}>
            <ReadOnlyHeader>Resposta:</ReadOnlyHeader>
            <ReadOnlyContent>*** Nenhuma opção foi selecionada ***</ReadOnlyContent>
          </div>
        )
      }
    } else {
      return (
        <div>
          <Radio.Group 
            onChange={this.onChange} 
            defaultValue={defValue}
          >
            {this.renderOptions()}
          </Radio.Group>
          {
            (this.state.errorsList.length > 0) &&
            <div style={{marginTop: '15px'}}>
              <AlertList title="Erros de validação da resposta:" messagesList={this.state.errorsList} type="error"/>
            </div>
          }
        </div>
      )  
    }
  }
}

export default MultiplaEscolhaResp;