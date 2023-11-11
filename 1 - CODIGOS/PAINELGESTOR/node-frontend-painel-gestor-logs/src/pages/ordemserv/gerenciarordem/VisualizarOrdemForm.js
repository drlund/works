import React, { Component } from 'react';
import VisualizarOrdemComponent from '../minhasordens/VisualizarOrdemComponent';
import { fetchVisualizarOrdem } from 'services/ducks/OrdemServ.ducks';
import PageLoading from 'components/pageloading/PageLoading';
import { connect } from 'react-redux';
import InfoLabel from 'components/infolabel/InfoLabel';
import { message, Row, Col } from 'antd';
import { verifyPermission } from 'utils/Commons';
import styled from 'styled-components';

const HeaderPanel = styled.div`
  background-color: #7999b2;
  margin-top: -24px;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 12px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  min-height: 40px;
  text-align: center;
  border-bottom: 3px solid #5f788b;
  margin-bottom: 15px;
`;


class VisualizarOrdemForm extends Component {

  state = {
    loading: true,
    found: true,
    errorMsg: "Ordem de Serviço não localizada na nossa base de dados ou usuário sem acesso!"
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.fetchCurrentOrdem(this.props.match.params.id);
    }
  }

  fetchCurrentOrdem = (id) => {
    this.setState({loading: true}, () => {
      this.props.fetchVisualizarOrdem(id)
      .then( () => {
        this.setState({loading: false});
      })
      .catch( (error) => {
        message.error(error);
        this.setState({found: false, errorMsg: error});
      });
    });
  }


  render() {
    if (!this.state.found) {
      return (
        <InfoLabel type="error" showicon style={{marginLeft: '20px'}}>            
          {this.state.errorMsg}
        </InfoLabel>
      )
    }

    if (this.state.loading) {
      return <PageLoading />
    } else {
      let visConfig = {
        mostrarDesignantes:true, 
        modoEdicaoDesignantes: false,
        mostrarDesignados:true,
        modoEdicaoDesignados: false
      };
  
      const hasPrintPdfPermission = verifyPermission({
        ferramenta: 'Ordem de Serviço',
        permissoesRequeridas: ['IMPRIMIR_PDF'],
        authState: this.props.authState
      });

      return (
        <div>
          <HeaderPanel>
            <h2 style={{color: '#fff'}}>O.S. - {this.props.dadosOrdem.dadosBasicos.titulo}</h2>
          </HeaderPanel>

          <Row style={{marginBottom: 20}}>
            <Col span={24}>
              <VisualizarOrdemComponent 
                dadosOrdem={this.props.dadosOrdem} 
                permiteImpressaoPdf={hasPrintPdfPermission}
                config={visConfig} 
              />
            </Col>
          </Row>
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    dadosOrdem: state.ordemserv.ordemAtual,
    authState: state.app.authState
  }
}

export default connect(mapStateToProps, {
  fetchVisualizarOrdem
})(VisualizarOrdemForm);