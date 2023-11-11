import React, { Fragment } from 'react';
import {Cabecalho} from './Cabecalho';
import { Tabela } from './Tabela';
import * as json0997 from './0997.json';
import * as json0998 from './0998.json';
import * as jsonDados_0997 from './dados_0997.json';
import * as jsonDados_0998 from './dados_0998.json'

var rels = [];
var data = [];

rels = {
  "0997": json0997,
  "0998": json0998
};

data = {
  "0997": jsonDados_0997,
  "0998": jsonDados_0998
}
export class Container extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      relatorio : ''
    }
  }

  mudarRelatorio = rel => {
    this.setState({
      relatorio: rel
    });
  }

  render () {
    const relat = this.state.relatorio;

    return (
      <Fragment>
        <div>
          <Cabecalho mudarRelatorio={this.mudarRelatorio} />
        </div>
        <div>
          <Tabela colunas={rels[relat]} dados={data[relat]} />
        </div>
      </Fragment>
    )
  }
}


export default Container;