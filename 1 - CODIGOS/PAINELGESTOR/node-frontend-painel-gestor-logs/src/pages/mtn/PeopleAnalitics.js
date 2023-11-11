import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Spin } from 'antd';
import SearchTable from "components/searchtable/SearchTable";
import StyledCard from 'components/styledcard/StyledCardPrimary';
import { fetchPeopleAnalitics } from "services/ducks/Mtn.ducks";

const columns = [
  {
    title: 'Parametro',
    dataIndex: 'parametro'
  },
  {
    title: 'Descrição',
    dataIndex: 'descricao'
  },
  {
    title: 'Item',
    dataIndex: 'item'
  },
  {
    title: 'Resultado',
    dataIndex: 'resultado'
  },
];
class PeopleAnalitics extends Component {
  state = {
    loading: true
  }
  componentDidMount(){
    this.props.fetchPeopleAnalitics(this.props.match.params.idEnvolvido)
    this.setState({loading: false});
  }

  render(props) {
    if(this.state.loading){
      return(
        <Spin tip='Carregando ...' spinning={this.state.loading} style={{ marginTop: 100 }}></Spin>
      )
    } else {
      return (
        <StyledCard title="People Analitics">
          <SearchTable 
            columns={columns}
            dataSource={this.props.peopleAnalitics}
            scroll={{ x: 'auto' }}
          />
        </StyledCard>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    peopleAnalitics: state.mtn.peopleAnalitics,
  };
};

export default connect(mapStateToProps, {
  fetchPeopleAnalitics,
})(PeopleAnalitics);