import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchTable from 'components/searchtable/SearchTable';
import ModalAcompOrdem from './ModalAcompOrdem';
import ModalHistoricoOrdem from './ModalHistoricoOrdem';
import ModalVisualizarOrdem from './ModalVisualizarOrdem';
import ModalInsNormAlteradas from './ModalInsNormAlteradas';
import { RedoOutlined } from '@ant-design/icons';
import {message, Row, Col, Button, Select, Menu, Dropdown, Modal, Tag} from 'antd';
import { 
  findByEstadoDaOrdem, findEstados, 
  deleteOrdem, clonarOrdemServico,
  voltarOrdemRascunho, removerAutorizacaoConsulta
} from 'services/ducks/OrdemServ.ducks';
import {Link} from "react-router-dom";
import { ESTADOS, MATRIZ_COR_ESTADOS } from 'pages/ordemserv/Types';
import _ from 'lodash';
import AlfaSort from 'utils/AlfaSort';
import DateBrSort from "utils/DateBrSort";
import history from 'history.js'
import uuid from 'uuid/v4';

const { Option } = Select;

const verificaAssinatura = (record, assinou = true) => {
  return assinou ? record.assinou : !record.assinou
}

const verificaEstado = (record, estados = [], possui = true) => {  
  return possui ? estados.includes(record.id_estado) : !estados.includes(record.id_estado)
}

const isColaborador = (record) => {
  return (record.participacao === "Colaborador" || record.eh_colaborador)
}

const isDesignante = (record) => {
  return record.participacao === "Designante"
}

const isDesignado = (record) => {
  return record.participacao === "Designado"
}

const isDependencia = (record) => {
  return record.participacao === "Dependência"
}

const isConsultaAutorizada = (record) => {
  return record.participacao === "Consulta"
}

const validateRules = (rulesList) => {
  let allValid = true;

  for (let elem of rulesList) {
    allValid &= elem.rule(...elem.args)
  }

  return allValid;
}

const assertRetornarRascunhoRule = (record) => {
  let ruleEstado = validateRules([
    { rule: verificaEstado, args: [record, [
      ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES
    ]]}
  ])

  return (isColaborador(record) || isDesignante(record)) && ruleEstado;
}

const assertAssinarRule = (record) => {
  return validateRules([
    { rule: isDesignante, args: [record]}, //eh designante
    { rule: verificaAssinatura, args: [record, false]}, //nao assinou
    { rule: verificaEstado, args: [record, [
      ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES,
      ESTADOS.VIGENTE
    ]]}
  ])
}

const assertDarCienciaRule = (record) => {
  return validateRules([
    { rule: isDesignado, args: [record]}, //eh designado
    { rule: verificaAssinatura, args: [record, false]}, //nao assinou
    { rule: verificaEstado, args: [record, [
      ESTADOS.VIGENTE
    ]]}
  ])
}

const assertRevogarRule = (record) => {
  let rulesAcesso = validateRules([
    { rule: isDesignante, args: [record]}, //eh designante
    { rule: verificaEstado, args: [record, [
      ESTADOS.VIGENTE, 
      ESTADOS.VIGENTE_PROVISORIA,
      ESTADOS.PENDENTE_ASSINATURA_DESIGNANTES
    ]]}
  ]);

  let ruleVigProvisoria = validateRules([
    { rule: verificaEstado, args: [record, [ESTADOS.VIGENTE_PROVISORIA]]}
  ]);

  //permite revogar em duas ocasioes:
  //1 - for designante e o estado estiver vigente ou vigente provisoria, sem alteracao nas instrucoes normativas
  //2 - se o estado for vigencia provisoria e o funci possuir nivel gerencial e a participação for Dependencia
  return (rulesAcesso && !record.possuiAlteracaoInsNorm) || 
         (isDependencia(record) && ruleVigProvisoria && record.isNivelGerencial);
}

const assertVerInsAlteradas = (record) => {
  let rulesAcessoDesignante = validateRules([
    { rule: isDesignante, args: [record]}, //eh designante
    { rule: verificaEstado, args: [record, [ESTADOS.VIGENTE_PROVISORIA]]}
  ]);

  let rulesAcessoColaborador = validateRules([
    { rule: isColaborador, args: [record]}, //eh colaborador
    { rule: verificaEstado, args: [record, [ESTADOS.VIGENTE_PROVISORIA]]}
  ]);
  
  return (rulesAcessoDesignante || rulesAcessoColaborador) && record.possuiAlteracaoInsNorm;
}

const assertAcompanharRule = (record) => {
  const ruleColab = validateRules([
    { rule: isColaborador, args: [record]}, //eh colaborador
    { rule: verificaEstado, args: [record, [ESTADOS.RASCUNHO, ESTADOS.EXCLUIDA], false]}
  ])

  const ruleDesig = validateRules([
    { rule: isDesignante, args: [record]}, //eh designante
    { rule: verificaEstado, args: [record, [ESTADOS.RASCUNHO, ESTADOS.EXCLUIDA], false]}
  ])

  return ruleColab || ruleDesig;
}

const assertVerHistorico = (record) => {
  let ruleEstado = validateRules([
    { rule: verificaEstado, args: [record, [ESTADOS.RASCUNHO], false]}
  ])

  return (isColaborador(record) || isDesignante(record) || isConsultaAutorizada(record)) && ruleEstado;
}

const assertEditarRule = (record) => {
  const ruleEstado = validateRules([
    { 
      rule: verificaEstado, 
      args: [record, [
        ESTADOS.RASCUNHO,
        ESTADOS.VIGENTE
      ]]
    }
  ]);

  return ruleEstado && (isDesignante(record) || isColaborador(record));
}

const assertExcluirRule = (record) => {
  return validateRules([
    { rule: isColaborador, args: [record]}, //eh colaborador
    { rule: verificaEstado, args: [record, [ESTADOS.RASCUNHO]]}
  ])
}

const assertClonarRule = (record) => {
  return validateRules([
    { rule: verificaEstado, args: [record, [ESTADOS.RASCUNHO], false]}
  ])
}

const assertRemoverAutorizacao = (record) => {
  return validateRules([
    { rule: isConsultaAutorizada, args: [record]}
  ])
}

class OrdensAtuais extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idOrdem: null,
      filtroEstadoDaOrdem : [0],      
      fetching: false,

      idOrdemViz: null,
      modalVizKey: uuid(),
      modalVizVisible: false,

      idOrdemHist: null,
      modalHistKey: uuid(),
      modalHistVisible: false,

      idOrdemAcomp: null,
      modalAcompKey: uuid(),
      modalAcompVisible: false,

      idOrdemInsNorm: null,
      modalInsNormKey: uuid(),
      modalInsNormVisible: false
    }
  }

  componentDidMount(){
    this.setState({fetching: true}, () => {
      this.props.findEstados({responseHandler:{
        successCallback: () => { this.atualizaTabela() },
        errorCallback: (what) => {         
          if(what){
            message.error(what)
          } else {
            message.error('Falha ao carregar as suas ordems de serviço.')
          }

          this.setState({fetching: false});
        }}      
      })
    })
  }

  renderTable = () => {
    let columns = [
      {
        title: 'Data Criação',
        dataIndex: "data_criacao",
        width: '10%',
        defaultSortOrder: 'descend',
        sorter: (a, b) => DateBrSort(a.data_criacao, b.data_criacao)
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
        title: 'Título',
        dataIndex: "titulo",
        width: '15%',
        sorter: (a, b) => AlfaSort(a.titulo, b.titulo)
      },
      {
        title: 'Estado',
        dataIndex: "estado",
        width: '15%',
        sorter: (a, b) => AlfaSort(a.estado, b.estado),
        render: (text, record) => {
          return <span style={{color: MATRIZ_COR_ESTADOS[record.id_estado], fontWeight: "bold"}}>{text}</span>
        }
      },
      {
        title: 'Validade',
        dataIndex: "tipo_validade",
        width: '10%',
        sorter: (a, b) => AlfaSort(a.tipo_validade, b.tipo_validade),
      },
      {
        title: 'Data Validade',
        dataIndex: "data_validade",
        width: '10%',
        sorter: (a, b) => {
          return ((a.data_validade < b.data_validade) ? -1 : ((a.data_validade > b.data_validade) ? 1 : 0))
        }
      },
      {
        title: 'Participação',
        dataIndex: "participacao",
        width: '10%',
        sorter: (a, b) => AlfaSort(a.participacao, b.participacao),
      },
      {
        title: 'Assinou',
        dataIndex: "assinouText",
        width: '10%',
        sorter: (a, b) => AlfaSort(a.assinouText, b.assinouText),            
        render: (text, record) => {
          let colorMatriz = {
            "Sim": "#52c41a",
            "Não": "#F42937",
            "N/A": "#CCC"
          }

          let color = colorMatriz[text];
          return <Tag color={color}>{text}</Tag>
        }
      },
      {
        title: 'Início Vigência / Data Revogação',
        dataIndex: 'data_vig_ou_revog',
        width: '10%',
        sorter: (a, b) => {
          return ((a.data_vig_ou_revog < b.data_vig_ou_revog) ? -1 : ((a.data_vig_ou_revog > b.data_vig_ou_revog) ? 1 : 0))
        }
      },

      {
        title: 'Ações',
        width: 80,
        align: 'center',
        render: (text,record) => {
          let itemKey = 1;

          const menu = (
            <Menu>
              <Menu.Item key={itemKey++} onClick={() => this.onVisualizarOrdem(record.id_ordem)}>Visualizar Ordem</Menu.Item>
              { assertAssinarRule(record) && <Menu.Item key={itemKey++}><Link to={`/ordemserv/assinar-ordem/${record.id_ordem}`}>Assinar</Link></Menu.Item> }
              { assertDarCienciaRule(record) && <Menu.Item key={itemKey++}><Link to={`/ordemserv/dar-ciencia-ordem/${record.id_ordem}`}> Dar Ciência </Link></Menu.Item> }
              { assertRevogarRule(record) && <Menu.Item key={itemKey++}><Link to={`/ordemserv/revogar-ordem/${record.id_ordem}`}>Revogar</Link></Menu.Item> }
              { assertRetornarRascunhoRule(record) && <Menu.Item key={itemKey++} onClick={() => this.onVoltarParaRascunho({idOrdem: record.id_ordem, titulo: record.titulo})}>Voltar para Rascunho</Menu.Item> }

              {record.participacao === 'Colaborador' ? <Menu.Divider /> : ""}
              { assertEditarRule(record) && <Menu.Item key={itemKey++} onClick={() => this.onEditarOrdem(record.id_ordem)}>Editar</Menu.Item> }
              { assertExcluirRule(record) && <Menu.Item key={itemKey++} onClick={() => this.onConfirmDelete(record.id_ordem, record.titulo)}>Excluir</Menu.Item>}
              { assertAcompanharRule(record) && <Menu.Item key={itemKey++} onClick={() => this.onAcompanharOrdem(record.id_ordem)}>Acompanhar</Menu.Item> }
              { assertVerHistorico(record) && <Menu.Item key={itemKey++} onClick={() => this.onVerHistorico(record.id_ordem)}>Ver Histórico</Menu.Item> }
              { assertVerInsAlteradas(record) && <Menu.Item key={itemKey++} title="Ver as Instruções Normativas alteradas nesta ordem." onClick={() => this.onVerInsAlteradas(record.id_ordem)}>Ver Ins. Norm. Alteradas</Menu.Item> }              
              { assertRemoverAutorizacao(record) && <Menu.Item key={itemKey++} title="Remover a autorização de consulta" onClick={() => this.onRemoverAutorizacaoConsultaConfirm(record.id_ordem, record.titulo)}>Remover Autorização</Menu.Item> }
              { assertClonarRule(record) && <Menu.Item key={itemKey++} title="Cria uma nova ordem rascunho com base nessa." onClick={() => this.onClonarOrdemConfirm(record.id_ordem, record.titulo)}>Clonar Ordem</Menu.Item> }

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

    let listaOrdensPorFiltro = this.props.listaOrdensPorFiltro.map(elem => {
      let assinouText = 'N/A';
      if ((isDesignante(elem) || isDesignado(elem)) && elem.id_estado !== ESTADOS.RASCUNHO) {
        assinouText = elem.assinou ? "Sim" : "Não"
      }

      return {
        ...elem,
        assinouText: assinouText
      }
    })

    return  <SearchTable               
      columns = {columns}
      dataSource = {listaOrdensPorFiltro}
      size="small"
      ignoreAutoKey
      loading={this.state.fetching}
    />
  }

  onEditarOrdem = (id) => {
    history.push(`/ordemserv/editar-ordem/${id}`)
  }

  renderSelectOptions = () => {
    return(this.props.listaEstados.map((elem) => {
        return(<Option key= {elem.id} value = {elem.id}> {elem.estado}</Option>)
      })
    )
  }
  
  atualizaTabela = () =>{
    if (!this.state.filtroEstadoDaOrdem.length) {
      return;
    }

    const responseHandler = {
      successCallback: () => {this.setState({ fetching: false}) },
      errorCallback: (what) => {
        if(what){
          message.error(what)
        } else {
          message.error('Falha ao carregar as suas ordems de serviço.')
        }
        this.setState({ fetching: false}) 
      }
    }

    this.setState({ fetching: true}, () => {
      this.props.findByEstadoDaOrdem({filtroEstadoDaOrdem: this.state.filtroEstadoDaOrdem, responseHandler})
    })
  }  

  setFiltroEstadoDaOrdem = (valor) => {
    
    let {filtroEstadoDaOrdem} = this.state;
    let estadosSelec = valor;
    
    //passou uma opcao, mas o state ja continha a opcao Todas
    if (valor.length && filtroEstadoDaOrdem.length === 1 && filtroEstadoDaOrdem.includes(0)) {
      _.pull(estadosSelec, 0);
    }

    //se passou o todas, remove as demais opcoes
    //deixando apenas a opcao todas
    if (valor.includes(0)) {
      estadosSelec = [0]
    }

    this.setState({
      filtroEstadoDaOrdem: estadosSelec
    }, () =>{
      this.atualizaTabela()
    })
  }
  
  onConfirmDelete = (id, titulo) => {
    Modal.confirm({
      title: "Confirmar Exclusão",
      content: <span><strong>Título:</strong> {titulo}<br /><br/>Tem certeza que deseja remover esta O.S?</span>,
      okText: "Sim",
      cancelText: "Não",
      okType: 'danger',
      centered: true,
      width: 600,
      onOk: () => {
        this.props.deleteOrdem(id, {
          successCallback: () => { message.success("Ordem removida com sucesso!"); this.atualizaTabela()},
          errorCallback: (what) => message.error(what)
        })
      }
    })
  }

  onVisualizarOrdem = (idOrdem) => {
    this.setState({ modalVizVisible: true, modalVizKey: uuid(), idOrdemViz: idOrdem});
  }

  onVerHistorico = (idOrdem) => {
   this.setState({ modalHistVisible: true, modalHistKey: uuid(), idOrdemHist: idOrdem});
  }

  onAcompanharOrdem = (idOrdem) => {
    this.setState({ modalAcompVisible: true, modalAcompKey: uuid(), idOrdemAcomp: idOrdem});
  }

  onVerInsAlteradas = (idOrdem) => {
    this.setState({ modalInsNormVisible: true, modalInsNormKey: uuid(), idOrdemInsNorm: idOrdem});
  }

  onRemoverAutorizacaoConsultaConfirm = (id, titulo) => {
    Modal.confirm({
      title: "Confirmar a Remoção da Autorização de Consulta",
      content: <span><strong>Título:</strong> {titulo}<br /><br />Deseja realmente remover a autorização desta O.S?</span>,
      okText: "Sim",
      cancelText: "Não",
      okType: 'danger',
      width: 600,
      centered: true,
      onOk: () => this.onRemoverAutorizacaoConsulta(id)
    })
  }

  onRemoverAutorizacaoConsulta = (idOrdem) => {
    this.setState({fetching: true}, () => {
      this.props.removerAutorizacaoConsulta(idOrdem)
        .then( () => {
          message.success("Ordem removida com sucesso!")
          this.atualizaTabela()
        })
        .catch( error => {
          message.error(error)
        })
        .then(() => {
          this.setState({fetching: false})
        })
    })
  }

  onClonarOrdemConfirm = (id, titulo) => {
    Modal.confirm({
      title: "Confirmar Duplicação",
      content: <span><strong>Título:</strong> {titulo}<br /><br />Deseja realmente duplicar esta O.S?</span>,
      okText: "Sim",
      cancelText: "Não",
      okType: 'danger',
      width: 600,
      centered: true,
      onOk: () => this.onClonarOrdem(id)
    })
  }

  onClonarOrdem = (idOrdemBase) => {
    this.setState({fetching: true}, () => {
      this.props.clonarOrdemServico(idOrdemBase)
        .then( novaOrdem => {
          history.push(`/ordemserv/editar-ordem/${novaOrdem.id}`)
        })
        .catch( error => {
          message.error(error);
        })
        .then(() => {
          this.setState({fetching: false});
        })
    });
  }

  onVoltarParaRascunho = ({idOrdem, titulo}) => {
    Modal.confirm({
      title: "Confirmação",
      content: <span><strong>Título:</strong> {titulo}<br /><br/>Tem certeza que deseja voltar esta O.S para rascunho?</span>,
      okText: "Sim",
      cancelText: "Não",
      okType: 'primary',
      centered: true,
      width: 550,
      onOk: () => {
        this.setState({fetching: true}, () => {
          voltarOrdemRascunho(idOrdem)
          .then(() => {
            message.success("Ordem alterada com sucesso!")
            this.atualizaTabela()
          })
          .catch(error => {
            message.error(error)
          })
          .then(() => {
            this.setState({fetching: false});
          })  
        });
      }
    })
  }

  render() {
    return (
      <div>        
        <Row style={{marginBottom: '15px'}}>
          <Col span={24} style={{textAlign: 'right'}}>            
            <Select 
              onChange = {this.setFiltroEstadoDaOrdem} 
              value={this.state.filtroEstadoDaOrdem} 
              style={{ width: 420 }}
              mode="multiple"
              allowClear
            > 
              <Option key= {0} value = {0} >Todas as Ativas</Option>
              {this.renderSelectOptions()}
            </Select>

            <Button 
              icon={<RedoOutlined />} 
              style={{marginLeft: '15px'}}
              onClick = {this.atualizaTabela}
              loading={this.state.fetching}
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

        <ModalAcompOrdem 
          idOrdem={this.state.idOrdemAcomp}
          visible={this.state.modalAcompVisible} 
          modalKey={this.state.modalAcompKey} 
          closeModal={ () => this.setState({modalAcompVisible: false, idOrdemAcomp: null})}
        />

        <ModalInsNormAlteradas
          idOrdem={this.state.idOrdemInsNorm}
          visible={this.state.modalInsNormVisible} 
          modalKey={this.state.modalInsNormKey} 
          closeModal={ () => this.setState({modalInsNormVisible: false, idOrdemInsNorm: null})}
          atualizarPesquisa={this.atualizaTabela}
        />

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    listaOrdensPorFiltro: state.ordemserv.listaOrdensPorFiltro,
    listaEstados: state.ordemserv.listaEstados,
    historicoOrdem: state.ordemserv.listaHistoricoOrdem
  };
}

export default connect(mapStateToProps, {
  findByEstadoDaOrdem,
  findEstados,
  deleteOrdem,
  clonarOrdemServico,
  removerAutorizacaoConsulta
})(OrdensAtuais);