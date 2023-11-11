import React, { Component } from "react";
import history from '../../history';
import {
  Row,
  Col,
  Button,
  message,
  Tooltip,
  Space,
  Tabs,
  Skeleton
} from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import {
  fetchListaProjetos,
  excluirProjeto,
} from "services/ducks/Projetos.ducks";
import PageLoading from "components/pageloading/PageLoading";
import { confirmarExclusao } from "./Helpers/CommonsFunctions";
import { constantes } from "./Helpers/Constantes";
import styles from "./projetos.module.css";
import SearchTable from "components/searchtable/SearchTable";
import AlfaSort from "utils/AlfaSort";

const { TabPane } = Tabs;
const iconVisualizar = <EyeOutlined className={styles.bbAzul} />
const iconEditar = <EditOutlined className={styles.bbAzul} />
const iconDeletar = <DeleteOutlined className={styles.vermelho} />

class ProjetoLista extends Component {
  state = {
    pageLoading: true,
    tabAtiva: constantes.statusNaoConcluidos,
    listaProjetosAbertos: [],
    listaProjetosConcluidos: [],
  };

  componentDidMount() {
    this.listaProjetos(constantes.statusNaoConcluidos);
  }

  listaProjetos = async statusProjetos => {
    try {
      const lista = await fetchListaProjetos(false, statusProjetos);
      if(statusProjetos !== constantes.statusConcluido) {
        this.setState({ pageLoading: false, tabAtiva: statusProjetos, listaProjetosAbertos: lista });
      } else {
        this.setState({ pageLoading: false, tabAtiva: statusProjetos, listaProjetosConcluidos: lista });
      }
    } catch (error) {
      message.error(error);
    }
  };
  
  onChangeTab = activeKey => {
    this.listaProjetos(parseInt(activeKey))
  };

  //Table Columns
  columns = [
    {
      dataIndex: "titulo",
      title: "Título",
      sorter: (a, b) => AlfaSort(a.titulo, b.titulo),
    },
    {
      dataIndex: "responsavel",
      title: "Criador",
      sorter: (a, b) => AlfaSort(a.responsavel, b.responsavel),
    },
    {
      dataIndex: "dtAtualizacao",
      title: "Data Pedido",
      sorter: (a, b) => AlfaSort(a.dtAtualizacao, b.dtAtualizacao),
    },
    {
      dataIndex: "descricaoStatus",
      title: "Status",
      sorter: (a, b) => AlfaSort(a.descricaoStatus, b.descricaoStatus),
    },
    {
      width: "10%",
      title: "Ações",
      align: "center",
      render: (record) => (
        <Space>
          <Tooltip title="Visualizar">
            <Button
              type="text"
              icon={iconVisualizar}
              onClick={() => this.visualizarProjeto(record.id)}
            />
          </Tooltip>
          <Tooltip title="Esclarecimentos / Observações">
            <Button
              type="text"
              icon={<ExclamationCircleOutlined />}
              onClick={() => this.incluirPedidoEsclarecimento(record.id)}
            />
          </Tooltip>
          {record.idStatus === 1 && (
            <>
              <Tooltip title="Editar">
                <Button
                  type="text"
                  icon={iconEditar}
                  onClick={()=> this.editarProjeto(record.id)}
                />
              </Tooltip>
              <Tooltip title="Remover">
                <Button
                  type="text"
                  onClick={() => confirmarExclusao(
                    record.id,
                    this.excluirProjeto,
                    'Tem certeza que deseja excluir permanentemente o Projeto?'
                  )}
                  icon={iconDeletar}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  excluirProjeto = async (idProjeto) => {
    try {
      const solicitacaoExcluida = await excluirProjeto(idProjeto);
      if (solicitacaoExcluida === "Projeto removido com sucesso.") {
        this.listaProjetos(constantes.statusNaoConcluidos);
      }
      message.success("O projeto foi removido com sucesso.")
    } catch (error) {
      message.error("Falha ao remover o projeto.")
    }
  };
  
  visualizarProjeto = idPedido => {
    history.push(`/projetos/visualizar-projeto/${idPedido}`);
  }

  incluirPedidoEsclarecimento = idPedido => {
    history.push(`/projetos/esclarecimento-projeto/${idPedido}`);
  }

  editarProjeto = idPedido => {
    history.push(`/projetos/editar-projeto/${idPedido}`);
  }

  novoProjeto = () => {
    history.push("/projetos/incluir-projeto/")
  }

  render() {
    return (
      <>
      <Row wrap={false} gutter={[0, 20]}>
        <Col className={styles.containerBotoesAcao}>
          <Space>
          <Tooltip title="Atualizar Lista">
            <Button
              type='primary'
              icon={<ReloadOutlined />}
              className={styles.bbBGAzul}
              onClick={() => 
                this.listaProjetos(this.state.tabAtiva)
              }
            />
          </Tooltip>
            <Button
              type='primary'
              className={styles.bbBGAzul}
              onClick={() => this.novoProjeto()}
            >
              Novo Projeto
            </Button>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col>
          {constantes.TEXTO_LISTA_PROJETOS}
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs 
            type="card"
            onChange={this.onChangeTab}
          >
            <TabPane tab="Abertos" key={constantes.statusNaoConcluidos}>
              <SearchTable
                columns={this.columns}
                dataSource={this.state.listaProjetosAbertos}
                locale={{
                  emptyText: !this.state.listaProjetosConcluidos.length && <><Skeleton active /><Skeleton active /><Skeleton active /></>
                }}
                loading={ !this.state.listaProjetosAbertos.length ? { spinning: true, indicator: <PageLoading /> } : false }
              />
            </TabPane>
            <TabPane tab="Concluídos" key={constantes.statusConcluido}>
              <SearchTable
                columns={this.columns}
                dataSource={this.state.listaProjetosConcluidos}
                locale={{
                  emptyText: !this.state.listaProjetosConcluidos.length && <><Skeleton active /><Skeleton active /><Skeleton active /></>
                }}
                loading={ !this.state.listaProjetosConcluidos.length ? { spinning: true, indicator: <PageLoading /> } : false }
              />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      </>
    );
  }
}

export default ProjetoLista;
