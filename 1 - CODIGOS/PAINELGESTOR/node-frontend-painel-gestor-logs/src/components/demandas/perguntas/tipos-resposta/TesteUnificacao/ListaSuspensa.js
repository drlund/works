import React, { Component } from 'react';
import OptionBasedComponent from './OptionBasedComponent';

const compStyle = {
  display: 'inline-flex',
  height: '30px',
  lineHeight: '30px',
  marginBottom: '10px'
};

class ListaSuspensa extends Component {

  getDescription() {
    return (
      <React.Fragment>
        Será apresentada uma lista com as opções e o usuário poderá selecionar <strong>apenas uma</strong>.
      </React.Fragment>
    )
  }

  render() {
    return ( 
      <OptionBasedComponent
        {...this.props}
        description={this.getDescription()}
        GroupListComponent={(props) => <div {...props} />}
        WrapperOption={(props) => <div {...props} />}
        wrapperOptionStyle={{...compStyle, width: '100%'}}
      />
    )
  }
}

export default ListaSuspensa;