/**
 * Classe que representa a lista de registros na tela de responder da demanda caso seja escolhido
 * o modulo lista no publico-alvo.
 */
import React, { Component } from 'react'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Row, Col, Typography, Tooltip, Divider, Popconfirm } from 'antd';
import SearchTable from 'components/searchtable/SearchTable';
import ReactHtmlParser from 'react-html-parser'; 
import AlfaSort from 'utils/AlfaSort';
import './ListaRegistros.css';

const { Title } = Typography;

class ListaRegistros extends Component {
  
  state = {
    hashAtivo: ''
  }

  renderTable = (dadosLista) => {
    const {headers, dados} = dadosLista;
    let columns = [];

    for (let i=0; i<headers.length; i++) {
      let col = {
        title: headers[i],
        dataIndex: i,
        sorter: (a, b) => AlfaSort(a[i], b[i]),
        render: (text,record) => {
          return <>{ReactHtmlParser(text)}</>
        }
      }

      columns.push(col);
    }

    const colRespondida = {
      title: 'Respondida?',
      dataIndex: "ocorrenciaRespondida",
      width: 150,
      sorter: (a, b) => AlfaSort(a["ocorrenciaRespondida"], b["ocorrenciaRespondida"])
    }

    columns.push(colRespondida);

    const colAcoes = {
      title: 'Ações',
      width: 100,
      fixed: 'right',
      render: (text,record) => {
        let jaRespondeu = record.ocorrenciaRespondida === "Sim";
        const {dados} = dadosLista;

        let finalizouOcorrencias = true;

        for (let i=0; i<dados.length; i++) {
          if (dados[i].ocorrenciaRespondida !== "Sim") {
            finalizouOcorrencias = false;
            break;
          }
        }

        return (
          <div className="acoes-lista-registro" style={{ textAlign: 'center'}}>     
            {
              jaRespondeu &&
                  <div>                    
                    <Tooltip title="Ver Resposta">
                      <EyeOutlined
                        className="link-color link-cursor"
                        onClick={() => this.onVisualizarClick(record.hash)} />
                    </Tooltip>

                    { !finalizouOcorrencias &&
                      <React.Fragment>
                        <Divider type="vertical" />

                        <Popconfirm 
                          title="Deseja excluir esta resposta?" 
                          placement="bottomLeft"
                          onConfirm={() => this.onDeleteClick(record.hash)}
                          okText="Sim"
                          cancelText="Não"
                        >
                          <DeleteOutlined className="link-color link-cursor" />
                        </Popconfirm>
                      </React.Fragment>
                    }
                  </div>
            }

            {
              !jaRespondeu &&
              <Tooltip title="Responder Ocorrência">
                  <EditOutlined
                    className="link-color link-cursor"
                    onClick={() => this.onResponderClick(record.hash)} />
              </Tooltip>
            }
          </div>
        );
      }
    };

    columns.push(colAcoes);

    const dadosTabela = dados.map((elem) => {
      return {
        ...elem, 
        key: elem.hash
      }
    });

    return (
      <SearchTable               
        columns={columns}
        dataSource={dadosTabela}
        loading={this.props.loading}
        size="small"
        pagination={{ showSizeChanger: false }}
        scroll={{ x: true }}
        bordered
        rowClassName={(record, index) => { 
          return (record.hash === this.state.hashAtivo) ? "registro-ativo" : '' 
        }}
      />
    )
  }

  onResponderClick = (hash) => {
    this.setState({ hashAtivo: hash}, () => {
      this.props.onResolveOccurrence(hash)
    })
  }

  onVisualizarClick = (hash) => {
    this.setState({ hashAtivo: hash}, () => {
      this.props.onVizualizeOccurrence(hash)
    })
  }

  onDeleteClick = (hash) => {
    this.setState({ hashAtivo: ''}, () => {
      this.props.onDeleteOccurrence(hash);
    })
  }

  render() {
    return (
      <div style={{ marginBottom: "15px"}}>
        <Row>
          <Col span={24}>
            <Title level={4}>Lista de Ocorrências:</Title>
          </Col>
        </Row>
        <Row>
        <Col span={24}>        
          {this.renderTable(this.props.dadosLista)}  
        </Col>
      </Row>
      </div>
    )
  }
}

export default ListaRegistros;
