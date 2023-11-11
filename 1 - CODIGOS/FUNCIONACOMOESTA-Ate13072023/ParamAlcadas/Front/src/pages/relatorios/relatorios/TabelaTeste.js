import React, { Fragment } from 'react';
import uuid from 'uuid/v4';
import { Table } from 'antd';

const { ColumnGroup, Column } = Table;


export class TabelaTeste extends React.Component {

  //const { prefixo, dependencia, grupos } = this.props.dados;
  constructor(props) {
    super(props);
    this.state = {
      colunas: []
    }
  }


  render () {
    return (
      <React.Fragment>

      </React.Fragment>
    );
  }

}

export default TabelaTeste;