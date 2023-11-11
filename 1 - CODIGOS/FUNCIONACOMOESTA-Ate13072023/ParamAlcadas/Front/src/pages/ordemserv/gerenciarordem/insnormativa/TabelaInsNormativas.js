import React, { Component } from 'react'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Popconfirm, Divider, Tooltip, Modal } from 'antd';
import AlfaSort from 'utils/AlfaSort';
import IntegerSort from 'utils/IntegerSort';
import SearchTable from 'components/searchtable/SearchTable';
import ReactHtmlParser from 'react-html-parser';
import { ESTADOS } from 'pages/ordemserv/Types';

class TabelaInsNormativas extends Component {

  renderTable = () => {
    let columns = [
      {
        title: 'IN',
        dataIndex: "nroINC",
        sorter: (a, b) => IntegerSort(a.nroINC, b.nroINC)
      },
      {
        title: 'Título',
        dataIndex: "titulo",
        sorter: (a, b) => AlfaSort(a.titulo, b.titulo),
        render: (text) => {
          return ReactHtmlParser(text)
        }
      },
      {
        title: 'Tipo Norm.',
        dataIndex: "tipoNormativo",
        sorter: (a, b) => AlfaSort(a.tipoNormativo, b.tipoNormativo)
      },
      {
        title: 'Versão',
        dataIndex: "versao",
        sorter: (a, b) => IntegerSort(a.versao, b.versao)
      },
      {
        title: 'Item',
        dataIndex: "item",
        sorter: (a, b) => AlfaSort(a.item, b.item)
      },
      {
        title: 'Ações',
        width: '10%',
        align: 'center',
        render: (text,record) => {
          return (
            <span>   
              <Tooltip title="Visualizar Texto">
                <EyeOutlined
                  className="link-color link-cursor"
                  onClick={() => this.onVisualizar(record)} />
              </Tooltip>

              { this.props.estadoOrdem === ESTADOS.RASCUNHO &&  
                <React.Fragment>
                  <Divider type="vertical"/>

                  <Tooltip title="Remover">
                    <Popconfirm title="Deseja excluir esta instrução?" placement="left" onConfirm={() => this.onRemoverRegistro(record.key) } >
                        <DeleteOutlined className="link-color" />
                    </Popconfirm>
                  </Tooltip>
                </React.Fragment>
              }
            </span>
          );
        }
      }
    ];

    return (
      <SearchTable               
        columns={columns} 
        dataSource={this.props.dadosTabela}
        size="small"
        pagination={{showSizeChanger: true, defaultPageSize: this.props.defaultPageSize || 5}}  
      />
    )

  }

  onRemoverRegistro = (key) => {
    this.props.onRemoverRegistro(key)
  }

  onVisualizar = (record) => {
    Modal.info({
      title: "[IN-" + record.nroINC + "] - " + ReactHtmlParser(record.titulo) + " - Vrs: " + record.versao,
      content: <div><h5>{record.tipoNormativo}</h5><span>{record.item} {ReactHtmlParser(record.textoItem)}</span></div>,
      width: 800,
      centered: true
    })
  }

  render() {
    return (
      <div>
        {this.renderTable()}
      </div>
    )
  }
}

export default TabelaInsNormativas;