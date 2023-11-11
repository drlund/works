import React, { Component } from 'react'
import AlfaSort from 'utils/AlfaSort';
import SearchTable from 'components/searchtable/SearchTable';
import InfoLabel from 'components/infolabel';

class TabelaMembrosComite extends Component {

  renderAlertText = (text) => {
    return (
      <InfoLabel type="error" showIcon={false} style={{fontWeight: "bold"}}>{text}</InfoLabel>
    )
  }

  renderTable = () => {
    const warningText = "!!!ATENCAO!!!";

    let columns = [
      {
        title: 'Prefixo',
        dataIndex: "prefixo",
        sorter: (a, b) => AlfaSort(a.prefixo, b.prefixo),
        render: (text, record) => {
          if (record.dependencia === warningText) {
            return this.renderAlertText(text)
          }

          return text;
        }
      },
      {
        title: 'Dependência',
        dataIndex: "dependencia",
        sorter: (a, b) => AlfaSort(a.dependencia, b.dependencia),
        defaultSortOrder: 'ascend',
        render: (text, record) => {
          if (text === warningText) {
            return this.renderAlertText(text)
          }

          return text;
        }
      },
      {
        title: 'Matrícula',
        dataIndex: "matricula",
        sorter: (a, b) => AlfaSort(a.matricula, b.matricula),
        render: (text, record) => {
          if (record.dependencia === warningText) {
            return this.renderAlertText(text)
          }

          return text;
        }
      },
      {
        title: 'Nome',
        dataIndex: "nome",
        sorter: (a, b) => AlfaSort(a.nome, b.nome),
        render: (text, record) => {
          if (record.dependencia === warningText) {
            return this.renderAlertText(text)
          }

          return text;
        }
      }
    ];

    //criando as keys
    let dadosTabela = this.props.dados.map(elem => {
      return {
        key: elem.matricula,
        ...elem
      }
    })

    return (
      <SearchTable               
        columns={columns} 
        dataSource={dadosTabela}
        size="small"
        pagination={{showSizeChanger: true, defaultPageSize: 5}}        
      />
    )
  }

  render() {
    return (
      <div>
        {this.renderTable()}
      </div>
    )
  }
}

export default TabelaMembrosComite;