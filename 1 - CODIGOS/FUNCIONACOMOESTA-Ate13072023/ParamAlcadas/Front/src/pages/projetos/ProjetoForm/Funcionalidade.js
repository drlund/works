import React, { Component } from "react";
import _ from "lodash";
import uuid from "uuid/v4";
import {
  Form,
  Modal,
  Tooltip,
  Space,
  Switch,
  Select,
  Input,
  Typography,
  Divider,
  List,
  Collapse,
  Button,
  Affix,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Responsaveis from "../Components/Responsaveis";
import { constantes } from "../Helpers/Constantes";
import {
  filtraResponsavelFuncionalidade,
  checkMatriculaDuplicada,
  confirmarExclusao,
  validarInput,
  renderDropDown,
  isAdmDaFerramenta,
} from "../Helpers/CommonsFunctions";
import styles from "../projetos.module.css";

const { Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

class Funcionalidade extends Component {
  state = {
    id: null,
    idProjeto: null,
    idStatus: null,
    idTipo: null,
    idFuncionalidadeReferencia: null,
    titulo: null,
    tituloCheck: null,
    descricao: null,
    descricaoCheck: null,
    detalhe: null,
    responsaveis: [],
    // TODO explicar o que significa o temp
    responsaveisTemp: [],
    isNew: false,
    exibirModal: false,
    checkTipoResponsavel: false, // matricula = false, lista = true
    checkTipoFuncionalidade: true, // nova = true, alteração = false
  };

  setDefaultValues = () => {
    this.setState({
      id: null,
      idProjeto: null,
      idStatus: null,
      idTipo: null,
      idFuncionalidadeReferencia: null,
      titulo: null,
      tituloCheck: null,
      descricao: null,
      descricaoCheck: null,
      detalhe: null,
      responsaveis: [],
      responsaveisTemp: [],
      isNew: false,
      exibirModal: false,
      checkTipoResponsavel: false, // matricula = false, lista = true
      checkTipoFuncionalidade: true, // nova = true, alteração = false
    });
  };

  adicionarResponsavelFuncionalidade = (responsavel) => {
    if (
      checkMatriculaDuplicada(
        this.state.responsaveisTemp,
        responsavel.matricula
      )
    ) {
      return message.error(constantes.MSG_ADICIONA_RESPONSAVEL_MAT_DUPLICADA);
    }
    this.setState({
      responsaveis: [...this.state.responsaveis, responsavel.id],
      responsaveisTemp: [...this.state.responsaveisTemp, responsavel],
    });
  };

  removerResponsavelFuncionalidade = (idResponsavel) => {
    // remover o responsável da lista da funcionalidade
    let novaListaResponsaveis = this.state.responsaveisTemp.filter((elem) => {
      return elem.id !== idResponsavel;
    });
    this.setState(
      { responsaveisTemp: novaListaResponsaveis },
    );
  };

  changeCheckTipo = (nomeCheck, valorCheck) => {
    let valorState;
    if (nomeCheck === 'checkTipoFuncionalidade' && valorCheck === true) {
      valorState = {
        [nomeCheck]: valorCheck,
        idFuncionalidadeReferencia: null,
      }
    } else {
      valorState = {
        [nomeCheck]: valorCheck
      }
    }
    this.setState({ ...valorState });
  };

  exibirModal = (valor) => {
    const { id, idStatus, idTipo } = this.state;
    if (!valor) {
      this.setDefaultValues();
      return;
    }
    // verifica se quando o botão adicionar (funcionalidade) é clicado para criar uma nova entrada,
    // já possui id
    this.setState({
      exibirModal: valor,
      id: id ? id : uuid(),
      idStatus: idStatus ? idStatus : constantes.statusNaoIniciado,
      idTipo: idTipo ? idTipo : constantes.tipoNovo, // novo - tabela: atividadesFuncionalidadesTipo
      isNew: true,
    });
  };

  criarListaFuncionalidadeParaGravar = async (funcionalidadeNova) => {
    const funcionalidadeAtual = {
      id: this.state.id,
      idProjeto: this.state.idProjeto,
      idStatus: this.state.idStatus,
      idTipo: this.state.idTipo,
      idFuncionalidadeReferencia: this.state.idFuncionalidadeReferencia,
      titulo: this.state.titulo,
      descricao: this.state.descricao,
      detalhe: this.state.detalhe,
      responsaveis: this.listaAuxIdsResponsaveis(),
      isNew: false,
    };

    // se for funcionalidade nova
    if (funcionalidadeNova) {
      return [...this.props.funcionalidades, funcionalidadeAtual];
      // se for edição de funcionalidade
    } else {
      return this.props.funcionalidades.map((funcionalidadeMap) => {
        return funcionalidadeMap.id === this.state.id
          ? funcionalidadeAtual
          : funcionalidadeMap;
      });
    }
  };

  // verifica a diferença entre o state do pai e o state local
  // retorna a lista de ids dos responsaveis pela funcionalidade
  listaAuxIdsResponsaveis = (idFuncionalidade = null) => {
    if(idFuncionalidade) {
      let funcionalidade = this.props.funcionalidades.find( funcionalidade => {
        return funcionalidade.id === idFuncionalidade
      });
      // let teste2 = teste[idFuncionalidade].responsaveis
      return funcionalidade.responsaveis;
    }
    return this.state.responsaveisTemp.map((resp) => {
      return resp.id;
    });
  };

  // mantém os reponsáveis de outras funcionalidades sem alteração
  // ou remove a funcionalidade do responsável
  excluiFuncionalidadeDoResponsavel = async (responsavel, idFuncionalidade) => {
    // retira o id da funcionalidade mas mantém o responsável na lista
    responsavel.funcionalidades = responsavel.funcionalidades.filter(funcionalidade => {
      return funcionalidade !== idFuncionalidade
    })
    return responsavel
  };

  criarListaResponsaveisParaGravar = async (existeResponsaveis) => {
    // se a lista de responsáveis é nova
    if (!existeResponsaveis) {
      return [...this.props.responsaveis, ...this.state.responsaveisTemp];
    }

    // se já existe lista de responsáveis
    const listaResponsaveisTemp = [];
    const listaAtualIdsResponsaveis = this.listaAuxIdsResponsaveis();
    // adiciona os funcis que não fazem parte da funcionalidade atual na lista temporária de responsáveis
    for (const responsavelProps of this.props.responsaveis) {
      // responsavel do props não está vinculado à funcionalidade atual
      const isResponsavelVinculado = !this.state.responsaveis.includes(responsavelProps.id) &&
        !responsavelProps.funcionalidades.includes(this.state.id)
      if ( isResponsavelVinculado ) {
        // retira o id da funcionalidade no responsável caso ele tenha sido removido da funcionalidade
        listaResponsaveisTemp.push(responsavelProps);
      }
      // retira o id da funcionalidade no responsável caso ele tenha sido removido da funcionalidade
      else if (!listaAtualIdsResponsaveis.includes(responsavelProps.id)){
        let responsavelSemIdFuncionalidade = await this.excluiFuncionalidadeDoResponsavel(responsavelProps, this.state.id);
        listaResponsaveisTemp.push(responsavelSemIdFuncionalidade);
      }

      if (!listaAtualIdsResponsaveis.length) return;
    }

    // adiciona os funcis da funcionalidade atual na lista temporária de responsáveis
    for (const responsavelState of this.state.responsaveisTemp) {
      if (!responsavelState.funcionalidades.includes(this.state.id)) {
        listaResponsaveisTemp.push({
          ...responsavelState,
          funcionalidades: [...responsavelState.funcionalidades, this.state.id],
        });
      } else {
        listaResponsaveisTemp.push(responsavelState);
      }
    }

    return listaResponsaveisTemp;
  };

  incluirFuncionalidade = async () => {
    // verificar também a lista de nomes de responsáveis
    const novaListaResponsaveis = await this.criarListaResponsaveisParaGravar(
      this.props.responsaveis.length
    );
    const isCamposValidos = await this.checkCamposFuncionalidade(
      novaListaResponsaveis
    );
    if (!isCamposValidos) {
      return;
    }

    // inclui/substitui no state do pai a lista de funcionalidades
    const novaListaFuncionalidades = await this.criarListaFuncionalidadeParaGravar(
      this.state.isNew
    );
    this.props.onUpdateState("funcionalidades", novaListaFuncionalidades);

    // inclui/substitui no state do pai a lista de responsaveis
    this.props.onUpdateState("responsaveis", novaListaResponsaveis);

    this.setDefaultValues();
  };

  checkCamposFuncionalidade = async (novaListaResponsaveis) => {
    let atualizarEstados = {};
    if (!novaListaResponsaveis) {
      message.error(constantes.MSG_CHK_RESPONSAVEL_FUNCIONALIDADE);
      return false;
    } else {
      if (!this.state.titulo)
        atualizarEstados = { ...atualizarEstados, tituloCheck: "error" };
      if (!this.state.descricao)
        atualizarEstados = { ...atualizarEstados, descricaoCheck: "error" };

      if (!_.isEmpty(atualizarEstados)) {
        this.setState(atualizarEstados);
        message.error(constantes.MSG_CHK_CAMPOS);
        return false;
      }
    }

    return true;
  };

  exibirBotoesAcaoFuncionalidade = (idFuncionalidade) => {
    let exibir;
    if (typeof idFuncionalidade === 'string') {
      exibir = true;
    } else {
      exibir = !this.props.soLeitura;
    }

    return exibir;
  }

  /**
   * Preenche os valores do state com os dados da funcionalidade selecionada
   * @param {Objet} funcionalidade
   */
  onEditarFuncionalidade = (funcionalidade) => {
    this.setState({
      id: funcionalidade.id,
      idProjeto: funcionalidade.idProjeto,
      idStatus: funcionalidade.idStatus,
      idTipo: funcionalidade.idTipo,
      idFuncionalidadeReferencia: funcionalidade.idFuncionalidadeReferencia,
      titulo: funcionalidade.titulo,
      tituloCheck: funcionalidade.tituloCheck,
      descricao: funcionalidade.descricao,
      descricaoCheck: funcionalidade.descricaoCheck,
      detalhe: funcionalidade.detalhe,
      responsaveis: funcionalidade.responsaveis,
      responsaveisTemp: filtraResponsavelFuncionalidade(
        this.props.responsaveis,
        funcionalidade.id
      ),
      isNew: false,
      exibirModal: true,
    });
  };

  onExcluirFuncionalidade = async (idFuncionalidade) => {
    const novaListaResponsaveis = [];
    for (const responsavel of this.props.responsaveis) {
      const responsavelTemp = await this.excluiFuncionalidadeDoResponsavel(responsavel, idFuncionalidade);
      novaListaResponsaveis.push( responsavelTemp );
    }

    this.props.onUpdateState("responsaveis", novaListaResponsaveis);

    this.props.onUpdateState(
      "funcionalidades",
      this.props.funcionalidades.filter(
        (funcionalidade) => funcionalidade.id !== idFuncionalidade
      )
    );
  };

  renderBotaoAdicionar = () => {
    if (
      isAdmDaFerramenta(this.props.perfilAcesso, !this.props.soLeitura) ||
      this.props.idStatusProjeto === constantes.statusConcluido) {
        return (
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
        )
    }
  }

  render() {
    const funcionalidades = this.props.funcionalidades;
    const responsaveis = this.props.responsaveis;
    return (
      <>
        <Form.Item>
          <Divider>Funcionalidades Cadastradas</Divider>
          <List
            dataSource={funcionalidades}
            pagination={{
              size: "small",
              pageSize: this.props.tamanhoPaginacao,
              total: funcionalidades.length,
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens`
            }}
            renderItem={(itemFuncionalidade) => (
              <List.Item
              actions={
                this.exibirBotoesAcaoFuncionalidade(itemFuncionalidade.id) &&
                [
                  <Button
                    type="text"
                    className={styles.bbAzul}
                    onClick={() =>
                      this.onEditarFuncionalidade(itemFuncionalidade)
                    }
                    icon={<EditOutlined />}
                  />,
                  <Button
                    type="text"
                    className={styles.vermelho}
                    onClick={() => confirmarExclusao(
                      itemFuncionalidade.id,
                      this.onExcluirFuncionalidade,
                      'Tem certeza que deseja excluir esta Funcionalidade?'
                    )}
                    icon={<DeleteOutlined />}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Collapse expandIconPosition="end">
                      <Panel
                        showArrow={false}
                        extra={<Text className={styles.bbAzul}>Detalhes</Text>}
                        header={<Text strong>{itemFuncionalidade.titulo}</Text>}
                        key={itemFuncionalidade.titulo}
                      >
                        <Text strong>Descrição</Text>
                        <Paragraph>{itemFuncionalidade.descricao}</Paragraph>
                        {itemFuncionalidade.detalhe && (
                          <>
                            <Text strong>Detalhes</Text>
                            <Paragraph>{itemFuncionalidade.detalhe}</Paragraph>
                          </>
                        )}
                        <Text strong>Responsáveis</Text>
                        <Paragraph>
                          {filtraResponsavelFuncionalidade(
                            responsaveis,
                            itemFuncionalidade.id
                          ).map((responsavel, index) => {
                            return (
                              responsavel.nome +
                              (itemFuncionalidade.responsaveis.length - 1 ===
                              index
                                ? ""
                                : ", ")
                            );
                          })}
                        </Paragraph>
                      </Panel>
                    </Collapse>
                  }
                />
              </List.Item>
            )}
          />
          {this.renderBotaoAdicionar()}
        </Form.Item>
        <Modal
          title={"Funcionalidade"}
          visible={this.state.exibirModal}
          onOk={this.incluirFuncionalidade}
          okText="Incluir"
          okButtonProps={{className: styles.bbBGAzul}}
          onCancel={() => this.exibirModal(false)}
          cancelText="Cancelar"
          cancelButtonProps={{ type: "danger" }}
          width='80%'
        >
          <Divider>
            <Space>
              Tipo de Funcionalidade
              <Switch
                checkedChildren="Nova"
                unCheckedChildren="Alteração"
                checked={this.state.checkTipoFuncionalidade}
                onChange={(check) => {
                  this.changeCheckTipo('checkTipoFuncionalidade', check);
                }}
              />
            </Space>
          </Divider>
          {!this.state.checkTipoFuncionalidade &&
          <Form.Item
            style={{ justifyContent: "flex-end", maxWidth: "90%" }}
            {...constantes.layoutForm}
            label={
              <Space>
                {constantes.LABEL_FUNCIONALIDADE_ATIVIDADE}
                <Tooltip title={constantes.INFO_FUNCIONALIDADE_FUNCIONALIDADE}><InfoCircleOutlined /></Tooltip>
              </Space>
            }
            hasFeedback
          >
            <Select
              // disabled={this.state.soLeitura}
              value={this.state.idFuncionalidadeReferencia}
              onChange={(valor) =>
                this.setState({ idFuncionalidadeReferencia: valor })
              }
            >
              <Option value={null} key={"nulo"}>
                Nenhum item selecionado
              </Option>
              {renderDropDown(
                "funcionalidades",
                this.props.funcionalidades.filter(
                  funcionalidade => typeof funcionalidade.id === 'number'
                )
              )}
            </Select>
          </Form.Item>
          }
          <Form.Item
            style={{ justifyContent: "flex-end", maxWidth: "90%" }}
            {...constantes.layoutForm}
            label={
              <Space>
                {constantes.LABEL_TITULO_FUNCIONALIDADE}
                <Tooltip title={constantes.INFO_TITULO_FUNCIONALIDADE}><InfoCircleOutlined /></Tooltip>
              </Space>
            }
            validateStatus={this.state.tituloCheck}
            hasFeedback
          >
            <Input
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
                {constantes.LABEL_DESCRICAO_FUNCIONALIDADE}
                <Tooltip title={constantes.INFO_DESCRICAO_FUNCIONALIDADE}><InfoCircleOutlined /></Tooltip>
              </Space>
            }
            validateStatus={this.state.descricaoCheck}
            hasFeedback
          >
            <Input.TextArea
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
                {constantes.LABEL_DETALHE_FUNCIONALIDADE}
                <Tooltip title={constantes.INFO_DETALHE_FUNCIONALIDADE}><InfoCircleOutlined /></Tooltip>
              </Space>
            }
            hasFeedback
          >
            <Input.TextArea
              value={this.state.detalhe}
              onChange={(e) => {
                this.setState({ detalhe: e.target.value });
              }}
            />
          </Form.Item>
          <Responsaveis
            idStatusProjeto={this.props.idStatusProjeto}
            layoutForm={constantes.layoutForm}
            funcionalidades={this.props.funcionalidades}
            responsaveis={this.props.responsaveis}
            responsaveisTemp={this.state.responsaveisTemp}
            onUpdateState={this.props.onUpdateState}
            tamanhoPaginacao={2}
            principalCheck={true}
            idFuncionalidade={this.state.id}
            origemSolicitacao={constantes.ORIGEM_FUNCIONALIDADE}
            adicionarResponsavelFuncionalidade={
              this.adicionarResponsavelFuncionalidade
            }
            removerResponsavelFuncionalidade={
              this.removerResponsavelFuncionalidade
            }
            checkTipoResponsavel={this.state.checkTipoResponsavel}
            changeCheckTipo={this.changeCheckTipo}
            soLeitura={this.props.soLeitura}
            perfilAcesso={this.props.perfilAcesso}
          />
        </Modal>
      </>
    );
  }
}

export default Funcionalidade;
