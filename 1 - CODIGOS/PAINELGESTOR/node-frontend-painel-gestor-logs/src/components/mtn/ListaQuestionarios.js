import React, { Component } from "react";
import {} from "antd";
import AlfaSort from "utils/AlfaSort";
import DateBrSort from "utils/DateBrSort";
import SearchTable from "components/searchtable/SearchTable";
class ListaQuestionarios extends Component {
  state = {
    loading: true
  };

  columns = [
    {
      dataIndex: "titulo",
      title: "Título Formulário",      
      sorter: (a, b) => AlfaSort(a.titulo, b.titulo)
    },
    {
      dataIndex: "envioEmail",
      title: "Notificação",      
      sorter: (a, b) => DateBrSort(a.envioEmail, b.envioEmail), 
    },
    {
      dataIndex: "tipo",
      title: "Tipo",            
    },
    {
      dataIndex: "visualizado",
      title: "Lido?",      

    },
    {
      title: "Ações",      
      align: "center",
      render: (text, record) =>  this.props.getTableActions(record)
    }
  ];

  render() {    
    return (      
      <SearchTable
        columns={ [...this.props.columns, ...this.columns ]}
        dataSource={this.props.questionarios}
        size="small"
        loading={this.props.loading}
        pagination={{ showSizeChanger: true }}
      />
    );
  }
}

export default ListaQuestionarios;
