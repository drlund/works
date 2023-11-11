import React, { Component } from "react";
import { connect } from 'react-redux';
import history from "../../history";
import {
  Row,
  Col,
  Space,
  Button,
  Select,
  Modal,
  Divider,
  Badge,
  Progress,
  List,
  Collapse,
  Typography,
  Card,
  Table,
  DatePicker,
  Checkbox,
} from "antd";
import {
  fetchListaProjetos,
  fetchProjeto,
} from "services/ducks/Projetos.ducks";
import { constantes } from "./Helpers/Constantes";
import {
  filtrarAtividades,
  informacaoConclusao,
  percentualProgresso,
  atividadesToModal,
} from "./Helpers/AcompanhamentoUtils";
import { badgeColor } from "./Helpers/CommonsFunctions";
import { commonDateRanges } from "utils/DateUtils";
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';
import styles from "./projetos.module.css";
import moment from "moment";
import "moment/locale/pt-br";
import locale from "antd/es/date-picker/locale/pt_BR";

const { Panel } = Collapse;
const { Option } = Select;
const { RangePicker } = DatePicker;

class Acompanhamento extends Component {
  state = {
    perfilAcesso: [],
    acessoNegado: false,
    selectDefault: null,
    projetos: [],
    projetosFiltrados: [],
    responsaveisProjetos: [],
    idStatus: 0,
    atividadeConcluida: false,
    dtInicioRange: ["", ""],
    matriculaFiltro: null,
    status: [],
    exibirModal: false,
    atividades: [],
    tituloModal: null,
  };

  componentDidMount() {
    this.listaProjetos();
  }

  listaProjetos = async () => {
    const naoConcluidosTmp = fetchListaProjetos(true, constantes.statusNaoConcluidos);
    let concluidosTmp = [];
    const permissao = getPermissoesUsuario('Projetos', this.props.authState);
    if((permissao.includes("ACPTOTAL") || permissao.includes("ACPGERAD"))) {
      concluidosTmp = fetchListaProjetos(true, constantes.statusConcluido);
    }
    const projetoTmp = fetchProjeto(null);
    const [naoConcluidos, projeto, concluidos] = await Promise.all([naoConcluidosTmp, projetoTmp, concluidosTmp]);
    const lista = naoConcluidos.concat(concluidos);
    // const listaFiltrada = this.projetosFiltrados(lista, (permissao.includes("ACPTOTAL") || permissao.includes("ACPGERAD")));
    this.setState({
      perfilAcesso: permissao,
      projetos: lista,
      projetosFiltrados: lista,
      status: projeto.listaStatus,
      responsaveisProjetos: this.setResponsaveisProjetos(lista),
      // podem ser solicitados mais tarde
      // complexidades: projeto.listaComplexidades,
      // prioridades: projeto.listaPrioridades,
      // tipos: projeto.listaTipos,
    });
  };

  setResponsaveisProjetos = projetos => {
    const responsaveis = [];
    projetos.map(projeto => {
      return projeto.responsaveis.map(responsavel => responsaveis.push(responsavel));
    })
    // filtrar funcis da equipe de soluções digitais
    const responsaveisSolucaoDigital = responsaveis.filter(
      responsavel => responsavel.codUorTrabalho === constantes.uorSolucoesDigitais
    );
    // eliminando os repetidos
    const responsaveisUnicos = responsaveisSolucaoDigital.filter( (elemento, indice, todosElementos) => {
      return indice === todosElementos.findIndex( elementoTemp => {
        return elementoTemp.id === elemento.id
      })
    });
    // ordenar alfabeticamente
    const responsaveisUnicosOrdenados = responsaveisUnicos.sort(function(a,b) {
      if(a.nome < b.nome) return -1;
      if(a.nome > b.nome) return 1;
      return 0;
    });
    return responsaveisUnicosOrdenados;
  }

  projetosFiltrados = (lista, exibirConcluidos) => {
    if(exibirConcluidos) {
      return lista.abertos.concat(lista.concluidos)
    }
    return lista.abertos;
  }

  filtrarProjetos = (projetos, idStatus, dtInicioRange, atividadeConcluida, matriculaPesquisa) => {
    // se as regras forem cumulativas (condição1 && condição2)
    let filtrados = projetos;
    // filtro por status do projeto
    if (idStatus !== constantes.statusTodos) {
      filtrados = projetos.filter(projeto => projeto.idStatus === idStatus)
    }
    // filtro por datas
    if (dtInicioRange[0] !== "" && dtInicioRange[1] !== "") {
      filtrados = filtrarAtividades(filtrados, constantes.filtroByDataInicio, dtInicioRange)
    }
    // filtro por concluídas
    if(atividadeConcluida) {
      filtrados = filtrarAtividades(filtrados, constantes.filtroByConcluida, atividadeConcluida)
    }
    // filtro por matricula
    if (this.state.matriculaFiltro) {
      filtrados = filtrarAtividades(filtrados, constantes.filtroByMatricula, matriculaPesquisa)
    }
    
    this.setState({ projetosFiltrados: filtrados });
  };

  renderFiltros = () => {
    return (
      <Collapse
        bordered={false}
      >
        <Panel
          header={
            <Divider orientation='left'style={{ margin: 0 }}>
              <Typography.Text strong={true}>Filtros</Typography.Text>
            </Divider>
          }
          key={'filtros'}
        >
          <Row wrap={false} gutter={[10, 20]}>
            <Col flex='1 1 40%'>
              <Divider orientation='left'>Filtro de Projeto</Divider>
            </Col>
            <Col className={styles.labelFiltro}>Status do Projeto</Col>
            <Col className={styles.statusContent}>
              <Select
                defaultValue={constantes.statusTodos}
                style={{ display: "block", textAlign: "start" }}
                onChange={(value) => this.setState({ idStatus: value })}
              >
                <Option
                  value={constantes.statusTodos}
                  key={constantes.statusTodos}
                >
                  Todos
                </Option>
                {this.renderListaStatus()}
              </Select>
            </Col>
          </Row>

          { this.state.perfilAcesso.includes("ACPTOTAL") &&
            <Row wrap={false} gutter={[10, 0]}>
              <Col flex='1 1 30%'>
                <Divider orientation='left'>Filtro de Atividade</Divider>
              </Col>
              <Col className={styles.labelFiltro}>Responsável</Col>
              <Col flex='1 1 20%' style={{ margin: 'auto' }}>
                <Select
                  style={{ display: "block", textAlign: "start" }}
                  onChange={(value) => this.setState({ matriculaFiltro: value })}
                >
                  <Option value={null}>Nenhum</Option>
                  {this.renderListaResponsaveis()}
                </Select>
              </Col>
              <Col className={styles.labelFiltro}>Início da Atividade</Col>
              <Col className={styles.dateContent}>
                <RangePicker
                  locale={locale}
                  format={"DD/MM/YYYY"}
                  ranges={commonDateRanges}
                  onChange={(rangeMoment, rangeFormat) => {
                    this.setState({ dtInicioRange: rangeFormat });
                  }}
                />
              </Col>
              <Col className={styles.dateContent}>
                <Checkbox
                  onChange={(event) => {
                    this.setState({ atividadeConcluida: event.target.checked });
                  }}
                >
                  Atividade Concluída
                </Checkbox>
              </Col>
            </Row>
          }
          <Divider orientation="left">
            <Button
              type="primary"
              className={styles.bbBGAzul}
              onClick={() =>
                this.filtrarProjetos(
                  this.state.projetos,
                  this.state.idStatus,
                  this.state.dtInicioRange,
                  this.state.atividadeConcluida,
                  this.state.matriculaFiltro,
                )
              }
            >
              Aplicar Filtros
            </Button>
          </Divider>
        </Panel>
      </Collapse>
    )
  }

  renderModalAtividades = (acao, atividades = []) => {
    return this.setState({
      exibirModal: acao,
      atividades,
    });
  };

  renderConteudoModal = () => {
    const atividades = atividadesToModal(this.state.atividades);
    const colunas = [
      {
        title: "Andamento",
        key: "andamento",
        render: (text, record) => (
          <Progress
            type="circle"
            percent={record.percentual}
            format={() =>
              informacaoConclusao(
                record.percentual,
                record.idStatus,
                record.situacao,
              )
            }
            trailColor={badgeColor(record.idSituacao)}
            strokeColor={record.cor}
            width={40}
          />
        ),
        align:'center',
      },
      {
        title: "Titulo",
        dataIndex: "titulo",
        key: "titulo",
      },
      {
        title: "Início",
        dataIndex: "dtInicio",
        key: "dtInicio",
      },
      {
        title: "Prazo (dias)",
        dataIndex: "prazo",
        key: "prazo",
        render: (text, record) => text + record.prazoPausas,
      },
      {
        title: "Complexidade",
        dataIndex: "complexidade",
        key: "complexidade",
      },
      {
        title: "Situação",
        dataIndex: "situacao",
        key: "situacao",
      },
    ];
    return (
      <Table
        key={moment().valueOf()}
        dataSource={atividades}
        columns={colunas}
        size="small"
      />
    );
  };

  renderAndamento = (lista) => {
    if (lista.length) {
      return (
        <List
          dataSource={lista}
          pagination={{
            size: "small",
            total: lista.length,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} itens`,
          }}
          renderItem={(projeto) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Collapse expandIconPosition="end">
                    <Panel
                      showArrow={false}
                      extra={
                        <Typography.Text className={styles.bbAzul}>
                          Ver Andamento
                        </Typography.Text>
                      }
                      header={
                        <Typography.Text strong>
                          <Space>
                            <Badge
                              count={projeto.descricaoStatus}
                              style={{
                                backgroundColor: badgeColor(projeto.idStatus),
                              }}
                            />
                            {projeto.titulo}
                          </Space>
                        </Typography.Text>
                      }
                      key={projeto.id}
                    >
                      <Row gutter={[0, 20]}>
                        <Col style={{ fontSize: '1.2em', textAlign: 'center' }}>
                          Funcionalidades Solicitadas
                        </Col>
                      </Row>
                      <Row gutter={[10, 10]}>
                        {projeto.funcionalidades.map((funcionalidade) => {
                          let percentual = percentualProgresso(funcionalidade);
                          let statusInfo;
                          if (percentual === "100.00") {
                            statusInfo = "success";
                          } else if (funcionalidade.idStatus === 3) {
                            statusInfo = "exception";
                          } else {
                            statusInfo = "normal";
                          }
                          return (
                            <Col span={6} key={funcionalidade.id}>
                              <Card
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  height: "100%",
                                }}
                                headStyle={{
                                  display: "flex",
                                  justifyContent: "center",
                                  height: "100%",
                                }}
                                bodyStyle={{ padding: 15, maxWidth: "90%" }}
                                title={
                                  <p
                                    style={{
                                      whiteSpace: "normal",
                                      textAlign: "center",
                                    }}
                                  >
                                    {funcionalidade.titulo}
                                  </p>
                                }
                                actions={[
                                  <Button
                                    shape='round'
                                    size='small'
                                    type="primary"
                                    onClick={() =>
                                      this.setState(
                                        {
                                          tituloModal: `Atividade(s) da Funcionalidade: ${funcionalidade.titulo}`,
                                        },
                                        this.renderModalAtividades(
                                          true,
                                          funcionalidade.atividades
                                        )
                                      )
                                    }
                                  >
                                    Atividades
                                  </Button>,
                                ]}
                              >
                                <Progress
                                  strokeWidth={12}
                                  trailColor={badgeColor(funcionalidade.idStatus)}
                                  status={statusInfo}
                                  percent={percentual}
                                  format={(percent) =>
                                    informacaoConclusao(
                                      percent,
                                      funcionalidade.idStatus,
                                      null,
                                    )
                                  }
                                  style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    textAlign: "center",
                                    height: "100%",
                                  }}
                                />
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </Panel>
                  </Collapse>
                }
              />
            </List.Item>
          )}
        />
      );
    }
  };

  renderListaStatus = () => {
    if (this.state.status.length) {
      return this.state.status.map((estado) => {
        return (
          <Option value={estado.id} key={estado.id}>
            {estado.descricao}
          </Option>
        );
      });
    }
  };

  renderListaResponsaveis = () => {
    if(this.state.responsaveisProjetos.length) {
      return this.state.responsaveisProjetos.map( responsavel => {
        return (
          <Option value={responsavel.matricula} key={responsavel.matricula}>
            {responsavel.nome}
          </Option>
        )
      })
    }
  }

  render() {
    return (
      <>
        <Row wrap={false}>
          <Col className={styles.containerBotoesAcao}>
            <Space>
              <Button
                type="primary"
                className={styles.bbBGAzul}
                onClick={() => history.push("/projetos/lista-projetos")}
              >
                Página Inicial
              </Button>
            </Space>
          </Col>
        </Row>
        { (this.state.perfilAcesso.includes("ACPGERAD") || this.state.perfilAcesso.includes("ACPTOTAL")) &&
          this.renderFiltros()
        }
        <Divider>Lista de Projetos</Divider>
        {this.renderAndamento(this.state.projetosFiltrados)}
        <Modal
          title={this.state.tituloModal}
          visible={this.state.exibirModal}
          onCancel={() => this.renderModalAtividades(false)}
          destroyOnClose
          footer={
            <Button onClick={() => this.renderModalAtividades(false)}>
              OK
            </Button>
          }
          width="70%"
        >
          {this.renderConteudoModal()}
        </Modal>
      </>
    );
  }
}

// export default Acompanhamento;
const mapStateToProps = state => {
  return {
    authState: state.app.authState
  }
}

export default connect(
  mapStateToProps, null
)(Acompanhamento)