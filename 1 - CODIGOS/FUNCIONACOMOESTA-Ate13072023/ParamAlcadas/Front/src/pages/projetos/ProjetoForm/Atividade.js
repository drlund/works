import React, { Component } from "react";
import uuid from "uuid/v4";
import {
  Form,
  Row,
  Col,
  Space,
  Button,
  Input,
  Select,
  Divider,
  Typography,
  List,
  Collapse,
  Tooltip,
  Affix,
  Modal,
  Avatar,
  message,
  Badge,
} from "antd";
import {
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { validarInput, modalInfo, confirmarExclusao, badgeColor } from "../Helpers/CommonsFunctions";
import { constantes } from "../Helpers/Constantes";
import styles from "../projetos.module.css";
import moment from "moment";
import _ from "lodash";
import ModalPausarAtividade from "../Components/ModalPausarAtividade";

const { Panel } = Collapse;
const { Option } = Select;

class Atividade extends Component {
  state = {
    id: null,
    idFuncionalidade: constantes.statusTodos,
    listaAtividades: [],
    totalAtividades: 0,
    idFuncionalidadeModal: null,
    idComplexidade: null,
    idPrioridade: null,
    idStatus: null,
    status: null,
    idTipo: null,
    titulo: null,
    tituloCheck: null,
    descricao: null,
    descricaoCheck: null,
    dtInicio: null,
    prazo: null,
    prazoCheck: null,
    dtConclusao: null,
    ativo: null,

    exibirModal: false,
    exibirModalPausa: false,
    exibirListaResponsaveis: false,
    soLeitura: false,
  };

  setDefaultValues = () => {
    this.setState({
      id: null,
      idFuncionalidadeModal: null,
      idComplexidade: null,
      idPrioridade: null,
      idStatus: null,
      status: null,
      idTipo: null,
      titulo: null,
      tituloCheck: null,
      descricao: null,
      descricaoCheck: null,
      dtInicio: null,
      prazo: null,
      prazoCheck: null,
      dtConclusao: null,
      ativo: null,
      listaResponsaveis: [],

      exibirModal: false,
      exibirModalPausa: false,
      exibirListaResponsaveis: false,
      soLeitura: false,
    })
  }

  componentDidMount() {
    this.renderListaAtividades(this.state.idFuncionalidade);
  }

  gravarAtividade = () => {
    if (this.state.soLeitura) return this.setDefaultValues();

    if (!this.checkGravarAtividade()) return;

    if (!this.state.id) {
      this.incluirAtividade()
    } else {
      this.editarAtividade(this.state.id)
    }
    const idFuncionalidade = this.state.idFuncionalidade
    this.setDefaultValues();

    this.setState(
      { exibirModal: false },
      () => this.renderListaAtividades(idFuncionalidade)
    );
  };

  renderDropDown = (conteudo) => {
    let frase;
    switch (conteudo) {
      case "projetos":
        frase = "Nenhum responsável foi encontrado.";
        break;
      case "funcionalidades":
        frase = "Nenhuma funcionalidade foi encontrada.";
        break;
      case "atividades":
        frase = "Nenhuma atividade foi encontrada.";
        break;
      default:
        frase = "Erro ao preencher a lista";
        break;
    }
    if (this.props[conteudo].length) {
      return this.props[conteudo].map((item) => {
        return (
          <Option value={item.id} key={item.id}>
            {item.titulo}
          </Option>
        );
      });
    } else {
      return (
        <Option value={0} disabled={true}>
          <Typography.Paragraph>{frase}</Typography.Paragraph>
        </Option>
      );
    }
  };

  onSelected = (valor, nome) => {
    this.setState({ [nome]: valor });
  };

  exibirModal = (valor) => {
    if (!valor) {
      this.setDefaultValues();
    }

    this.setState({ exibirModal: valor });
  };

  exibirModalPausa = (valor) => {
    this.setState({ exibirModalPausa: valor })
  }

  checkGravarAtividade = () => {
    const todosItems = [];
    if (!this.state.idFuncionalidadeModal) todosItems.push('Nenhuma funcionalidade foi indicada!');
    if (!this.state.idPrioridade) todosItems.push('Você precisa indicar qual a prioridade desta Atividade!');
    if (!this.state.idStatus) todosItems.push('Você precisa indicar qual o status desta Atividade!');
    if (!this.state.idTipo) todosItems.push('Você precisa indicar qual o tipo desta Atividade!');
    if (!this.state.titulo) todosItems.push('Você precisa incluir um título!');
    if (!this.state.descricao) todosItems.push('Você precisa descrever a Atividade!');
    if (this.state.prazo === null || this.state.prazo === '')
      todosItems.push('Você precisa indicar um prazo (em dias) para a conclusão desta Atividade!');

    if(todosItems.length) {
      message.error(
        ['Verifique os seguintes itens:', <Typography.Paragraph />].concat(
        todosItems.map(mensagem => {
          return <Typography.Paragraph>
            {mensagem}
          </Typography.Paragraph>
          })),
        5
      );
      return false;
    }

    return true;
  }

  renderListaAtividades = idFuncionalidade => {
    if (idFuncionalidade === constantes.statusTodos) {
      this.setState({
        listaAtividades: this.props.atividades,
        totalAtividades: this.props.atividades.length,
        idFuncionalidade,
      })
      return;
    }
    this.setState({
      listaAtividades: this.props.atividades.filter(atividade => atividade.idFuncionalidade === idFuncionalidade),
      totalAtividades: this.props.atividades.filter(atividade => atividade.idFuncionalidade === idFuncionalidade).length,
      idFuncionalidade,
    })
  }

  incluirAtividade = () => {
    const novaAtividade = {
      id: uuid(),
      idFuncionalidade: this.state.idFuncionalidadeModal,
      idComplexidade: this.state.idComplexidade,
      idPrioridade: this.state.idPrioridade,
      idStatus: this.state.dtConclusao ? constantes.statusConcluido : this.state.idStatus,
      idTipo: this.state.idTipo,
      titulo: this.state.titulo,
      descricao: this.state.descricao,
      dtInicio: this.state.dtInicio,
      prazo: parseInt(this.state.prazo),
      prazoRestante: parseInt(this.state.prazo),
      dtConclusao: this.state.dtConclusao,
      responsavel: this.state.listaResponsaveis,
      situacao: 'Pendente de inclusão',
      status: this.state.dtConclusao ?
        this.props.status.find( estado => estado.id === constantes.statusConcluido).descricao :
        this.props.status.find( estado => estado.id === this.state.idStatus).descricao,
      ativo: 'true',
      pausa: [],
      esclarecimento: [],
      prazoPausas: 0,
    }

    this.props.onUpdateState(
      'atividades',
      [ ...this.props.atividades, novaAtividade ]
    );

    if(novaAtividade.idStatus !== constantes.statusNaoIniciado) {
      this.props.onUpdateState(
        'informacaoBasica',
        {...this.props.informacaoBasica,
        'idStatus': constantes.statusEmAndamento}
      )
    }
  }

  onEditarAtividade = item => {
    let valorSoLeitura = item.dtConclusao ? true : false
    this.setState({
      id: item.id,
      idFuncionalidadeModal: item.idFuncionalidade,
      idComplexidade: item.idComplexidade,
      idPrioridade: item.idPrioridade,
      idStatus: this.state.dtConclusao ? constantes.statusConcluido : item.idStatus,
      idTipo: item.idTipo,
      titulo: item.titulo,
      descricao: item.descricao,
      dtInicio: item.dtInicio,
      prazo: item.prazo,
      dtConclusao: item.dtConclusao,
      ativo: item.ativo,
      pausa: item.pausa,
      listaResponsaveis: item.responsavel,
      exibirModal: true,
      soLeitura: valorSoLeitura,
    })
  }

  editarAtividade = async id => {
    const atualizarAtividades = this.props.atividades.map(atividade => {
      if (atividade.id === id) {
        atividade.idFuncionalidade = this.state.idFuncionalidadeModal;
        atividade.responsavel = this.state.listaResponsaveis;
        atividade.titulo = this.state.titulo;
        atividade.descricao = this.state.descricao;
        atividade.prazo = this.state.prazo;
        atividade.dtInicio = this.state.dtInicio;
        atividade.dtConclusao = this.state.dtConclusao;
        atividade.idComplexidade = this.state.idComplexidade;
        atividade.idPrioridade = this.state.idPrioridade;
        atividade.idStatus = this.state.dtConclusao ? constantes.statusConcluido : this.state.idStatus;
        atividade.idTipo = this.state.idTipo;
        atividade.pausa = this.state.pausa;
        atividade.status = this.state.status;
        atividade.ativo = this.state.ativo;
      }
      return atividade;
    })
    await this.props.onUpdateState('atividades', atualizarAtividades)
  }

  excluirAtividade = id => {
    const excluirAtividades = this.props.atividades.filter(atividade => {
      return atividade.id !== id
    })
    this.props.onUpdateState('atividades', excluirAtividades)
  }

  incluirPausa = pausa => {
    const atualizarAtividades = this.props.atividades.map(atividade => {
      if (atividade.id === this.state.id) {
        atividade.pausa = [...atividade.pausa, pausa];
      }
      return atividade;
    })

    this.props.onUpdateState('atividades', atualizarAtividades);
    this.setDefaultValues();
  }

  renderResponsaveisAtividade = item => {
    const responsaveisAtividade = this.props.responsaveis.filter(responsavel => {
      return item.responsavel.includes(responsavel.id)
    })

    return responsaveisAtividade.map( (responsavel, index) => {
      return (
        responsavel.nome +
        (responsaveisAtividade.length - 1 ===
        index
          ? ""
          : ", ")
      );
    })
  }

  renderPausasAtividade = item => {
    return item.pausa.map( (pausa, index) => {
      return (
        <div key={pausa.id} style={{display: 'inline-flex', alignItems: 'center'}}>
        <Button
          type='text'
          className={styles.bbAzul}
          icon={<EyeOutlined />}
          onClick={ ()=> modalInfo(`${pausa.titulo} - ${pausa.prazo} dia(s)`, pausa.descricao) }
        />
        {pausa.titulo +
        (item.pausa.length - 1 === index
          ? ""
          : ", "
        )}
        </div>
      );
    })
  }

  renderEsclarecimentosAtividade = item => {
      return item.esclarecimento.map( (esclarecimento, index) => {
        return (
          <div key={esclarecimento.id} style={{display: 'inline-flex', alignItems: 'center'}}>
          <Button
            type='text'
            className={styles.bbAzul}
            icon={<EyeOutlined />}
            onClick={ ()=> modalInfo(`Pedido de esclarecimento em ${esclarecimento.dtCriacao} - ${esclarecimento.diasParaResposta} dia(s)`, esclarecimento.pedido) }
          />
          {`Pedido de esclarecimento em ${esclarecimento.dtCriacao}` +
          (item.esclarecimento.length - 1 === index
            ? ""
            : ", "
          )}
          </div>
        );
      })
  }

  renderDropDownResponsaveis = () => {
    if (this.props.responsaveis.length) {
      return this.props.responsaveis.map((item) => {
        return (
          <Option value={item.id} key={item.id}>
            <Space>
              <Avatar
                size={17.6}
                src={`https://humanograma.intranet.bb.com.br/avatar/${item.matricula}`}
              />
              {item.nome}
            </Space>
          </Option>
        );
      });
    } else {
      return (
        <Option value={0} disabled={true}>
          <Typography.Paragraph>Nenhum responsável cadastrado ainda.</Typography.Paragraph>
        </Option>
      );
    }
  };

  onResponsavelSelect = (valor) => {
    this.setState({ listaResponsaveis: valor });
  }

  renderListasClassificacao = nomeLista => {
    const nomeIdState = nomeLista === 'status' ? 'idStatus' : 'id'+_.upperFirst(nomeLista.substr(0, nomeLista.length-1));
    return (
      <Select
        disabled={this.state.soLeitura || (this.state.dtConclusao && nomeLista === 'status' ? true : false)}
        value={this.state[nomeIdState]}
        onChange={(valor) => this.onSelected(valor, nomeIdState)}
      >
        {this.props[nomeLista].map(item => {
          return (
            <Option value={item.id} key={item.id}>
              {item.descricao}
            </Option>
          )
        })}
      </Select>
    )
  }

  renderListaAcoes = item => {
    const acoes = [];
    if ( item.dtInicio && !item.dtConclusao ) {
      acoes.push(
        <Tooltip title='Adicionar Pausa'>
          <Button
            type='text'
            className={styles.bbAzul}
            onClick={ () => {
              this.setState({ exibirModalPausa: true, id: item.id })
            }}
            icon={<FieldTimeOutlined />}
          />
        </Tooltip>
      )
    }
    acoes.push(
      <Tooltip title={item.dtConclusao ? 'Visualizar' : 'Editar'}>
        <Button
          type="text"
          className={styles.bbAzul}
          onClick={() =>
            this.onEditarAtividade(item)
          }
          icon={item.dtConclusao ? <EyeOutlined /> : <EditOutlined />}
        />
      </Tooltip>,
      <Tooltip title='Excluir'>
        <Button
          type="text"
          className={styles.vermelho}
          onClick={() => confirmarExclusao(
            item.id,
            this.excluirAtividade,
            'Tem certeza que deseja excluir esta Atividade?'
          )}
          icon={<DeleteOutlined />}
        />
      </Tooltip>,
    )
    return acoes;
  }

  renderDatas = valorData => {
    if (!valorData) return;

    if (!valorData.includes('/')) {
      valorData = moment(valorData).format('DD/MM/YYYY HH:mm')
    }

    return valorData
  }

  renderSituacao = (situacao, prazoRestante) => {
    if(prazoRestante === '') {
      return
    } else if(prazoRestante < 0) {
      return <Space>
        <Badge
        count={situacao}
        style={{
          backgroundColor: badgeColor(-1),
        }}
        />
        {`Passou(aram): ${Math.abs(prazoRestante)} dia(s)`}
      </Space>
    } else {
      return `Resta(m): ${prazoRestante} dia(s)`
    }
  }

  render() {
    return (
      <>
        <Form.Item
          style={{ justifyContent: "flex-end", maxWidth: "90%" }}
          {...constantes.layoutForm}
          label={
            <Space>
              {constantes.LABEL_FUNCIONALIDADE_ATIVIDADE}
              <Tooltip title={constantes.INFO_FUNCIONALIDADE_ATIVIDADE}><InfoCircleOutlined /></Tooltip>
            </Space>
          }
          hasFeedback
        >
          <Select
            defaultValue={constantes.statusTodos}
            onChange={(valor) => this.renderListaAtividades(valor)}
          >
            {/* <Option value={null} key={"nulo"}>
              Nenhuma Funcionalidade
            </Option> */}
            <Option value={constantes.statusTodos} key={"tudo"}>
              Todas as Funcionalidades
            </Option>
            {this.renderDropDown("funcionalidades")}
          </Select>
        </Form.Item>
        <Form.Item>
          <Divider>Atividades Cadastradas</Divider>
          <List
            dataSource={ this.state.listaAtividades }
            pagination={{
              size: "small",
              total: this.state.totalAtividades,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} itens`,
            }}
            renderItem={(item) => (
              <List.Item
              actions={ this.renderListaAcoes(item) }
              >
                <List.Item.Meta
                  title={
                    <Collapse expandIconPosition="end">
                      <Panel
                        showArrow={false}
                        extra={
                          <Typography.Text className={styles.bbAzul}>
                            Detalhes
                          </Typography.Text>
                        }
                        header={
                          <Space>
                          <Badge
                            count={item.status}
                            style={{
                              backgroundColor: badgeColor(item.idStatus),
                            }}
                          />
                          {this.renderSituacao(item.situacao, item.prazoRestante)}
                          <Typography.Text strong>
                            Título:
                          </Typography.Text>{item.titulo}
                          {!JSON.parse(item.ativo) &&
                            <Typography.Text type='danger' strong>Marcado para exclusão</Typography.Text>
                          }
                          </Space>
                        }
                        key={item.id}
                      >
                        <Typography.Paragraph>
                          <Space>
                            <Typography.Text strong>Prazos (em dias):</Typography.Text>
                            <Typography.Text>Total={item.prazo+item.prazoPausas}</Typography.Text>
                            <Typography.Text>Original={item.prazo}</Typography.Text>
                            <Typography.Text>Pausas={item.prazoPausas}</Typography.Text>
                          </Space>
                        </Typography.Paragraph>
                        <Typography.Text strong>Descrição</Typography.Text>
                        <Typography.Paragraph>
                          {item.descricao}
                        </Typography.Paragraph>
                        <Typography.Text strong>Responsáveis</Typography.Text>
                        <Typography.Paragraph>
                          {this.renderResponsaveisAtividade(item)}
                        </Typography.Paragraph>
                        { (item.pausa.length > 0 || item.esclarecimento.length > 0) &&
                        <Typography.Text strong>
                          Pausas no Desenvolvimento
                          <Typography.Paragraph>
                            {this.renderPausasAtividade(item)}
                            {this.renderEsclarecimentosAtividade(item)}
                          </Typography.Paragraph>
                        </Typography.Text>
                        }
                      </Panel>
                    </Collapse>
                  }
                />
              </List.Item>
            )}
          />
          <Affix style={{ position: "absolute", top: 13, right: 0 }}>
            <Tooltip title={constantes.BTN_FUNCIONALIDADE_INCLUSAO}>
              <Button
                type="primary"
                className={styles.bbBGAzul}
                onClick={() => this.exibirModal(true)}
              >
                Adicionar
              </Button>
            </Tooltip>
          </Affix>
        </Form.Item>
        <Modal
          title={"Nova Atividade"}
          visible={this.state.exibirModal}
          onOk={this.gravarAtividade}
          okText={ this.state.soLeitura ? "Fechar" : this.state.id ? "Alterar" : "Incluir" }
          okButtonProps={{ className: styles.bbBGAzul }}
          onCancel={() => this.exibirModal(false)}
          cancelText="Cancelar"
          cancelButtonProps={{ type: "danger" }}
          width='85%'
        >
          <Form.Item
            style={{ justifyContent: "flex-end", maxWidth: "90%" }}
            {...constantes.layoutForm}
            label={
              <Space>
                {constantes.LABEL_FUNCIONALIDADE_ATIVIDADE_MODAL}
                <Tooltip title={constantes.INFO_FUNCIONALIDADE_ATIVIDADE_MODAL}><InfoCircleOutlined /></Tooltip>
              </Space>
            }
            hasFeedback
          >
            <Select
              disabled={this.state.soLeitura}
              value={
                this.state.idFuncionalidade === this.state.idFuncionalidadeModal
                  ? this.state.idFuncionalidade
                  : this.state.idFuncionalidadeModal
              }
              onChange={(valor) =>
                this.setState({ idFuncionalidadeModal: valor })
              }
            >
              <Option value={null} key={"nulo"}>
                Nenhum item selecionado
              </Option>
              {this.renderDropDown("funcionalidades")}
            </Select>
          </Form.Item>
          <Form.Item
            style={{ justifyContent: "flex-end", maxWidth: "90%" }}
            {...constantes.layoutForm}
            label={
              <Space>
                {constantes.LABEL_RESPONSAVEL_ATIVIDADE}
                <Tooltip title={constantes.INFO_RESPONSAVEL_ATIVIDADE}><InfoCircleOutlined /></Tooltip>
              </Space>
            }
            hasFeedback
          >
            <Select
              disabled={this.state.soLeitura}
              mode="multiple"
              open={this.state.exibirListaResponsaveis}
              showArrow={true}
              showSearch={false}
              value ={this.state.listaResponsaveis}
              onClick={() => this.setState({ exibirListaResponsaveis: true })}
              onBlur={() => this.setState({ exibirListaResponsaveis: false })}
              onChange={(valor) => this.onResponsavelSelect(valor)}
              dropdownRender={opcoes =>(
                <>
                {opcoes}
                <Divider />
                <Space size={50} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', marginBottom: 16 }}>
                  <Button
                    type='danger'
                    onMouseDown={ () => {
                      this.setState({ exibirListaResponsaveis: false, listaResponsaveis: [] })
                    }}
                    icon={<CloseOutlined />}
                  />
                  <Button
                    type='primary'
                    className={styles.bbBGAzul}
                    onMouseDown={ () => {
                      this.setState({ exibirListaResponsaveis: false })
                    }}
                    icon={<CheckOutlined />}
                  />
                </Space>
                </>
              )}
            >
              {this.renderDropDownResponsaveis()}
            </Select>
          </Form.Item>
          <Form.Item
            style={{ justifyContent: "flex-end", maxWidth: "90%" }}
            {...constantes.layoutForm}
            label={
              <Space>
                {constantes.LABEL_TITULO_ATIVIDADE}
                <Tooltip title={constantes.INFO_TITULO_ATIVIDADE}><InfoCircleOutlined /></Tooltip>
              </Space>
            }
            validateStatus={this.state.tituloCheck}
            hasFeedback
          >
            <Input
              readOnly={this.state.soLeitura}
              value={this.state.titulo}
              onChange={(e) => {
                this.setState({ titulo: e.target.value });
              }}
              onBlur={(e) => {
                this.setState({ tituloCheck: validarInput(e.target.value) });
              }}
            />
          </Form.Item>
          <Form.Item
            style={{ justifyContent: "flex-end", maxWidth: "90%" }}
            {...constantes.layoutForm}
            label={
              <Space>
                {constantes.LABEL_DESCRICAO_ATIVIDADE}
                <Tooltip title={constantes.INFO_DESCRICAO_ATIVIDADE}><InfoCircleOutlined /></Tooltip>
              </Space>
            }
            validateStatus={this.state.descricaoCheck}
            hasFeedback
          >
            <Input.TextArea
              readOnly={this.state.soLeitura}
              value={this.state.descricao}
              onChange={(e) => {
                this.setState({ descricao: e.target.value });
              }}
              onBlur={(e) => {
                this.setState({ descricaoCheck: validarInput(e.target.value) });
              }}
            />
          </Form.Item>
          <Form.Item
            style={{ justifyContent: "flex-end", maxWidth: "90%" }}
            {...constantes.layoutForm}
            label={
              <Space>
                {constantes.LABEL_PRAZO_ATIVIDADE}
                <Tooltip title={constantes.INFO_PRAZO_ATIVIDADE}><InfoCircleOutlined /></Tooltip>
              </Space>
            }
            validateStatus={this.state.prazoCheck}
            hasFeedback
          >
            <Input
              readOnly={this.state.id && this.state.soLeitura ? true : false}
              value={this.state.prazo}
              type='number'
              onChange={(e) => {
                this.setState({ prazo: e.target.value });
              }}
              onBlur={(e) => {
                this.setState({ prazoCheck: validarInput(e.target.value) });
              }}
            />
          </Form.Item>
          <Form.Item
            style={{ justifyContent: "flex-end", maxWidth: "90%" }}
            {...constantes.layoutForm}
            label={constantes.LABEL_DATAS_ATIVIDADE}
            hasFeedback
          >
            <Row wrap={false}>
              <Col>
                <Typography>
                  <Typography.Text strong>
                    Início:
                  </Typography.Text> {this.renderDatas(this.state.dtInicio)}
                </Typography>
              </Col>
              <Col>
                <Typography>
                  <Typography.Text strong>
                    Conclusão:
                  </Typography.Text> {this.renderDatas(this.state.dtConclusao)}
                </Typography>
              </Col>
            </Row>
            {/* <Space size={35}>
            </Space> */}
          </Form.Item>
          <Form.Item
            style={{ justifyContent: "flex-end", maxWidth: "90%" }}
            {...constantes.layoutForm}
            label={
              <Space>
                {constantes.LABEL_COMPLEXIDADE_ATIVIDADE}
                <Tooltip title={constantes.INFO_COMPLEXIDADE_ATIVIDADE}><InfoCircleOutlined /></Tooltip>
              </Space>
            }
            hasFeedback
          >
            {this.renderListasClassificacao('complexidades')}
          </Form.Item>
          <Form.Item
            style={{ justifyContent: "flex-end", maxWidth: "90%" }}
            {...constantes.layoutForm}
            label={
              <Space>
                {constantes.LABEL_PRIORIDADE_ATIVIDADE}
                <Tooltip title={constantes.INFO_PRIORIDADE_ATIVIDADE}><InfoCircleOutlined /></Tooltip>
              </Space>
            }
            hasFeedback
          >
            {this.renderListasClassificacao('prioridades')}
          </Form.Item>
          <Form.Item
            style={{ justifyContent: "flex-end", maxWidth: "90%" }}
            {...constantes.layoutForm}
            label={
              <Space>
                {constantes.LABEL_STATUS_ATIVIDADE}
                <Tooltip title={constantes.INFO_STATUS_ATIVIDADE}><InfoCircleOutlined /></Tooltip>
              </Space>
            }
            hasFeedback
          >
            {this.renderListasClassificacao('status')}
          </Form.Item>
          <Form.Item
            style={{ justifyContent: "flex-end", maxWidth: "90%" }}
            {...constantes.layoutForm}
            label={
              <Space>
                {constantes.LABEL_TIPO_ATIVIDADE}
                <Tooltip title={constantes.INFO_TIPO_ATIVIDADE}><InfoCircleOutlined /></Tooltip>
              </Space>
            }
            hasFeedback
          >
            {this.renderListasClassificacao('tipos')}
          </Form.Item>
          <Space size={50} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', marginBottom: 16 }}>
            <Button
              type='primary'
              className={styles.bbBGAzul}
              disabled={this.state.dtInicio ? true : false}
              onClick={ () => {
                this.setState({
                  dtInicio: moment().format(),
                  idStatus: this.state.idStatus === constantes.statusConcluido ?
                    constantes.statusConcluido : constantes.statusEmAndamento,
                  status: this.state.idStatus === constantes.statusConcluido ?
                    this.props.status.find(estado => estado.id === constantes.statusConcluido).descricao :
                    this.props.status.find(estado => estado.id === constantes.statusEmAndamento).descricao
                })
              }}
              icon={<CalendarOutlined />}
              >
              {this.state.dtInicio ? 'Atividade Iniciada' : 'Iniciar Atividade'}
            </Button>
            <Button
              type='primary'
              className={styles.bbBGAzul}
              disabled={this.state.dtConclusao ? true : false}
              onClick={ () => {
                this.setState({
                  dtConclusao: moment().format(),
                  idStatus: constantes.statusConcluido,
                  status: this.props.status.find(estado => estado.id === constantes.statusConcluido).descricao
                })
              }}
              icon={<CalendarOutlined />}
            >
              {this.state.dtConclusao ? 'Atividade Concluída' : 'Concluir Atividade'}
            </Button>
          </Space>
        </Modal>
        <ModalPausarAtividade
          projetos={this.props.projetos}
          idAtividadePausada={this.state.id}
          exibirModalPausa={this.state.exibirModalPausa}
          onOkFunction={this.incluirPausa}
          onCancelFunction={this.exibirModalPausa}
        />
      </>
    );
  }
}

export default Atividade;
