import React from 'react';
import BaseResp from './BaseResp';
import { Select } from 'antd';
import AlertList from 'components/alertlist/AlertList';
import { SingleOptionRespValidate } from './ValidationRespHelper';
import {  defaultReadonlyStyle,  ReadOnlyHeader, ReadOnlyContent} from './RespUtils';
import _ from 'lodash';

const { Option } = Select;

class ListaSuspensaResp extends BaseResp {

  constructor(props) {
    super(props);
    this.state = {
      errorsList: []
    }
  }

  componentDidMount() {
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
    let countValue = 1;

    let listaOptsPreeenchidas = this.props.question.dadosResposta.optionsList.filter(option => !_.isEmpty(option.text.trim()));

    return listaOptsPreeenchidas.map(option => {
      return (
        <Option
          key={option.id}
          value={countValue++}
        >
          {option.text}
        </Option>
      )
    })
  }

  onChange = value => {
    if (!this.props.isReadonly) {
      let label = (value && value.label) ? value.label : "";
      let errorsList = this.autoValidate(label);
      let isValid = errorsList.length === 0;
      
      this.setState({ errorsList }, () => {
        this.props.onUpdateResponse(this.props.question.id, {value: label, isValid});
      });
    }
  }

  render() {
    let defValue = (this.props.response && this.props.response.value) ? this.props.response.value : undefined;

    if (this.props.isReadonly) {
      if (defValue) {
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
            <ReadOnlyContent>*** Nenhuma opção da lista suspensa foi escolhida ***</ReadOnlyContent>
          </div>
        )
      }
    } else if (_.isEmpty(this.props.question.dadosResposta.optionsList)) {
      return (
        <div>
          <Select 
            placeholder="Selecione uma opção" 
            style={{ width: '100%' }}
          >
            {/* Nenhuma opcao na lista */}
          </Select>
        </div>
      )
    } else {
      return (
        <div>
          <Select 
            placeholder="Selecione uma opção" 
            labelInValue
            style={{ width: '100%' }}
            allowClear
            onChange={this.onChange}
          >
            {this.renderOptions()}
          </Select>
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

export default ListaSuspensaResp;