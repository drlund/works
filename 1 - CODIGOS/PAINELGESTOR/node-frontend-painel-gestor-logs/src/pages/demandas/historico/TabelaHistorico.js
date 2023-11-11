import React,{Component} from 'react';
import SearchTable from 'components/searchtable/SearchTable';
import { connect } from 'react-redux';
import moment from 'moment';
import AlfaSort from 'utils/AlfaSort';
import DateBrSort from 'utils/DateBrSort';

class TabelaHistorico extends Component {

  columns = [
    {
      title: 'Funcionário',
      dataIndex: 'dadosResponsavel',
      sorter: (a, b) => {
        let respA = a.dadosResponsavel.nome;
        let respB = b.dadosResponsavel.nome;
        return AlfaSort(respA, respB)
      },
      render: (record,text) => { 
        return !record ? "" :
          ( <span> {record.matricula} - {record.nome} </span>);
       }
    },
    {
      title: 'Cargo',
      dataIndex: 'dadosResponsavel',
      sorter: (a, b) => AlfaSort(a.dadosResponsavel.nomeFuncao, b.dadosResponsavel.nomeFuncao),
      render: (record,text) => { 
        return !record ? "" :
          ( <span> {record.nomeFuncao}</span> );
       }
    },
    {
      title: 'Ação',
      dataIndex: 'acao',
      sorter: (a, b) => AlfaSort(a.acao, b.acao),
      render: (record,text) => { 
        return !record ? "" :
          ( <span> {record}</span> );
       }
    },

    {
      title: 'Data Alteração',
      dataIndex: 'dataRegistro',
      sorter: (a, b) => {
        let dateA = moment(a.dataRegistro).format("DD/MM/YYYY HH:mm");
        let dateB = moment(b.dataRegistro).format("DD/MM/YYYY HH:mm");
        return DateBrSort(dateA, dateB)
      },
      render: (record,text) => { 
        return !record ? "" :
          ( <span> {moment(record).format("DD/MM/YYYY HH:mm")}</span> );
       }
    }
     
  ];

  render(){
    return(
      <SearchTable 
        size="small"
        dataSource={this.props.historico} 
        columns={this.columns} 
      />);
  }
}


const mapStateToProperties = state => {
  return { historico: state.demandas.demanda_atual.historico ? state.demandas.demanda_atual.historico : []}
}

export default connect(mapStateToProperties)(TabelaHistorico);
