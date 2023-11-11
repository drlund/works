import React from 'react';
import PageLoading from 'components/pageloading/PageLoading';
import { Row, Col } from 'antd';
import SelectsBar from './SelectsBar';
import Tabela from './Tabela';
import { toggleSideBar } from 'services/actions/commons';
import { connect } from 'react-redux';

class Acompanhamento extends React.Component {
  state = { 
    pageLoading: true
  }

  componentDidMount = () => {
    this.props.toggleSideBar(true);

    this.setState({
      pageLoading: false,      
      ano: '',
      periodo: '1T',
      lblPeriodo: '1°Tri',
      visao: 'diretoria',
      lblVisao: 'Diretorias'
    });
  }

  updatePeriodo = (periodo, lblPeriodo) => {
    this.setState({ periodo, lblPeriodo });
  }

  updateAno = (ano) => {
    this.setState({ ano });
    
  }

  updateVisao = (visao, lblVisao) => {
    this.setState({ visao, lblVisao });
  }

  render = () => {
    if (this.state.pageLoading) {
      return (
        <PageLoading />
      )
    }
    
    return (
      <div>
        <SelectsBar ano={this.state.ano} updatePeriodo={this.updatePeriodo} updateAno={this.updateAno} updateVisao={this.updateVisao} />
        <Row>
          <Col span={24}>
            <Tabela
              ano={this.state.ano}
              periodo={this.state.periodo}
              lblPeriodo={this.state.lblPeriodo}
              visao={this.state.visao}
              lblVisao={this.state.lblVisao}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return({
    authState: state.app.authState
  })
}

export default connect(mapStateToProps, { toggleSideBar })(Acompanhamento);
