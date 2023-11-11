import React from 'react';
import { Input } from 'antd';
import styled from 'styled-components';

class InputNumberNoStepper extends React.Component {
  state = {
    value: this.props.value
  }
  
  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (value !== prevProps.value) {
      this.setState({ value });
    }
  }

  onChange = (event) => {
    let retorno = null;
    let value = event.target.value;

    if (value) {
      let cc = value.replace(/\D+/g, '');
  
      if (cc.length > 1) {
        const corr = parseInt(cc.slice(0, -1));
        retorno = corr.toLocaleString('PT-br') + '-' + cc.slice(-1);
      } else {
        if (cc !== "0") {
          retorno = cc;
        }
      }
    }

    this.setState({value: retorno}, () => this.props.onChange(this.state.value))
  }

  render() {
    return (
      <Input
        value={this.state.value}
        onChange={this.onChange}
      >{this.props.children}
      </Input>
    )
  }
}

const InputContaCorrente = styled(InputNumberNoStepper)`
  .ant-input-number-handler-wrap{
    display: none;
  }
`;

export default InputContaCorrente;
