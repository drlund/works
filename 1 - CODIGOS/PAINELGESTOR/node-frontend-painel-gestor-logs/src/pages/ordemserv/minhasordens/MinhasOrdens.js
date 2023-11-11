import React, { Component } from 'react';
import { Tabs } from 'antd';
import OrdensAtuais from './OrdensAtuais';
import HistoricoPessoal from './HistoricoPessoal';
import {removeMinhasOrdensData} from 'services/ducks/OrdemServ.ducks';
import { connect } from 'react-redux';

const { TabPane } = Tabs;

class MinhasOrdens extends Component {

  componentDidMount() {
    this.props.removeMinhasOrdensData();
  }

  render() {
    return (
      <Tabs type="card" 
        tabBarExtraContent={
          <a href="https://portaldarede.intranet.bb.com.br/r1115" target="_blank" rel="noopener noreferrer">
            Relatório de Acompanhamento - 1115
          </a>
        }
      >
      <TabPane tab="Atuais" key={1} >
        <OrdensAtuais />
      </TabPane>

      <TabPane tab="Histórico Pessoal" key={2} >
        <HistoricoPessoal />
      </TabPane>

    </Tabs>
    );
  }
}

export default connect(null, {removeMinhasOrdensData})(MinhasOrdens);