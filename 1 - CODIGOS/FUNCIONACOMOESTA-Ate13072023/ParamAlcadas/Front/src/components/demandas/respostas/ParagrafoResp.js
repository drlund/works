import React from 'react';
import BaseResp from './BaseResp';
import { Input } from 'antd';
import AlertList from 'components/alertlist/AlertList';
import { StringRespValidate } from './ValidationRespHelper';
import {  defaultReadonlyStyle,  ReadOnlyHeader, ReadOnlyContent} from './RespUtils';

class ParagrafoResp extends BaseResp {
  constructor(props) {
    super(props);
    this.state = {
      actualText: "",
      errorsList: []
    }
  
    this.inputRef = null;
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
  autoValidate = (text) => {
    const {question} = this.props;
    return StringRespValidate(question, text);
  }

  onUpdate = (text) => {
    if (!this.props.isReadonly) {
      let errorsList = this.autoValidate(text);
      let isValid = errorsList.length === 0;
      
      this.setState({ errorsList }, () => {
        this.props.onUpdateResponse(this.props.question.id, {value: text, isValid});
      });
    }
  }

  render() {
    let defValue = (this.props.response && this.props.response.value) || "";

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
            <ReadOnlyContent>*** Nenhum texto foi informado ***</ReadOnlyContent>
          </div>
        )
      }
    } else {
      return (
        <div>
          <Input.TextArea
            rows={4}
            defaultValue={(this.props.response && this.props.response.value) || ""}
            placeholder="Digite a sua resposta"          
            onChange={(e) => this.onUpdate(e.target.value)}
          />
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

export default ParagrafoResp;