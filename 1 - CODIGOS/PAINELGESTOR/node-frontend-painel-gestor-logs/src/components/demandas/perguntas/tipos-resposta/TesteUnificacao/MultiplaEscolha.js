import React, { Component } from 'react';
import OptionBasedComponent from './OptionBasedComponent';
import { Radio } from 'antd';

const RadioGroup = Radio.Group;

const radioStyle = {
  height: '30px',
  lineHeight: '30px',
  marginBottom: '10px'
};

class MultiplaEscolha extends Component {

  getDescription() {
    return (
      <React.Fragment>
        O usuário poderá escolher <strong>apenas uma opção</strong> entre as disponíveis
      </React.Fragment>
    )
  }

  render() {
    return ( 
      <OptionBasedComponent
        {...this.props}
        description={this.getDescription()}
        GroupListComponent={(props) => <RadioGroup {...props} />}
        WrapperOption={(props) => <Radio {...props} />}
        wrapperOptionStyle={{...radioStyle, width: '95%'}}
      />
    )
  }
}

export default MultiplaEscolha;