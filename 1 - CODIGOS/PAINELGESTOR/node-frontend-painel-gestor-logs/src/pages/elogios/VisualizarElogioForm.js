import React, { Component } from 'react';
import { BankOutlined } from '@ant-design/icons';
import {  Col, Row, Table, Avatar } from 'antd';
import { fetchElogio } from 'services/ducks/Elogios.ducks';
import { testeMatricula } from 'utils/Regex';
import { getProfileURL } from 'utils/Commons';
import { connect } from 'react-redux';
import PageLoading from 'components/pageloading/PageLoading';
import InfoLabel from 'components/infolabel/InfoLabel';
import moment from 'moment';
import ReactHtmlParser from 'react-html-parser';
import _ from 'lodash';

class VisualizarElogioForm extends Component {

  state = {
    loading: true,
    found: true    
  };

  componentDidMount() {
    this.setState({ loading: true, found: true}, () => {
      this.props.fetchElogio({
        idElogio: this.props.idElogio,
        responseHandler: {
          successCallback: this.onFetchSuccess,
          errorCallback: this.onFetchError
        }
      })
    })    
  }

  onFetchSuccess = () => {
    this.setState({loading: false, found: true});
  }

  onFetchError = () => {
    this.setState({loading: false, found: false});
  }

  getColumns = () => {

    const columns = [
      {
        title: 'Identificador',
        dataIndex: 'id',
        render: (text,record) => {
            return (
              <span>

                
                {testeMatricula.test(record.id) ? //Caso matrícula mostra a foto da pessoa, caso prefixo mostra o ícone
                  <Avatar style={{verticalAlign: "middle"}} src={getProfileURL(record.id)} />:
                  <Avatar style={{verticalAlign: "middle"}} icon={<BankOutlined />} />
                }
                <span style={{verticalAlign: "middle", marginLeft: 5}} >{record.identificador}</span>
              </span>
            );

        }
      },
      {
        title: 'Tipo',
        dataIndex: 'tipo',
      }    
    ];

    return columns;
  }

  renderListaDestinatarios = () => {
    let tratadoFuncis = [], tratadoPrefixos = [];
    
    if (!_.isUndefined(this.props.dadosElogio.listaFuncis)) {
      tratadoFuncis = this.props.dadosElogio.listaFuncis.map((funci) => {
        return {          
          id: funci.matricula,
          key: funci.matricula,
          tipo: "Funcionário",
          identificador: funci.matricula + " - " + funci.nome
        }
      })
    }

    if(!_.isUndefined(this.props.dadosElogio.listaDependencias)) {
      tratadoPrefixos = this.props.dadosElogio.listaDependencias.map((dependencia) => {
        return {
          id: dependencia.prefixo,
          key: dependencia.prefixo,
          tipo: "Dependência",
          identificador: dependencia.prefixo + " - " + dependencia.nome
        }
      })      
    }

    let dataSource = _.concat(tratadoFuncis, tratadoPrefixos);

    return (
      <Table 
        pagination={{ pageSize: 5 }}
        style={{marginTop: 15}}
        dataSource={dataSource}
        columns={this.getColumns()} 
        size="small"
      />
    )

  }

  render() {
    if (this.state.loading) {
      return( <PageLoading /> );
    }

    if (!this.state.found) {
      return ( <InfoLabel type="error" showicon style={{marginLeft: '20px'}}>
                  As informações deste elogio não foram localizadas na nossa base de dados!
               </InfoLabel>)
    }

    return (
      <div>
        <Row>
          <Col span={24}>
            <strong>Data do Registro:</strong> {moment(this.props.dadosElogio.formData.dataElogio).format('DD/MM/YYYY HH:mm')}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {
              this.props.dadosElogio.formData.fonteElogio === "Outros" &&
              <span><strong>Fonte do Elogio:</strong> {this.props.dadosElogio.formData.outros}</span>
            }
            {
              this.props.dadosElogio.formData.fonteElogio !== "Outros" &&
              <span><strong>Fonte do Elogio:</strong> {this.props.dadosElogio.formData.fonteElogio}</span>
            }

          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <strong>Destinatários:</strong>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {this.renderListaDestinatarios()}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <strong>Texto do Elogio:</strong>
          </Col>
        </Row>
        <Row>
          <Col span={24}>            
            { ReactHtmlParser( this.props.dadosElogio.formData.textoElogio )}
          </Col>
        </Row>


      </div>
    )
  }
}

const mapStateToProps = state => {
  return { dadosElogio: state.elogios.dadosElogio }
}

export default connect(mapStateToProps, {
  fetchElogio
})(VisualizarElogioForm);