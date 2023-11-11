import React, { Component } from 'react';
import OptionBasedComponent from './OptionBasedComponent';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

const compStyle = {
  display: 'inline',
  height: '30px',
  lineHeight: '30px',
  marginBottom: '10px'
};

class CaixasdeSelecao extends Component {

  getDescription() {
    return (
      <React.Fragment>
        O usuário poderá escolher <strong>uma ou mais opções</strong> entre as disponíveis
      </React.Fragment>
    )
  }

  render() {
    return ( 
      <OptionBasedComponent
        {...this.props}
        description={this.getDescription()}
        GroupListComponent={(props) => <CheckboxGroup {...props} />}
        WrapperOption={(props) => <Checkbox {...props} />}
        wrapperOptionStyle={{...compStyle, width: '90%'}}
      />
    )
  }
}

export default CaixasdeSelecao;