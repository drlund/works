import React, {Component} from 'react';
import { RedoOutlined } from '@ant-design/icons';
import { message, Button, Row, Col } from 'antd';
import SearchTable from 'components/searchtable/SearchTable';
import { fetchHistoricoElogios } from 'services/ducks/Elogios.ducks';
import { connect } from 'react-redux';
import moment from 'moment';
import AlfaSort from 'utils/AlfaSort';

class HistoricoElogios extends Component{
  state = {
    fetching: false
  }

  componentDidMount() {
    this.fetchAllList();
  }

  fetchAllList = () => {
    this.setState({ fetching: true }, () => {
      this.props.fetchHistoricoElogios({
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
        title: 'Autor',
        dataIndex: "dadosAutor",
        sorter: (a, b) => AlfaSort(a.dadosAutor.nome, b.dadosAutor.nome),
        render: (record,text) => { 
          return !record ? "" :
            ( <span>{record.matricula + "-" + record.nome}</span> );
         }
      },

      {
        title: 'Ação',
        dataIndex: "acao",
        sorter: (a, b) => AlfaSort(a.acao, b.acao),
      }
      
    ];

    let dadosTabela = this.props.listaElogios.map(elem => {
      return {...elem, key: elem.id}
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
  return { listaElogios: state.elogios.historicoElogios }
}

export default connect(mapStateToProps, {
  fetchHistoricoElogios
})(HistoricoElogios);

