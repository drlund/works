import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DeleteOutlined, EditOutlined, EyeOutlined, MailOutlined, RedoOutlined } from '@ant-design/icons';
import { message, Tooltip, Modal, Divider, Popconfirm, Row, Col, Button } from 'antd';
import SearchTable from 'components/searchtable/SearchTable';
import { fetchElogios, deleteElogio, autorizaEnvioElogios } from 'services/ducks/Elogios.ducks';
import { connect } from 'react-redux';
import moment from 'moment';
import AlfaSort from 'utils/AlfaSort';
import { padLeft, verifyPermission } from 'utils/Commons';
import history from "@/history.js";

const { confirm } = Modal;

class ElogiosPendentesForm extends Component {

  state = {
    fetching: false,
    sending: false,
    selectedRowKeys: []
  }

  componentDidMount() {
    this.fetchAllList();
  }

  fetchAllList = () => {
    this.setState({ fetching: true, selectedRowKeys: [] }, () => {
      this.props.fetchElogios({
        tipo: 'pendentes',
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

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

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

              <Divider type="vertical" />

              <Tooltip title="Editar Elogio">
                  <EditOutlined
                    className="link-color link-cursor"
                    onClick={() => this.onEditarRegistro(record.id)} />
              </Tooltip>
        
              <Divider type="vertical" />

              <Popconfirm title="Deseja excluir este elogio?" placement="left" onConfirm={() => this.onRemoverRegistro(record.id) } >
                  <DeleteOutlined className="link-color" />
              </Popconfirm> 

            </span>
          );
        }
      }
    ];

    const { selectedRowKeys } = this.state;
    const dadosTabela = this.props.listaElogios.map((elem) => {
      return {
        ...elem, 
        key: elem.id,
        dadosAutor: elem.dadosAutor.matricula + "-" + elem.dadosAutor.nome
      }
    });

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <SearchTable               
        columns={columns}
        dataSource={dadosTabela}
        rowSelection={rowSelection}
        size="small"
        ignoreAutoKey
        loading={this.state.fetching}
      />
    )
  }

  onEditarRegistro = (id) => {
    history.push('/elogios/editar-elogio/' + id);
  }

  onRemoverRegistro = (id) => {
    this.setState({fetching: true}, () => {
      this.props.deleteElogio({
        id,
        responseHandler: {
          successCallback: this.onRemoverSuccess,
          errorCallback: this.onRemoverError
        }
      });
    });
  }

  onVisualizarRegistro = (id) => {
    this.props.onVisualizarElogio(id, true);
  }

  onRemoverSuccess = (id) => {
    message.success("Registro removido com sucesso!");
    this.fetchAllList();
  }

  onRemoverError = (what) => {
    if (what) {
      message.error(what);
    } else {
      message.error('Falha ao remover registro!');
    }

    this.setState({fetching: false});
  }

  showConfirm = () => {
    const countSelected = padLeft(this.state.selectedRowKeys.length, 4);

    confirm({
      title: 'Autorizar',
      content: <span>Autoriza o envio de <b>{countSelected}</b> elogios?</span>,
      centered: true,
      onOk : this.autorizaEnvio
    });
  }

  autorizaEnvio = () => {
    this.setState({ fetching: true, sending: true }, () => {
      this.props.autorizaEnvioElogios({
        listaElogios: this.state.selectedRowKeys,
        responseHandler: {
          successCallback: this.onAutorizacaoSuccess,
          errorCallback: this.onAutorizacaoError
        }
      })
    });
  }

  onAutorizacaoSuccess = () => {
    message.success("E-mails de elogios enviados com sucesso!");
    this.setState({sending: false, selectedRowKeys: [] }, () => {
      this.fetchAllList();
    })
  }

  onAutorizacaoError = (what) => {
    if (what) {
      message.error(what);
    } else {
      message.error("Falha ao enviar os e-mails dos elogios selecionados!");
    }
    
    this.setState({sending: false }, () => {
      this.fetchAllList();
    })
  }

  render() {
    const hasSelected = this.state.selectedRowKeys.length > 0;
    const permAutorizarEnvio = verifyPermission({
      ferramenta: 'Elogios', 
      permissoesRequeridas: ['AUTORIZAR_ENVIO'], 
      authState: this.props.authState      
    });

    return (
      <div>
        <Row style={{marginBottom: '15px'}}>          
          <Col span={24} style={{textAlign: 'right'}}>
            {
              permAutorizarEnvio &&
              <Button 
                icon={<MailOutlined />} 
                type="primary" 
                disabled={!hasSelected}
                loading={this.state.sending}
                onClick={this.showConfirm}
              >
                Enviar E-mails dos Selecionados
              </Button>
            }

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
    listaElogios: state.elogios.listaElogios.pendentes,
    authState: state.app.authState
  }
}

ElogiosPendentesForm.propTypes = {
  onVisualizarElogio: PropTypes.func.isRequired
}

export default connect(mapStateToProps, {
  fetchElogios,
  deleteElogio,
  autorizaEnvioElogios
})(ElogiosPendentesForm);