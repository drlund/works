import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchTable from 'components/searchtable/SearchTable';
import ModalAcompOrdem from '../../minhasordens/ModalAcompOrdem';
import ModalHistoricoOrdem from '../../minhasordens/ModalHistoricoOrdem';
import ModalVisualizarOrdem from '../../minhasordens/ModalVisualizarOrdem';
import { RedoOutlined } from '@ant-design/icons';
import {message, Row, Col, Button, Select, Menu, Dropdown} from 'antd';
import { findByEstadoDaOrdemADM, findEstados } from 'services/ducks/OrdemServ.ducks';
import { ESTADOS, MATRIZ_COR_ESTADOS } from 'pages/ordemserv/Types';
import _ from 'lodash';
import AlfaSort from 'utils/AlfaSort';
import DateBrSort from "utils/DateBrSort";
import uuid from 'uuid/v4';

const { Option } = Select;

class OrdensGerenciar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idOrdem: null,
      filtroEstadoDaOrdem : [0],      
      fetching: false,

      idOrdemViz: null,
      modalVizKey: uuid(),
      modalVizVisible: false,

      idOrdemHist: null,
      modalHistKey: uuid(),
      modalHistVisible: false,

      idOrdemAcomp: null,
      modalAcompKey: uuid(),
      modalAcompVisible: false
    }
  }

  componentDidMount(){
    this.setState({fetching: true}, () => {
      this.props.findEstados({responseHandler:{
        successCallback: () => { this.atualizaTabela() },
        errorCallback: (what) => {         
          if(what){
            message.error(what)
          } else {
            message.error('Falha ao carregar as suas ordems de serviço.')
          }

          this.setState({fetching: false});
        }}      
      })
    })
  }

  renderTable = () => {
    let columns = [
      {
        title: 'Data Criação',
        dataIndex: "data_criacao",
        defaultSortOrder: 'descend',
        width: 140,
        sorter: (a, b) => DateBrSort(a.data_criacao, b.data_criacao)
      },
      {
        title: 'Prefixo',
        dataIndex: "prefixo",
        sorter: (a, b) => AlfaSort(a.prefixo, b.prefixo)
      },
      {
        title: 'Dependência',
        dataIndex: "dependencia",
        sorter: (a, b) => AlfaSort(a.dependencia, b.dependencia)
      },
      {
        title: 'Mat.Autor',
        dataIndex: "matricula_autor",
        sorter: (a, b) => AlfaSort(a.matricula_autor, b.matricula_autor)
      },
      // {
      //   title: 'Autor',
      //   dataIndex: "nome_autor",
      //   sorter: (a, b) => AlfaSort(a.nome_autor, b.nome_autor)
      // },

      {
        title: 'Número',
        dataIndex: "numero",
        width: 140,
        sorter: (a, b) =>{
          const [anoA, numeroA] = a.numero.split("/")
          const [anoB, numeroB] = b.numero.split("/")
          if(anoA === anoB){
            return ((numeroA < numeroB) ? -1 : ((numeroA > numeroB) ? 1 : 0))
          } else {
            return ((anoA < anoB) ? -1 : ((anoA > anoB) ? 1 : 0))
          }
        }
      },
      {
        title: 'Título',
        dataIndex: "titulo",
        sorter: (a, b) => AlfaSort(a.titulo, b.titulo)
      },
      {
        title: 'Estado',
        dataIndex: "estado",
        sorter: (a, b) => AlfaSort(a.estado, b.estado),
        render: (text, record) => {
          return <span style={{color: MATRIZ_COR_ESTADOS[record.id_estado], fontWeight: "bold"}}>{text}</span>
        }
      },
      {
        title: 'Validade',
        dataIndex: "tipo_validade",        
        sorter: (a, b) => AlfaSort(a.tipo_validade, b.tipo_validade),
      },
      {
        title: 'Data Validade',
        dataIndex: "data_validade",
        width: 140,
        sorter: (a, b) => {
          return ((a.data_validade < b.data_validade) ? -1 : ((a.data_validade > b.data_validade) ? 1 : 0))
        }
      },
      {
        title: 'Início Vigência / Data Revogação',
        dataIndex: 'data_vig_ou_revog',
        width: 140,
        sorter: (a, b) => {
          return ((a.data_vig_ou_revog < b.data_vig_ou_revog) ? -1 : ((a.data_vig_ou_revog > b.data_vig_ou_revog) ? 1 : 0))
        }
      },



      {
        title: 'Ações',
        width: "10%",
        align: 'center',
        render: (text,record) => {
          let itemKey = 1;

          const menu = (
            <Menu>
              <Menu.Item key={itemKey++} onClick={() => this.onVisualizarOrdem(record.id_ordem)}>Visualizar Ordem</Menu.Item>              
              <Menu.Item key={itemKey++} onClick={() => this.onAcompanharOrdem(record.id_ordem)}>Acompanhar</Menu.Item>
              <Menu.Item key={itemKey++} onClick={() => this.onVerHistorico(record.id_ordem)}>Ver Histórico</Menu.Item>
            </Menu>
          );

          return(        
            <Dropdown overlay={menu} trigger={['click']} placement ="bottomRight">
              <Button>
                ...
              </Button>
            </Dropdown>
          )
        }
      }
    ]

    return  <SearchTable               
      columns = {columns}
      dataSource = {this.props.listaOrdensPorFiltro}
      size="small"
      ignoreAutoKey
      loading={this.state.fetching}
    />
  }

  renderSelectOptions = () => {
    let estadosFiltrados = this.props.listaEstados.filter(elem => ![ESTADOS.RASCUNHO, ESTADOS.EXCLUIDA].includes(elem.id));

    return(estadosFiltrados.map((elem) => {
        return(<Option key= {elem.id} value = {elem.id}> {elem.estado}</Option>)
      })
    )
  }
  
  atualizaTabela = () =>{
    if (!this.state.filtroEstadoDaOrdem.length) {
      return;
    }

    const responseHandler = {
      successCallback: () => {this.setState({ fetching: false}) },
      errorCallback: (what) => {
        if(what){
          message.error(what)
        } else {
          message.error('Falha ao carregar as suas ordems de serviço.')
        }
        this.setState({ fetching: false}) 
      }
    }

    this.setState({ fetching: true}, () => {
      this.props.findByEstadoDaOrdemADM({filtroEstadoDaOrdem: this.state.filtroEstadoDaOrdem, responseHandler})
    })
  }  

  setFiltroEstadoDaOrdem = (valor) => {
    
    let {filtroEstadoDaOrdem} = this.state;
    let estadosSelec = valor;
    
    //passou uma opcao, mas o state ja continha a opcao Todas
    if (valor.length && filtroEstadoDaOrdem.length === 1 && filtroEstadoDaOrdem.includes(0)) {
      _.pull(estadosSelec, 0);
    }

    //se passou o todas, remove as demais opcoes
    //deixando apenas a opcao todas
    if (valor.includes(0)) {
      estadosSelec = [0]
    }

    this.setState({
      filtroEstadoDaOrdem: estadosSelec
    }, () =>{
      this.atualizaTabela()
    })
  }
  
  onVisualizarOrdem = (idOrdem) => {
    this.setState({ modalVizVisible: true, modalVizKey: uuid(), idOrdemViz: idOrdem});
  }

  onVerHistorico = (idOrdem) => {
   this.setState({ modalHistVisible: true, modalHistKey: uuid(), idOrdemHist: idOrdem});
  }

  onAcompanharOrdem = (idOrdem) => {
    this.setState({ modalAcompVisible: true, modalAcompKey: uuid(), idOrdemAcomp: idOrdem});
  }

  render() {
    return (
      <div>
        
        <Row style={{marginBottom: '15px'}}>
          <Col span={24} style={{textAlign: 'right'}}>
            
            <Select 
              onChange = {this.setFiltroEstadoDaOrdem} 
              value={this.state.filtroEstadoDaOrdem} 
              style={{ width: 420 }}
              mode="multiple"
              allowClear
            > 
              <Option key= {0} value = {0} >Todas</Option>
              {this.renderSelectOptions()}
            </Select>

            <Button 
              icon={<RedoOutlined />} 
              style={{marginLeft: '15px'}}
              onClick = {this.atualizaTabela}
              loading={this.state.fetching}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            {this.renderTable()}
          </Col>
        </Row>

        <ModalVisualizarOrdem
          idOrdem={this.state.idOrdemViz}
          visible={this.state.modalVizVisible} 
          modalKey={this.state.modalVizKey} 
          closeModal={ () => this.setState({modalVizVisible: false, idOrdemViz: null})}
        />

        <ModalHistoricoOrdem
          idOrdem={this.state.idOrdemHist}
          visible={this.state.modalHistVisible} 
          modalKey={this.state.modalHistKey} 
          closeModal={ () => this.setState({modalHistVisible: false, idOrdemHist: null})}
        />

        <ModalAcompOrdem 
          idOrdem={this.state.idOrdemAcomp}
          visible={this.state.modalAcompVisible} 
          modalKey={this.state.modalAcompKey} 
          closeModal={ () => this.setState({modalAcompVisible: false, idOrdemAcomp: null})}
        />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    listaOrdensPorFiltro: state.ordemserv.listaOrdensPorFiltro,
    listaEstados: state.ordemserv.listaEstados,
    historicoOrdem: state.ordemserv.listaHistoricoOrdem
  };
}

export default connect(mapStateToProps, {
  findByEstadoDaOrdemADM,
  findEstados,
})(OrdensGerenciar);