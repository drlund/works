import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchTable from 'components/searchtable/SearchTable';
import { RedoOutlined } from '@ant-design/icons';
import {message, Row, Col, Button, Menu, Dropdown} from 'antd';
import {findHistoricoPessoal, findHistoricoOrdem } from 'services/ducks/OrdemServ.ducks';
import ModalHistoricoOrdem from './ModalHistoricoOrdem';
import ModalVisualizarOrdem from './ModalVisualizarOrdem';
import AlfaSort from 'utils/AlfaSort';
import DateBrSort from "utils/DateBrSort";
import uuid from 'uuid/v4';

class HistoricoPessoal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      
      idOrdemViz: null,
      modalVizKey: uuid(),
      modalVizVisible: false,

      idOrdemHist: null,
      modalHistKey: uuid(),
      modalHistVisible: false,
    }
  }
  
  renderTable = () => {
    let columns = [
      {
        title: 'Data/Hora Evento',
        dataIndex: "dataEvento",
        width: '10%',
        sorter: (a, b) => DateBrSort(a.dataEvento, b.dataEvento)
      },
      {
        title: 'Número',
        dataIndex: "numero",
        width: '10%',
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
        title: 'Título da Ordem',
        dataIndex: "titulo",
        width: '25%',
        sorter: (a, b) => AlfaSort(a.titulo, b.titulo),
      },
      {
        title: 'Participação',
        dataIndex: "tipoParticipacao",
        width: '10%',
        sorter: (a, b) => AlfaSort(a.tipoParticipacao, b.tipoParticipacao),
      },
      // {
      //   title: 'Evento',
      //   dataIndex: "descEvento",
      //   width: '20%',
      //   sorter: (a, b) => AlfaSort(a.descEvento, b.descEvento),
      // },
      {
        title: 'Ações',
        width: '10%',
        align: 'center',
        render: (text,record) => {
          let itemKey = 1;

          const menu = (
            <Menu>
              <Menu.Item key={itemKey++} onClick={() => this.onVisualizarOrdem(record.idOrdem)}>Visualizar Ordem</Menu.Item>
              <Menu.Item key={itemKey++} onClick={() => this.onVerHistorico(record.idOrdem)}>Ver Histórico</Menu.Item>
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

    const dadosTabela = this.props.listaHistorico.map((elem) =>{
      return {
        ...elem,
        key: elem.id
      }
    })

    return  <SearchTable               
      columns = {columns}
      dataSource = {dadosTabela}
      size="small"
      ignoreAutoKey
      loading={this.state.fetching}
    />
  }

  atualizaTabela = () => {

    const responseHandler = {
      successCallback: () => {this.setState({ fetching: false}) },
      errorCallback: (what) => {
        if(what){
          message.error(what)
        } else {
          message.error('Falha ao carregar o seu histórico das ordens.')
        }
        this.setState({ fetching: false}) 
      }
    }
    this.setState({ fetching: true}, () => {
      this.props.findHistoricoPessoal({responseHandler})
    })
  }

  componentDidMount(){
    this.atualizaTabela()
  }

  onVisualizarOrdem = (idOrdem) => {
    this.setState({idOrdemViz: idOrdem, modalVizVisible: true, modalVizKey: uuid()});
  }

  onVerHistorico = (idOrdem) => {
    this.setState({idOrdemHist: idOrdem, modalHistVisible: true, modalHistKey: uuid()});
  }

  render() {
    return (
      <div>
        <Row style={{marginBottom: '15px'}}>
          <Col span={24} style={{textAlign: 'right'}}>
            <Button 
              icon={<RedoOutlined />} 
              style={{marginLeft: '15px'}}
              onClick = {this.atualizaTabela}
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    listaHistorico: state.ordemserv.listaHistoricoPessoal,
    historicoOrdem: state.ordemserv.listaHistoricoOrdem
  };
}

export default connect(mapStateToProps, {
  findHistoricoPessoal,
  findHistoricoOrdem
})(HistoricoPessoal);