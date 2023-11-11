import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EyeOutlined, FileExcelOutlined, RedoOutlined } from '@ant-design/icons';
import { message, Tooltip, Row, Col, Button } from 'antd';
import SearchTable from 'components/searchtable/SearchTable';
import { fetchElogios, downloadElogiosAutorizados } from 'services/ducks/Elogios.ducks';
import { connect } from 'react-redux';
import moment from 'moment';
import AlfaSort from 'utils/AlfaSort';
import { verifyPermission } from 'utils/Commons';

class ElogiosAutorizadosForm extends Component {
  state = {
    fetching: false,
    downloading: false
  }

  componentDidMount() {
    this.fetchAllList();
  }

  fetchAllList = () => {
    this.setState({ fetching: true }, () => {
      this.props.fetchElogios({
        tipo: 'autorizados',
        responseHandler: {
          successCallback: this.onFetchList,
          errorCallback: this.onFetchError
        }
      })  
    })
  }

  onFetchList = () => {
    this.setState({fetching: false});
  }

  onFetchError = (what) => {
    if (what) {
      message.error(what);
    } else {
      message.error('Falha ao receber a lista de elogios!');
    }

    this.setState({fetching: false});    
  }

  renderTable = () => {
    let columns = [
      {
        title: 'Data Registro',
        dataIndex: "dataCriacao",
        width: '15%',
        sorter: (a, b) => {
          let dateA = moment(a.dataCriacao);
          let dateB = moment(b.dataCriacao);
          return ((dateA < dateB) ? -1 : ((dateA > dateB) ? 1 : 0))
        },
        render: (record,text) => { 
          return !record ? "" :
            ( <span>{moment(record).format("DD/MM/YYYY HH:mm")}</span> );
         }
      },

      {
        title: 'Autor',
        dataIndex: "dadosAutor",
        sorter: (a, b) => AlfaSort(a.dadosAutor, b.dadosAutor)
      },

      {
        title: 'Data Autorização',
        dataIndex: "dataAutorizacao",
        width: '15%',
        sorter: (a, b) => {
          let dateA = moment(a.dataAutorizacao);
          let dateB = moment(b.dataAutorizacao);
          return ((dateA < dateB) ? -1 : ((dateA > dateB) ? 1 : 0))
        },
        render: (record,text) => { 
          return !record ? "" :
            ( <span>{moment(record).format("DD/MM/YYYY HH:mm")}</span> );
        }
      },

      {
        title: 'Autorizador',
        dataIndex: "dadosAutorizador",
        sorter: (a, b) => AlfaSort(a.dadosAutorizador, b.dadosAutorizador)
      },

      {
        title: 'Fonte Elogio',
        dataIndex: "fonteElogio",
        sorter: (a, b) => AlfaSort(a.fonteElogio, b.fonteElogio)
      },
      
      {
        title: 'Ações',
        width: '10%',
        align: 'center',
        render: (text,record) => {
          return (
            <span>     
              <Tooltip title="Ver Elogio">
                  <EyeOutlined
                    className="link-color link-cursor"
                    onClick={() => this.onVisualizarRegistro(record.id)} />
              </Tooltip>
        
              {/* <Divider type="vertical" /> */}

            </span>
          );
        }
      }
    ];

    const dadosTabela = this.props.listaElogios.map((elem) => {
      return {
        ...elem, 
        key: elem.id,
        dadosAutor: elem.dadosAutor.matricula + "-" + elem.dadosAutor.nome,
        dadosAutorizador: elem.dadosAutorizador.matricula + "-" + elem.dadosAutorizador.nome
      }
    });


    return (
      <SearchTable               
        columns={columns}
        dataSource={dadosTabela}
        size="small"
        loading={this.state.fetching}
      />
    )
  }

  onVisualizarRegistro = (id) => {
    this.props.onVisualizarElogio(id, false);
  }

  downloadLista = () => {

    this.setState({ downloading: true}, () => {
      this.props.downloadElogiosAutorizados({
        fileName: `lista-elogios-autorizados.xlsx`,
        responseHandler: {
          successCallback: () => { 
            this.setState({ downloading: false});
          },
          errorCallback: (what) => {
            message.error(what || "Falha ao baixar o XLS. Contate o administrador do sistema.")
            this.setState({ downloading: false});
          }
        }
      })  
    });


  }

  render() {
    const permAutorizarEnvio = verifyPermission({
      ferramenta: 'Elogios', 
      permissoesRequeridas: ['AUTORIZAR_ENVIO'], 
      authState: this.props.authState      
    });

    return (
      <div>
        <Row style={{marginBottom: '15px'}}>  
          <Col span={2}>
            {
            permAutorizarEnvio &&
            <Tooltip title="Download Lista dos Autorizados">
              <Button 
                type="primary" 
                shape="circle" 
                icon={<FileExcelOutlined />} 
                onClick={this.downloadLista}
                style={{marginLeft: "15px", backgroundColor: "#207245", border: "none"}} 
                loading={this.state.downloading}
                disabled={this.state.fetching}
              />
            </Tooltip>
            }
          </Col>        
          <Col span={22} style={{textAlign: 'right'}}>
            <Button 
              icon={<RedoOutlined />} 
              loading={this.state.fetching}
              style={{marginLeft: '15px'}}
              onClick={() => this.fetchAllList()}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            {this.renderTable()}
          </Col>
        </Row>

      </div>
    );
  }

}

const mapStateToProps = state => {
  return { 
    listaElogios: state.elogios.listaElogios.autorizados,
    authState: state.app.authState
  }
}

ElogiosAutorizadosForm.propTypes = {
  onVisualizarElogio: PropTypes.func.isRequired
}

export default connect(mapStateToProps, {
  fetchElogios,
  downloadElogiosAutorizados
})(ElogiosAutorizadosForm);