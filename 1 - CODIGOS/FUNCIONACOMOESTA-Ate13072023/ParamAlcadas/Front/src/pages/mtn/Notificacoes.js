import React, { Component } from "react";
import { connect } from "react-redux";

import DateBrSort from "utils/DateBrSort";
import AlfaSort from "utils/AlfaSort";
import StyledCard from 'components/styledcard/StyledCardPrimary';
import { fetchNotificacoes } from "services/ducks/Mtn.ducks";

import { Table } from "antd";

const columns = [
  {
    dataIndex: "nrMtn",
    title: "Nr. Mtn",
    searchText: false,
    sorter: (a, b) => AlfaSort(a.nrMtn, b.nrMtn),
  },

  {
    dataIndex: "criadoEm",
    title: "Data do envio",
    searchText: false,
    sorter: (a, b) => DateBrSort(a.criadoEm, b.criadoEm),
  },

  {
    title: "Email",
    sorter: (a, b) =>
      AlfaSort(a.prazoPendenciaAnalise, b.prazoPendenciaAnalise),
    render: (text, record) => {
      return record.email;
    },
  },

  {
    title: "Tipo",
    sorter: (a, b) =>
      AlfaSort(a.prazoPendenciaAnalise, b.prazoPendenciaAnalise),
    render: (text, record) => {
      return record.tipo;
    },
  },

  {
    title: "Enviado com sucesso",
    sorter: (a, b) =>
      AlfaSort(a.prazoPendenciaAnalise, b.prazoPendenciaAnalise),
    render: (text, record) => {
      return record.filaEnvio ? "Não" : "Sim";
    },
  },
];

class Notificacoes extends Component {
  state = {
    loading: true
  }
  componentDidMount(){
    this.props.fetchNotificacoes(this.props.match.params.idEnvolvido)
    this.setState({loading: false});
  }
  render () {
    return (
      <StyledCard title="Lista de Notificações">
        <Table 
          columns={columns}
          dataSource={this.props.notificacoes}
          scroll={{ x: 'auto' }}
        />
      </StyledCard>
    )
  }
};

const mapStateToProps = state => {
  return {
    notificacoes: state.mtn.notificacoes,
  };
};

export default connect(mapStateToProps, {
  fetchNotificacoes,
})(Notificacoes);
