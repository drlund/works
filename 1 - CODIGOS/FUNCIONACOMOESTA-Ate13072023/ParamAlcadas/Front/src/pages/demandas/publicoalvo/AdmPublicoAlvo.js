import React, { Component } from 'react'
import { DeleteOutlined, FileExcelOutlined } from '@ant-design/icons';
import { Row, Col, Typography, Button, Tooltip, message, Popconfirm, Spin, Progress } from 'antd';
import uuid from 'uuid/v4';
import moment from 'moment';
import { downloadPublicoAlvoRespostas, excluirRespostas } from 'services/actions/demandas';
import { connect } from 'react-redux';
import ServerSideTable from 'components/serversidetable/ServerSideTable';
import InfoLabel from 'components/infolabel/InfoLabel';
import styled from 'styled-components';
import './AdmPublicoAlvo.css';

const { Title } = Typography;

const SpinContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
`;

const columnsGeral = [
  {
    title: 'Diretoria',
    dataIndex: "diretoria",
    textSearch: true,
    sorter: true
  },
  {
    title: 'Super',
    dataIndex: "super",
    textSearch: true,
    sorter: true
  },
  {
    title: 'Gerev',
    dataIndex: "gerev",
    textSearch: true,
    sorter: true
  },
  {
    title: 'Prefixo',
    dataIndex: "prefixo",
    textSearch: true,
    sorter: true
  },
  {
    title: 'Dependência',
    dataIndex: "nomePrefixo",        
    textSearch: true,
    sorter: true        
  },      

];

const columnsFunci = [
  {
    title: 'Matrícula',
    dataIndex: "matricula",
    textSearch: true,
    sorter: true
  },
  {
    title: 'Nome',
    dataIndex: "nome",
    textSearch: true,
    sorter: true
  },
  {
    title: 'Cargo',
    dataIndex: "desc_cargo",
    textSearch: true,
    sorter: true
  }
]

const columnDataResposta = {
  title: 'Respondido em',
  dataIndex: "respondidoEm",
  textSearch: false,
  render: (text,record) =>  {
    return moment(record.respondidoEm).format("DD/MM/YYYY HH:mm");
  },
  sorter: true
};

const columnProgressoRespostas = {
  title: 'Progresso',
  dataIndex: 'progressoRespostas',
  textSearch: false,
  render: (text,record) =>  {
    let progresso = parseInt(record.progressoRespostas);
    return <div style={{ width: "80%"}}><Progress percent={progresso} size="small" /></div>
  },
  sorter: true
}

class AdmPublicoAlvo extends Component {

  state = {
    loadingRespondidos: false,
    loadingPendentes: false,
    renderingRespondidos: false,
    removingResponse: false
  }
 
  renderTableRespondidos = () => {
    if (this.state.renderingRespondidos) {
      return (
        <SpinContainer>
          <Spin />
        </SpinContainer>
      )
    }

    const columnAcoes = {
      title: 'Ações',
      width: '6%',
      align: 'center',
      render: (text,record) => {
        let recordID = "id";
        let recordText = "nome";

        if (this.props.publicoAlvo.tipoPublico === "lista") {
          //verifica se passou prefixo ou matriculas nos dados da lista
          let temPrefixos = this.props.publicoAlvo.lista.dados[0]['0'].length <= 4;
          recordID = temPrefixos ? "prefixo" : "matricula";
          recordText = temPrefixos ? "nomePrefixo" : "nome";
        }
    
        return (
          <span>     
            <Popconfirm title={
                <span>Deseja excluir a resposta de <strong>"{record[recordText]}"</strong>?
                <br />
                <strong><InfoLabel type="error" showIcon={false}>Atenção: Esta ação é irreversível!</InfoLabel></strong>
                </span>
              } 
              placement="left" 
              onConfirm={() => this.onRemoverResposta(record[recordID]) }
              okText="Sim"
              cancelText="Não"
            >
                <DeleteOutlined className="link-color" />
            </Popconfirm> 
          </span>
        );
      }
    }

    let columnsTotal = []; 

    if (this.props.publicoAlvo.tipoPublico === "lista") {
      //verifica se passou prefixo ou matriculas nos dados da lista
      let temPrefixos = this.props.publicoAlvo.lista.dados[0]['0'].length <= 4;
      columnsTotal = temPrefixos ? [...columnsGeral, columnDataResposta, columnAcoes] : [...columnsGeral, ...columnsFunci, columnDataResposta, columnAcoes];
    } else {
      columnsTotal = [...columnsGeral, ...columnsFunci, columnDataResposta, columnAcoes];
    }

  
    return (
      <ServerSideTable 
        fetchURL={"/demandas/publicoalvo/paginate/" + this.props.idDemanda} 
        fetchParams={{type: "respondidos"}}
        columns={columnsTotal} 
        size="small"
      />
    )
  }

  renderTablePendentes = () => {

    let columnsTotal = []; 

    if (this.props.publicoAlvo.tipoPublico === "lista") {
      //verifica se passou prefixo ou matriculas nos dados da lista
      let temPrefixos = this.props.publicoAlvo.lista.dados[0]['0'].length <= 4;
      columnsTotal = temPrefixos ? [...columnsGeral, columnProgressoRespostas] : [...columnsGeral, ...columnsFunci, columnProgressoRespostas];
    } else {
      columnsTotal = this.props.publicoAlvo.multiplaPorPrefixo ? 
        [...columnsGeral, ...columnsFunci] : [...columnsGeral];
    }

    return (
      <ServerSideTable 
        fetchURL={"/demandas/publicoalvo/paginate/" + this.props.idDemanda} 
        fetchParams={{type: "pendentes"}}
        /*Caso seja múltiplo por prefixo as colunas de funci devem ser incluídas */
        columns={ columnsTotal} 
        size="small"
        rowKey={() => uuid()}
      />
    )
  }

  onRemoverResposta = (idResposta) => {
    let updatedData = {
      renderingRespondidos: true,
      removingResponse: true
    }

    this.setState({...updatedData}, () => {
      this.props.excluirRespostas({
        idDemanda: this.props.idDemanda,
        idResposta,
        responseHandler: {
          successCallback: this.onRemoveSuccess,
          errorCallback: this.onRemoveError
        }
      })
    })
  }

  onRemoverTodasRespostas = () => {
    let updatedData = {
      renderingRespondidos: true,
      removingResponse: true
    }

    this.setState({...updatedData}, () => {
      this.props.excluirRespostas({
        idDemanda: this.props.idDemanda,
        excluirTodas: true,
        responseHandler: {
          successCallback: this.onRemoveAllSuccess,
          errorCallback: this.onRemoveError
        }
      })
    })
  }

  onRemoveSuccess = () => {
    let updatedData = {
      renderingRespondidos: false,
      removingResponse: false
    }

    this.setState({...updatedData}, () => {
      message.success("Resposta removida com sucesso");
      this.props.reloadEstatisticas();
    });
  }

  onRemoveAllSuccess = () => {
    let updatedData = {
      renderingRespondidos: false,
      removingResponse: false
    }

    this.setState({...updatedData}, () => {
      message.success("Respostas removidas com sucesso da demanda!");
      this.props.reloadEstatisticas();
    });
  }

  onRemoveError = (what) => {
    let updatedData = {
      renderingRespondidos: false,
      removingResponse: false
    }

    this.setState({...updatedData}, () => {
      if (what) {
        message.error(what);
      } else {
        message.error("Erro ao remover resposta!");
      }
    });
  }


  downloadRespondidos = () => {
    this.setState({ loadingRespondidos: true}, () => {
      this.props.downloadPublicoAlvoRespostas({
        idDemanda: this.props.idDemanda,
        type: "respondidos",
        fileName: `publico-alvo-respondidos-${this.props.idDemanda}.xlsx`,
        responseHandler: {
          successCallback: () => { 
            this.setState({ loadingRespondidos: false});          
          },
          errorCallback: (what) => {
            message.error(what || "Falha ao baixar o XLS. Contate o administrador do sistema.")
            this.setState({ loadingRespondidos: false});
          }
        }
      })  
    });
  }

  downloadPendentes = () => {
    this.setState({ loadingPendentes: true}, () => {
      this.props.downloadPublicoAlvoRespostas({
        idDemanda: this.props.idDemanda,
        type: "pendentes",
        fileName: `publico-alvo-pendentes-${this.props.idDemanda}.xlsx`,
        responseHandler: {
          successCallback: () => { 
            this.setState({ loadingPendentes: false});
          },
          errorCallback: (what) => {
            message.error(what || "Falha ao baixar o XLS. Contate o administrador do sistema.")
            this.setState({ loadingPendentes: false});
          }
        }
      })  
    });

  }

  render() {
    let isRespostaUnica = this.props.respostaUnica !== undefined && this.props.respostaUnica;

    return (
      <div>
        <Row style={{ marginBottom: "20px"}}>
            <Col span={24}>
              <Title level={3}>
                <Row>
                  <Col span={12}>
                    Respondidos
                    { this.props.estatisticasDemanda.finalizadas > 0 &&
                      <Tooltip title="Download Respondidos">
                        <Button 
                          type="primary" 
                          shape="circle" 
                          icon={<FileExcelOutlined />} 
                          onClick={this.downloadRespondidos}
                          style={{marginLeft: "15px", backgroundColor: "#207245", border: "none"}} 
                          loading={this.state.loadingRespondidos}
                          disabled={this.props.estatisticasDemanda.finalizadas === 0}
                        />
                      </Tooltip>
                    }
                  </Col>
                  <Col span={12} style={{ textAlign: "right"}}>
                    { (this.props.estatisticasDemanda.finalizadas > 0) &&                    
                      <Popconfirm 
                        title={
                          <span>Deseja excluir todas as respostas desta demanda?
                          <br />
                          <strong><InfoLabel type="error" showIcon={false}>Atenção: Esta ação é irreversível!</InfoLabel></strong>
                          </span>
                        } 
                        onConfirm={this.onRemoverTodasRespostas} 
                        placement="left"
                      >
                        <Button type="danger" icon={<DeleteOutlined />} size="small">Remover Todos</Button>
                      </Popconfirm>                    
                    }
                  </Col>
                </Row>
              </Title>

              {this.renderTableRespondidos()}

            </Col>
        </Row>
        { isRespostaUnica && 
          <Row>
            <Col span={24}>
              <Title level={3}>
              Pendentes
                { this.props.estatisticasDemanda.pendentes > 0 &&
                  <Tooltip title="Download Pendentes">
                      <Button 
                        type="primary" 
                        shape="circle" 
                        icon={<FileExcelOutlined />} 
                        onClick={this.downloadPendentes}
                        style={{marginLeft: "15px", backgroundColor: "#207245", border: "none"}} 
                        loading={this.state.loadingPendentes}
                      />
                    </Tooltip>
                }
              </Title>
              
              { !this.state.removingResponse &&
                this.renderTablePendentes()
              }

            </Col>
          </Row>
        }
      </div>
    );
  }
  
}

const mapStateToProps = state => {
  return {  
    estatisticasDemanda: state.demandas.estatisticasDemanda, 
    respostaUnica: state.demandas.demanda_atual.publicoAlvo.respostaUnica
  }
}

export default connect(mapStateToProps, { 
  downloadPublicoAlvoRespostas,
  excluirRespostas
})(AdmPublicoAlvo);