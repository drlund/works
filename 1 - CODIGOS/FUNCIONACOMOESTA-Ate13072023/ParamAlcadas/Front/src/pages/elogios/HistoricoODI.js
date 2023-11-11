import React, {Component} from 'react';
import { RedoOutlined } from '@ant-design/icons';
import { message, Button, Row, Col } from 'antd';
import SearchTable from 'components/searchtable/SearchTable';
import { fetchHistoricoODI } from 'services/ducks/Elogios.ducks';
import { connect } from 'react-redux';
import moment from 'moment';
import AlfaSort from 'utils/AlfaSort';

class HistoricoODI extends Component{
  state = {
    fetching: false
  }

  componentDidMount() {
    this.fetchAllList();
  }

  fetchAllList = () => {
    this.setState({ fetching: true }, () => {
      this.props.fetchHistoricoODI({
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
        dataIndex: "dataRegistro",
        width: '15%',
        sorter: (a, b) => {
          let dateA = moment(a.dataRegistro);
          let dateB = moment(b.dataRegistro);
          return ((dateA < dateB) ? -1 : ((dateA > dateB) ? 1 : 0))
        },
        render: (record,text) => { 
          return !record ? "" :
            ( <span>{moment(record).format("DD/MM/YYYY HH:mm")}</span> );
         }
      },

      {
        title: 'Autorizador',
        dataIndex: "dadosAut",
        sorter: (a, b) => AlfaSort(a.dadosAut, b.dadosAut)
      },

      {
        title: 'Funci com ODI',
        dataIndex: "funciODI",
        sorter: (a, b) => AlfaSort(a.funciODI, b.funciODI),
      },

      {
        title: 'Registro ODI',
        dataIndex: "conteudoODI",
        sorter: (a, b) => AlfaSort(a.conteudoODI, b.conteudoODI)
      }
      
    ];

    let dadosTabela = this.props.historicoODIs.map(elem => {
      return {...elem, 
        key: elem.id,
        funciODI: elem.dadosODI.matricula + "-" + elem.dadosODI.nome,
        conteudoODI: elem.dadosODI.odi,
        dadosAut: elem.dadosAutorizador.matricula + "-" + elem.dadosAutorizador.nome
      }
    });

    return (
      <SearchTable               
        columns={columns}
        dataSource={dadosTabela}
        ignoreAutoKey
        size="small"
        loading={this.state.fetching}
        pagination={{showSizeChanger: true}}        
      />
    )
  }

  render(){  
    return (
      <div>
        <Row style={{marginBottom: '15px'}}>          
          <Col span={24} style={{textAlign: 'right'}}>
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
  return { historicoODIs: state.elogios.historicoODIs }
}

export default connect(mapStateToProps, {
  fetchHistoricoODI
})(HistoricoODI);

