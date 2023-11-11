import React from 'react';
import BaseResp from './BaseResp';
import { Checkbox } from 'antd';
import AlertList from 'components/alertlist/AlertList';
import { MultipleOptionRespValidate } from './ValidationRespHelper';
import { ArrayShuffle } from 'utils/Commons';
import styled from 'styled-components';
import {  defaultReadonlyStyle,  ReadOnlyHeader, ReadOnlyContent} from './RespUtils';
import _ from 'lodash';

const optionStyle = {
  height: 'auto',
  marginLeft: '8px',
  lineBreak: 'strict',
  whiteSpace: 'normal'
};

const OptionContainer = styled.div`
  display: ${props => props.horizontal ? 'inline' : 'block'}  
  margin-right: 8px;
  margin-bottom: 4px;
  &:hover {
    background-color: #0781f2;
    color: #FFF;
    transition: background-color 0.2s ease;
  }
`;

class CaixasdeSelecaoResp extends BaseResp {

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

    if (!this.props.isReadonly && (this.props.response && this.props.response.value.length) ) {
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
    return MultipleOptionRespValidate(question, value);
  }


  renderOptions = () => {
    if (_.isEmpty(this.props.question.dadosResposta.optionsList)) {
      return "Erro: Sem opções na lista!";
    }

    let layoutStyle = this.props.question.dadosResposta.layoutHorizontal ? null : optionStyle;

    return this.state.finalOptionsList.map(option => {
      return (
        <OptionContainer key={option.id} horizontal={this.props.question.dadosResposta.layoutHorizontal}>
          <Checkbox           
            style={layoutStyle} 
            value={option.text}
          >
            {option.text}
          </Checkbox>
        </OptionContainer>
      )
    })
  }

  renderReadOnly = (checkedOptions) => {
    return checkedOptions.map( item => {
      return (
        <li>{item}</li>
      )
    })
  }

  onChange = checkedValues => {
    if (!this.props.isReadonly) {
      let errorsList = this.autoValidate(checkedValues);
      let isValid = errorsList.length === 0;
      
      this.setState({ errorsList }, () => {
        //ajusta a ordem das respostas para a ordem definida nas opcoes originais
        let orderedCheckedValues = [];

        for (let opt of this.state.finalOptionsList) {
          if (checkedValues.includes(opt.text)) {
            orderedCheckedValues.push(opt.text)
          }
        }

        this.props.onUpdateResponse(this.props.question.id, {value: orderedCheckedValues, isValid});  
      });    
    }
  }

  render() {
    let checkedOptions = [];

    if (!this.props.response) {
      if (!_.isEmpty(this.props.question.dadosResposta.optionsList)) {
        this.props.question.dadosResposta.optionsList.map(option => {
          if (option.defaultChecked) {
            checkedOptions.push(option.text);
          }

          return option;
        });

        this.onChange(checkedOptions);
      }
    } else {
      checkedOptions = this.props.response.value;
    }

    if (this.props.isReadonly) {
      if (checkedOptions.length) {
        return (
          <div style={defaultReadonlyStyle}>
            <ReadOnlyHeader>Resposta:</ReadOnlyHeader>
            <ReadOnlyContent>
              <ul>{this.renderReadOnly(checkedOptions)}</ul>
            </ReadOnlyContent>
          </div>
        )
      } else {
        return (
          <div style={defaultReadonlyStyle}>
            <ReadOnlyHeader>Resposta:</ReadOnlyHeader>
            <ReadOnlyContent>*** Nenhuma opção foi marcada ***</ReadOnlyContent>
          </div>
        )
      }
    } else {
      return (
        <div>
          <Checkbox.Group 
            defaultValue={checkedOptions}
            onChange={this.onChange}
          >
            {this.renderOptions()}
          </Checkbox.Group>
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

export default CaixasdeSelecaoResp;
