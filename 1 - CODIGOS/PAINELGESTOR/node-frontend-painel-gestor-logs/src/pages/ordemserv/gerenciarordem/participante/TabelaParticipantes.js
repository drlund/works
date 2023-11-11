import React, { Component } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Divider, Tooltip } from 'antd';
import { TIPO_PARTICIPANTE, ESTADOS } from 'pages/ordemserv/Types';
import AlfaSort from 'utils/AlfaSort';
import SearchTable from 'components/searchtable/SearchTable';
import _ from 'lodash';

class TabelaParticipantes extends Component {

  renderTable = () => {
    let columns = [
      {
        title: 'Prefixo',
        dataIndex: "prefixo",
        sorter: (a, b) => AlfaSort(a.prefixo, b.prefixo)
      },
      {
        title: 'Dependência',
        dataIndex: "nomeDependencia",
        sorter: (a, b) => AlfaSort(a.nomeDependencia, b.nomeDependencia)
      },
      {
        title: 'Matrícula',
        dataIndex: "matricula",
        sorter: (a, b) => AlfaSort(a.matricula, b.matricula)
      },
      {
        title: 'Nome',
        dataIndex: "nomeFunci",
        sorter: (a, b) => AlfaSort(a.nomeFunci, b.nomeFunci)
      },
      {
        title: 'Tipo de Vínculo',
        dataIndex: "nomeTipoVinculo",
        sorter: (a, b) => AlfaSort(a.tipoVinculo, b.tipoVinculo)
      },
      {
        title: 'Infor. Adicionais',
        dataIndex: "cargoComissao",
        sorter: (a, b) => {
          if (a.nomeComite !== "") {
            return AlfaSort(a.nomeComite, b.nomeComite)
          } else {
            return AlfaSort(a.cargoComissao, b.cargoComissao)
          }
        },
        render: (text, record) => {
          if (record.nomeComite !== "") {
            return record.nomeComite;
          } else {
            return record.cargoComissao;
          }
        }
      }  
    ];

    if (!this.props.estado || this.props.estado === ESTADOS.RASCUNHO) {
      columns.push(
        {
          title: 'Ações',
          width: '10%',
          align: 'center',
          render: (text,record) => {
            return (
              <span>
                <Tooltip title="Editar">
                    <EditOutlined
                      className="link-color link-cursor"
                      onClick={() => {
                        let tmp = { ...record};
                        delete tmp.key;
                        this.props.onEditarRegistro(tmp)
                      }} />
                </Tooltip>
          
                <Divider type="vertical" />

                <Popconfirm 
                  title="Deseja excluir este vínculo?" 
                  placement="left"
                  okText="Sim"
                  cancelText="Não"
                  onConfirm={() => this.props.onRemoverRegistro(record.id, record.tipoParticipante)}
                >
                    <DeleteOutlined className="link-color" />
                </Popconfirm>
              </span>
            );
          }
        }
      );

    } else if (this.props.podeEditarDesignado) { //caso de ordem vigente e designante matricula unica.
      columns.push(
        {
          title: 'Ações',
          width: '10%',
          align: 'center',
          render: (text,record) => {
            return (
              <span>
                {/* permite editar apenas se for novo registro na tabela. */}
                { !_.isNumber(record.id) &&
                  <React.Fragment>
                    <Tooltip title="Editar">
                      <EditOutlined
                        className="link-color link-cursor"
                        onClick={() => {
                          let tmp = { ...record};
                          delete tmp.key;
                          this.props.onEditarRegistro(tmp)
                        }} />
                    </Tooltip>
              
                    <Divider type="vertical" />
                  </React.Fragment>
                }

                {/* permite excluir apenas se for novo registro ou se for a tabela de designados */}
                { (!_.isNumber(record.id) || this.props.tipoParticipante === TIPO_PARTICIPANTE.DESIGNADO) &&
                  <Popconfirm 
                    title="Deseja excluir este vínculo?" 
                    placement="left"
                    okText="Sim"
                    cancelText="Não"
                    onConfirm={() => this.props.onRemoverRegistro(record.id, record.tipoParticipante)}
                  >
                      <DeleteOutlined className="link-color" />
                  </Popconfirm>
                }
              </span>
            );
          }
        }
      );  
    }

    //criando as keys
    let dadosTabela = this.props.dadosParticipantes.map(elem => {
      return {
        key: elem.id,
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

export default TabelaParticipantes;
