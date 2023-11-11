import React, { Component } from "react";
import {
  DeleteOutlined,
  LoadingOutlined,
  QuestionCircleOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import {
  Table,
  Divider,
  Skeleton,
  Tooltip,
  Popconfirm,
  Spin,
  Button,
  Row,
  Col,
  Avatar,
  message
} from "antd";
import { connect } from "react-redux";
import { fetchFunci } from "services/ducks/Arh.ducks";

import MaskedInput from "react-text-mask";
import AlfaSort from "utils/AlfaSort";

import StyledCard from "components/styledcard/StyledCard";
import { DefaultGutter } from "utils/Commons";
import _ from "lodash";

const MSG_NENHUMA_MATRICULA = "Envolvidos não identificados";

class ListaMatriculas extends Component {
  static propName = "colaboradores";

  constructor(props) {
    super(props);
    this.state = {
      nenhumaMatricula: false,
      matriculaIncluindo: "",
      loading: false,
      listaDadosFunci: [],
      listaMatriculas: []
    };
  }

  componentDidMount = async () => {
    if (this.props.value) {
      const matriculas = this.props.value.split(",");
      if (matriculas[0] === MSG_NENHUMA_MATRICULA) {
        this.setState({ nenhumaMatricula: true });
      } else {
        for (let matricula of matriculas) {
          await this.onAddColaborador(matricula);
        }
      }
    }
  };

  /**
   * Metodo auxiliar que verifica se um determinado colaborador ja esta
   * incluido na lista da demanda atual.
   */
  isColaboradorInList = matriculaColaborador => {
    return _.find(this.props.colaboradores, colaborador => {
      return colaborador.key === matriculaColaborador;
    });
  };

  onAddColaborador = async matriculaColaborador => {
    if (this.state.listaMatriculas.includes(matriculaColaborador)) {
      message.error("Funcionário já incluído");
      return;
    }

    if (
      matriculaColaborador.length !== 8 ||
      matriculaColaborador.search("_") > 0
    ) {
      message.error("Matrícula com formato errado");
      return;
    }

    this.setState({ loading: true }, async () => {
      await this.props
        .fetchFunci(matriculaColaborador)
        .then(dadosFunci => {
          const newListaFuncis = [...this.state.listaDadosFunci, dadosFunci];
          this.props.updateFunc(newListaFuncis);
          this.setState({
            loading: false,
            listaDadosFunci: newListaFuncis,
            listaMatriculas: [
              ...this.state.listaMatriculas,
              matriculaColaborador
            ],
            matriculaIncluindo: ""
          });
        })
        .catch(error => {
          message.error("Matrícula não encontrada");
          this.setState({ loading: false, matriculaIncluindo: "" });
        });

      return;
    });
  };

  onRemoveColaborador = matriculaColaborador => {
    let newListaDados = _.filter(this.state.listaDadosFunci, element => {
      return element.matricula !== matriculaColaborador;
    });

    let newListaMatriculas = _.filter(this.state.listaDadosFunci, element => {
      return element !== matriculaColaborador;
    });

    this.setState(
      {
        listaDadosFunci: newListaDados,
        listaMatriculas: newListaMatriculas
      },
      () => {
        this.props.updateFunc(newListaDados);
      }
    );
  };

  botaoNenhumaMatricula = () => {
    const onClickFunc = () => {
      this.setState(
        (state, props) => ({
          nenhumaMatricula: !state.nenhumaMatricula
        }),
        () => {
          const newListaMatriculas = this.state.nenhumaMatricula
            ? [MSG_NENHUMA_MATRICULA]
            : [];
          this.props.updateFunc(newListaMatriculas);
          this.setState({
            listaDadosFunci: [],
            listaMatriculas: newListaMatriculas,
            matriculaIncluindo: ""
          });
        }
      );
    };

    return this.state.nenhumaMatricula ? (
      <Button type="primary" onClick={onClickFunc}>
        Incluir Envolvidos
      </Button>
    ) : (
      <Popconfirm
        title="Esta ação irá limpar a lista dos já incluídos."
        onConfirm={onClickFunc}
        icon={<QuestionCircleOutlined style={{ color: "red" }} />}
      >
        <Button type="primary">Não há funcionários envolvidos</Button>
      </Popconfirm>
    );
  };

  render() {
    const columns = [
      {
        title: "Funcionario",
        key: "matricula",
        width: "50%",
        sorter: (a, b) => AlfaSort(a.nome, b.nome),
        render: (record, text) => {
          return (
            <span>
              {" "}
              <Avatar src={record.img} /> <Divider type="vertical" />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={
                  "https://humanograma.intranet.bb.com.br/" + record.matricula
                }
              >
                {record.matricula} - {record.nome}
              </a>{" "}
            </span>
          );
        }
      },
      {
        width: "15%",
        title: "Cargo",
        dataIndex: "cargo",
        sorter: (a, b) => AlfaSort(a.cargo, b.cargo),
        key: "cargo"
      },
      {
        width: "15%",
        title: "Prefixo",
        sorter: (a, b) => AlfaSort(a.prefixo, b.prefixo),
        render: (record, text) => {
          return (
            <span>
              {record.prefixo} - {record.nome_prefixo}
            </span>
          );
        }
      }
    ];

    if (!this.props.disabled) {
      columns.push({
        key: "key",
        title: "Ações",
        width: "10%",
        align: "center",
        render: (text, record) => {
          if (this.props.disabled) {
            return;
          }
          return (
            <span>
              <Tooltip title="Remover funcionário" placement="bottom">
                <Popconfirm
                  title="Deseja excluir o funcionário?"
                  onConfirm={() => this.onRemoveColaborador(record.key)}
                >
                  <DeleteOutlined className="link-color" />
                </Popconfirm>
              </Tooltip>
            </span>
          );
        }
      });
    }

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
      <Spin indicator={antIcon} spinning={this.state.loading}>
        <StyledCard
          title={
            this.props.disabled
              ? "Matrículas incluídas"
              : "Incluir envolvido(as)"
          }
          extra={!this.props.disabled && this.botaoNenhumaMatricula()}
        >
          {!this.props.disabled && !this.state.nenhumaMatricula && (
            <React.Fragment>
              <Form layout="horizontal">
                <Row gutter={DefaultGutter}>
                  <Col span={5}>
                    <MaskedInput
                      className="ant-input"
                      value={this.state.matriculaIncluindo}
                      mask={["F", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                      placeholder="F0000000"
                      onChange={event =>
                        this.setState({
                          matriculaIncluindo: event.target.value
                        })
                      }
                    />
                  </Col>
                  <Col span={1}>
                    <Button
                      onClick={() =>
                        this.onAddColaborador(this.state.matriculaIncluindo)
                      }
                      type="primary"
                      shape="circle"
                      icon={<PlusOutlined />}
                    ></Button>
                  </Col>
                </Row>
              </Form>
              <Divider />
            </React.Fragment>
          )}

          <Row>
            <Col span={24}>
              <Skeleton
                loading={this.state.searching}
                active
                title={false}
                avatar
                paragraph={{ rows: 6 }}
              >
                {!this.state.nenhumaMatricula ? (
                  <Table
                    columns={columns}
                    dataSource={this.state.listaDadosFunci}
                    size="small"
                    showHeader={
                      this.state.listaDadosFunci.length ? true : false
                    }
                  />
                ) : (
                  <p>confirma que não há funcionário(s) responsável(is) pela ocorrência?</p>
                )}
              </Skeleton>
            </Col>
          </Row>
        </StyledCard>
      </Spin>
    );
  }
}

export default connect(null, {
  fetchFunci
})(ListaMatriculas);
