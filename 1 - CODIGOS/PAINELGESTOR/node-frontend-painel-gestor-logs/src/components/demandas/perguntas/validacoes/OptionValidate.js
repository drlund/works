import React, { Component } from 'react'
import { Select } from 'antd';
import _ from 'lodash';
const Option = Select.Option;

export const getValidQuestions = (actualId, baseList) => {
  let actualIndex = 0;

  for (let i=0; i < baseList.length; ++i) {
    if (baseList[i] === actualId) {
      actualIndex = i;
      break;
    } 
  }

  let finalList = [];
  baseList.filter((item, index) => {
    if (index > actualIndex) {
      finalList.push({ id: item, number: index+1});
    }

    return false;
  });

  return finalList;
}

class OptionValidate extends Component {
  static ultimaPergunta = 'ultimaPergunta';
  static finalizaFormulario = 'finalizaFormulario';
  static proximaPergunta = 'proximaPergunta';
  
  constructor(props) {
    super(props);

    if (! _.isEmpty(this.props.initialState)) {
      if (this.props.initialState.proximaPergunta === '') {
        this.state = { proximaPergunta: OptionValidate.proximaPergunta };
        this.props.onUpdateStateToParent(this.state);
      } else {
        this.state = { ...this.props.initialState };
      }
    } else {
      this.state = { proximaPergunta: this.props.questionsList.length ? OptionValidate.proximaPergunta : OptionValidate.ultimaPergunta };
      this.props.onUpdateStateToParent(this.state);
    }
  }

  onSetState = (newState) => {
    this.setState(newState, () => this.props.onUpdateStateToParent(this.state));    
  }

  onQuestionChange = (value) => {
    this.onSetState({ proximaPergunta: value});
  }

  isActualQuestionInList(baseList) {
    let found = false;

    for (let i=0; i < baseList.length; ++i) {
      if (baseList[i].id === this.state.proximaPergunta) {
        found = true;
        break;
      } 
    }

    return found;
  }

  render() {

    if (this.state.proximaPergunta && this.state.proximaPergunta !== OptionValidate.finalizaFormulario && 
        !this.isActualQuestionInList(this.props.questionsList)) {
      this.setState({ proximaPergunta: ''});
    }

    if (!this.props.questionsList.length) {
      return (
        <div style={{marginBottom: '8px'}}>
          <Select 
            value={OptionValidate.ultimaPergunta}
            disabled
            allowClear={false}
          >
            <Option key={0} value={OptionValidate.ultimaPergunta}>Última pergunta da lista</Option>  
          </Select>
        </div>
      )
    }

    return (
      <div style={{marginBottom: '8px'}}>
        <Select 
          allowClear={false}
          defaultValue={(this.state.proximaPergunta && this.state.proximaPergunta.length) ? this.state.proximaPergunta : "proximaPergunta"}
          onChange={this.onQuestionChange}
        >
          <Option key="proximaPergunta" value={OptionValidate.proximaPergunta}>Próx. Pergunta da Lista (padrão)</Option>

          { 
            this.props.questionsList.map((item) => {
              return <Option key={item.id} value={item.id}>Vai para a Pergunta {item.number}</Option>  
            })
          }

          <Option key="finalizaForm" value={OptionValidate.finalizaFormulario}>Finaliza o formulário</Option>
        </Select>
      </div>
    )
  }
}

export default OptionValidate;