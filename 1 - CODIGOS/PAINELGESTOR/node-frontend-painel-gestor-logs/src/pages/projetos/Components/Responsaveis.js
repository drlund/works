import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchDadosFunci } from "services/ducks/Projetos.ducks";
import uuid from "uuid/v4";
import {
  Divider,
  Form,
  Switch,
  Checkbox,
  Space,
  Tooltip,
  Typography,
  List,
  Row,
  Col,
  Avatar,
  Button,
  message,
  Select,
} from "antd";
import { InfoCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { getProfileURL } from "utils/Commons";
import { constantes } from "../Helpers/Constantes";
import { confirmarExclusao, checkMatriculaDuplicada, isAdmDaFerramenta, permiteIncluirResponsavel } from "../Helpers/CommonsFunctions";
import styles from "../projetos.module.css";
import MaskedInput from "react-text-mask";

const { Paragraph, Text } = Typography;
const { Option } = Select;

class Responsaveis extends Component {
  state = {
    id: null,
    funcionalidades: [],
    matricula: null,
    matriculaCheck: null,
    nome: null,
    funciAtual: {},
    principal: false,
    principalNestasFuncionalidades: [],
    administrador: false,
    dev: false,
    dba: false,
    loading: false,
    selectDefault: '',
  };

  setDefaultValues = () => {
    this.setState({
      id: null,
      funcionalidades: [],
      matricula: null,
      matriculaCheck: null,
      nome: null,
      funciAtual: {},
      principal: false,
      principalNestasFuncionalidades: [],
      administrador: false,
      dev: false,
      dba: false,
      loading: false,
      isNew: false,
      selectDefault: '',
    });
  };

  matriculaChanged = async (matriculaDigitada) => {
    // verifica se foi digitada uma matricula
    if (matriculaDigitada.length === 0) {
      this.setDefaultValues();
      return;
    }

    const isFormatoMatriculaValido = matriculaDigitada.length > 7 && matriculaDigitada.indexOf("_") === -1;

    // verifica se o input (com mascara) não contém "_"
    if (isFormatoMatriculaValido) {
      try {
        let novoFunci = await fetchDadosFunci(matriculaDigitada);
        this.setState({
          funciAtual: novoFunci,
          matricula: matriculaDigitada,
          nome: novoFunci.nome,
          matriculaCheck: "success",
          loading: false,
        });
      } catch (error) {
        this.setState({
          matricula: matriculaDigitada,
          matriculaCheck: "error",
          loading: false,
        });
        return message.error(constantes.MSG_ATUALIZA_RESPONSAVEL);
      }
    } else {
      this.setState({
        matricula: matriculaDigitada,
        matriculaCheck: "error",
        loading: true,
      });
    }
  };

  adicionaResponsavelPorMatricula = async (matricula) => {
    const responsaveis = this.props.responsaveis;
    if (!matricula || this.state.matriculaCheck === "error") {
      this.setState({
        matriculaCheck: "error",
        loading: false,
      });
      return message.error(constantes.MSG_ADICIONA_RESPONSAVEL_MAT_INCOMPLETA);
    }

    let textoMatDuplicada;
    if (this.props.origemSolicitacao === constantes.ORIGEM_INFO_BASICA) {
      textoMatDuplicada = constantes.MSG_ADICIONA_RESPONSAVEL_MAT_DUPLICADA_INFO_BASICA
    } else if (this.props.origemSolicitacao === constantes.ORIGEM_FUNCIONALIDADE) {
      textoMatDuplicada = constantes.MSG_ADICIONA_RESPONSAVEL_MAT_DUPLICADA_FUNCIONALIDADES
    }
    if (checkMatriculaDuplicada(responsaveis, matricula)) {
      this.setDefaultValues();
      return message.error(textoMatDuplicada);
    }

    const funciAtual = {
      matricula: this.state.funciAtual.matricula,
      nome: this.state.funciAtual.nome,
      codFuncao: this.state.funciAtual.codFuncaoLotacao,
      nomeFuncao: this.state.funciAtual.descFuncLotacao,
      prefixo: this.state.funciAtual.descFuncLotacao,
      nomeEquipe: this.state.funciAtual.nomeUorGrupo,
      administrador: this.state.administrador,
      dev: this.state.dev,
      dba: this.state.dba,
      principal: this.state.principal,
      principalNestasFuncionalidades: this.state.principalNestasFuncionalidades,
      funcionalidades: this.state.funcionalidades,
    };

    // vincular o id da funcionalidade ao responsavel
    if (this.props.idFuncionalidade) {
      funciAtual.funcionalidades = [
        ...this.state.funcionalidades,
        this.props.idFuncionalidade,
      ];
    }

    // verifica se é responsavel por esta funcionalidade
    if (this.props.idFuncionalidade && this.state.principal) {
      funciAtual.principalNestasFuncionalidades = [
        ...this.state.principalNestasFuncionalidades,
        this.props.idFuncionalidade,
      ]
    }

    // criar o id do responsavel
    if (!this.state.id) {
      funciAtual.id = uuid();
    }

    if (this.props.origemSolicitacao === constantes.ORIGEM_FUNCIONALIDADE) {
      // call back para indicar o id do responsável à funcionalidade
      this.props.adicionarResponsavelFuncionalidade(funciAtual);
    }
    if (this.props.origemSolicitacao === constantes.ORIGEM_INFO_BASICA) {
      this.props.onUpdateState("responsaveis", [...responsaveis, funciAtual]);
    }

    this.setDefaultValues();
  };

  adicionaResponsavelDaLista = (matricula) => {
    const responsavel = this.props.responsaveis.find( responsavel => responsavel.matricula === matricula)
    responsavel.principal = this.isPrincipal(responsavel.funcionalidades, this.props.idFuncionalidade)
    this.props.adicionarResponsavelFuncionalidade( responsavel );
    this.setState({ selectDefault: '' })
    this.setDefaultValues();
  };

  renderDropDownResponsaveis = () => {
    const responsaveisLista = this.props.responsaveis.filter((elem) => {
      return !elem.funcionalidades.includes(this.props.idFuncionalidade);
    });
    const responsaveisNaoIncluidos = responsaveisLista.filter( elem => {
      return !this.props.responsaveisTemp.find( temp => {
        return elem.matricula === temp.matricula
      })
    })

    if(responsaveisNaoIncluidos.length) {
      return responsaveisNaoIncluidos.map((item) => {
        return (
          <Option value={item.matricula} key={item.id}>
            <Space>
              <Avatar
                size={24}
                src={getProfileURL(item.matricula)}
              />
              {item.nome}
            </Space>
          </Option>
        );
      })
    } else {
      return (
        <Option value={0} disabled={true}>
          <Paragraph>
            Nenhum responsável cadastrado ainda.
          </Paragraph>
        </Option>
      )
    }
  }

  onSelected = (matricula) => {
    this.setState({ selectDefault: matricula, matricula })

  }

  isUnicoResponsavel = (idFuncionalidade) => {
    return this.props.funcionalidades.some((funcionalidade) => {
      return (
        funcionalidade.id === idFuncionalidade &&
        funcionalidade.responsaveis.length < 2
      );
    });
  };

  ajustaListaResponsaveisDasFuncionalidades = async (idResponsavel) => {
    // verifica se o responsável cadastrado é unico para uma funcionalidade
    const respTemp = this.props.responsaveis.find(
      (resp) => resp.id === idResponsavel
    );
    const listaFuncionalidadesTemp = respTemp.funcionalidades;

    for (const idFuncionalidade of listaFuncionalidadesTemp) {
      if (this.isUnicoResponsavel(idFuncionalidade)) {
        message.error(constantes.MSG_EXCLUIR_RESPONSAVEL_UNICO);
        return false;
      }
    }

    // se não é único, remove o responsável da funcionalidade
    const novaListaFuncionalidades = this.props.funcionalidades.map(
      (funcionalidade) => {
        if (funcionalidade.responsaveis.includes(idResponsavel)) {
          const funcionalidadeAlteradoResponsaveis = funcionalidade;
          funcionalidadeAlteradoResponsaveis.responsaveis = funcionalidadeAlteradoResponsaveis.responsaveis.filter(
            (responsavel) => {
              return responsavel !== idResponsavel;
            }
          );
          return funcionalidadeAlteradoResponsaveis;
        } else {
          return funcionalidade;
        }
      }
    );

    this.props.onUpdateState("funcionalidades", novaListaFuncionalidades);
    return true;
  };

  excluiResponsavel = async (idResponsavel) => {
    if (this.props.origemSolicitacao === constantes.ORIGEM_FUNCIONALIDADE) {
      // call back para indicar o id do responsável à funcionalidade
      this.props.removerResponsavelFuncionalidade(idResponsavel);
      return;
    }

    if (this.props.origemSolicitacao === constantes.ORIGEM_INFO_BASICA) {
      const funcionalidadeAjustada = await this.ajustaListaResponsaveisDasFuncionalidades(
        idResponsavel
      );

      if (funcionalidadeAjustada) {
        this.props.onUpdateState(
          "responsaveis",
          this.props.responsaveis.filter((elem) => {
            return elem.id !== idResponsavel;
          })
        );
      }
    }
  };

  adicionaNomeFuncionalidadeNoResponsavel = (listaIdsFuncionalidades) => {
    let lista = "";
    for (const idLista of listaIdsFuncionalidades) {
      let funcionalidade = this.props.funcionalidades.find(
        (func) => func.id === idLista
      );
      if (funcionalidade) lista += funcionalidade.titulo + ", ";
    }
    // retira a última vírgula
    return lista.replace(/[,](?=[^,]*$)/, "");
  };

  ativaCheckPrincipal = (perfilAcesso, nomeCheck) => {
    let inativo;
    if ((isAdmDaFerramenta(perfilAcesso) || this.props.idStatusProjeto === constantes.statusConcluido) && nomeCheck !== 'administrador') {
      inativo = false;
    } else if (isAdmDaFerramenta(perfilAcesso) === false && this.props.soLeitura) {
      inativo = true;
    } else {
      inativo = this.props.soLeitura;
    }
    return inativo;
  }

  renderCheckOnForm = (administrador, principal) => {
    let tituloTolltip;
    let checkedValue;
    let nameState;
    let textoCheck;
    let perfilAcesso = this.props.perfilAcesso ? this.props.perfilAcesso : [];
    if (administrador && (isAdmDaFerramenta(perfilAcesso) || this.props.idStatusProjeto === constantes.statusConcluido)) {
      tituloTolltip = constantes.INFO_ADMINISTRADOR_RESPONSAVEL;
      checkedValue = this.state.administrador;
      nameState = 'administrador';
      textoCheck = constantes.LABEL_ADMINISTRADOR_RESPONSAVEL;
    }

    if (principal) {
      tituloTolltip = constantes.INFO_PRINCIPAL_RESPONSAVEL;
      checkedValue = this.state.principal;
      nameState = 'principal';
      textoCheck = constantes.LABEL_PRINCIPAL_RESPONSAVEL;
    }

    return (
      nameState &&
      <Form.Item
        style={{ justifyContent: "flex-end", maxWidth: "90%" }}
        {...constantes.layoutForm}
        label={
          <Space>
            <Tooltip title={tituloTolltip}><InfoCircleOutlined /></Tooltip>
          </Space>
        }
        hasFeedback
      >
        <Checkbox
          disabled={this.ativaCheckPrincipal(perfilAcesso)}
          checked={checkedValue}
          onChange={(e) => {
            this.setState({
              [nameState]: e.target.checked,
            });
          }}
        >
          {textoCheck}
        </Checkbox>
        { administrador && isAdmDaFerramenta(perfilAcesso) &&
          <>
          <Checkbox
            disabled={!isAdmDaFerramenta(perfilAcesso)}
            checked={this.state.dev}
            onChange={(e) => {
              this.setState({
                dev: e.target.checked,
              });
            }}
          >
            {constantes.LABEL_DEV_RESPONSAVEL}
          </Checkbox>
          <Checkbox
            disabled={!isAdmDaFerramenta(perfilAcesso)}
            checked={this.state.dba}
            onChange={(e) => {
              this.setState({
                dba: e.target.checked,
              });
            }}
          >
            {constantes.LABEL_DBA_RESPONSAVEL}
          </Checkbox>
          </>
        }
      </Form.Item>
    )
  }

  isPrincipal = (listaFuncionalidades, idFuncionalidade) => {
    if (listaFuncionalidades.includes(idFuncionalidade)) {
      return true;
    }
    return false;
  }

  renderCheckOnItem = (item, exibeCheckAdministrador, exibeCheckPrincipal) => {
    let checkedValue;
    let nomeCheck;
    let textoCheck;
    let exibirNomeFuncionalidade;
    let perfilAcesso = this.props.perfilAcesso ? this.props.perfilAcesso : [];
    if (exibeCheckAdministrador) {
      checkedValue = item.administrador;
      nomeCheck = 'administrador';
      textoCheck = constantes.LABEL_ADMINISTRADOR_RESPONSAVEL;
    }

    // exibe a check de principal responsável na modal da aba funcionalidades
    if (exibeCheckPrincipal) {
      checkedValue = this.isPrincipal(item.principalNestasFuncionalidades, this.props.idFuncionalidade);
      nomeCheck = 'principal';
      textoCheck = constantes.LABEL_PRINCIPAL_RESPONSAVEL;
    }

    if(item.funcionalidades.length && this.props.origemSolicitacao === constantes.ORIGEM_INFO_BASICA) {
      exibirNomeFuncionalidade = true;
    } else {
      exibirNomeFuncionalidade = false;
    }

    const checkContent = [];
    // conteúdo obrigatório do checkbox na lista de responsáveis
    checkContent.push(
      <Checkbox
        key={nomeCheck+item.id}
        disabled={this.ativaCheckPrincipal(perfilAcesso, nomeCheck)}
        checked={checkedValue}
        onChange={(e) => {
          this.changeCheckBox(item.id, nomeCheck, e.target.checked, item.principalNestasFuncionalidades)
        }}
      >
        {textoCheck}
      </Checkbox>
    )

    // conteúdo adicional do checkbox na lista de responsáveis
    // flag administrador
    if (item.administrador && this.props.origemSolicitacao === constantes.ORIGEM_FUNCIONALIDADE) {
      checkContent.push(
        <Checkbox
          key={`administrador${item.id}`}
          disabled={true}
          checked={item.administrador}
        >
          {constantes.LABEL_ADMINISTRADOR_RESPONSAVEL}
        </Checkbox>
      )
    }
    // flag desenvolvedor
    if (item.dev && this.props.origemSolicitacao === constantes.ORIGEM_FUNCIONALIDADE) {
      checkContent.push(
        <Checkbox
          key={`dev${item.id}`}
          disabled={true}
          checked={item.dev}
        >
          {constantes.LABEL_DEV_RESPONSAVEL}
        </Checkbox>
      )
    }
    // flag Adm Banco de dados
    if (item.dba && this.props.origemSolicitacao === constantes.ORIGEM_FUNCIONALIDADE) {
      checkContent.push(
        <Checkbox
          key={`dba${item.id}`}
          disabled={true}
          checked={item.dba}
        >
          {constantes.LABEL_DBA_RESPONSAVEL}
        </Checkbox>
      )
    }

    // se o funci possui perfil de adm na ferramenta
    if (exibeCheckAdministrador && isAdmDaFerramenta(perfilAcesso)) {
      checkContent.push(
        <Checkbox
          key={`dev${item.id}`}
          disabled={this.props.soLeitura}
          checked={item.dev}
          onChange={(e) => {
            this.changeCheckBox(item.id, 'dev', e.target.checked, item.principalNestasFuncionalidades)
          }}
          >
          {constantes.LABEL_DEV_RESPONSAVEL}
        </Checkbox>,
        <Checkbox
          key={`dba${item.id}`}
          disabled={this.props.soLeitura}
          checked={item.dba}
          onChange={(e) => {
            this.changeCheckBox(item.id, 'dba', e.target.checked, item.principalNestasFuncionalidades)
          }}
          >
          {constantes.LABEL_DBA_RESPONSAVEL}
        </Checkbox>
      )
    }

    // se o funci é responsável por alguma funcionalidade
    if (exibirNomeFuncionalidade) {
      checkContent.push(
        <Paragraph key={item.id}>
          <Text>
            <Space>
              Responsável pela funcionalidade <Text mark>
                {this.adicionaNomeFuncionalidadeNoResponsavel(
                  item.funcionalidades
                  )}
              </Text>
            </Space>
          </Text>
        </Paragraph>
      )
    }

    return checkContent;
  }

  changeCheckBox = (idResponsavel, nomeCheck, valorCheck, principalNestasFuncionalidades) => {
    if (nomeCheck === 'principal' && valorCheck) {
      principalNestasFuncionalidades = [...principalNestasFuncionalidades, this.props.idFuncionalidade]
      // this.setState({
      //   principalNestasFuncionalidades: [
      //     ...this.state.principalNestasFuncionalidades,
      //     this.props.idFuncionalidade,
      //   ]
      // })
    } else {
      // let principalNestasFuncionalidades = this.state.principalNestasFuncionalidades.filter(funcionalidade => {
      principalNestasFuncionalidades = principalNestasFuncionalidades.filter(funcionalidade => {
        return funcionalidade !== this.props.idFuncionalidade
      })
      // this.setState({ principalNestasFuncionalidades })
    }

    this.props.onUpdateState(
      "responsaveis",
      this.props.responsaveis.map(responsavel => {
        if (responsavel.id === idResponsavel) {
          responsavel[nomeCheck] = valorCheck;
          responsavel.principalNestasFuncionalidades = principalNestasFuncionalidades;
        }
        return responsavel;
      })
    )

    return valorCheck;
  }

  render() {
    let responsaveis = [];

    if (this.props.origemSolicitacao === constantes.ORIGEM_FUNCIONALIDADE) {
      responsaveis = [...this.props.responsaveisTemp];
    }
    if (this.props.origemSolicitacao === constantes.ORIGEM_INFO_BASICA) {
      responsaveis = [...this.props.responsaveis];
    }
    return (
      <>
        { permiteIncluirResponsavel(
          this.props.idStatusProjeto,
          this.props.perfilAcesso,
          !this.props.soLeitura,
          this.props.origemSolicitacao) &&
        // (isAdmDaFerramenta(this.props.perfilAcesso, !this.props.soLeitura) ||
        //  this.props.idStatusProjeto === constantes.statusConcluido) &&
        //  this.props.origemSolicitacao === constantes.ORIGEM_FUNCIONALIDADE &&
        <>
          <Divider>
            <Space>
              Incluir Responsável
              {this.props.origemSolicitacao ===
                constantes.ORIGEM_FUNCIONALIDADE && (
                <Switch
                  checkedChildren="Lista"
                  unCheckedChildren="Matrícula"
                  checked={this.props.checkTipoResponsavel}
                  onChange={(check) => {
                    this.props.changeCheckTipo('checkTipoResponsavel', check);
                    this.setDefaultValues();
                  }}
                />
              )}
            </Space>
          </Divider>
          {!this.props.checkTipoResponsavel ? (
            <>
              <Form.Item
                style={{ justifyContent: "flex-end", maxWidth: "90%" }}
                {...constantes.layoutForm}
                label={
                  <Space>
                    {constantes.LABEL_MATRICULA_RESPONSAVEL}
                    <Tooltip title={constantes.INFO_MATRICULA_RESPONSAVEL}><InfoCircleOutlined /></Tooltip>
                  </Space>
                }
                validateStatus={this.state.matriculaCheck}
                hasFeedback
              >
                <MaskedInput
                  className="ant-input"
                  value={this.state.matricula}
                  mask={["F", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                  placeholder="F0000000"
                  onChange={(e) => {
                    this.matriculaChanged(e.target.value);
                  }}
                  onBlur={(e) => {
                    let valorCheck;
                    if (!e.target.value.length) {
                      valorCheck = "error";
                    } else {
                      valorCheck = "success";
                    }
                    this.setState({
                      matriculaCheck: valorCheck,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                style={{ justifyContent: "flex-end", maxWidth: "90%" }}
                {...constantes.layoutForm}
                label={constantes.LABEL_MATRICULA_NOME_RESPONSAVEL}
                hasFeedback
              >
                <Text>{this.state.nome}</Text>
              </Form.Item>
              { this.renderCheckOnForm(this.props.administradorCheck, this.props.principalCheck) }

            </>
          ) : (
            <Form.Item
              style={{ justifyContent: "flex-end", maxWidth: "90%" }}
              {...constantes.layoutForm}
              hasFeedback
            >
              <Row>
                <Col
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    paddingRight: "25%",
                  }}
                >
                  <Select
                    value={this.state.selectDefault}
                    onChange={this.onSelected}
                  >
                    <Option value={null} key={'nulo'}>
                      Nenhum item selecionado
                    </Option>
                    {this.renderDropDownResponsaveis()}
                  </Select>
                </Col>
              </Row>
            </Form.Item>
          )}
            <Form.Item
              style={{ justifyContent: "flex-end", maxWidth: "90%" }}
              {...constantes.layoutForm}
              hasFeedback
            >
              <Row>
                <Col
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    paddingRight: "25%",
                  }}
                >
                  <Button
                    loading={this.state.loading}
                    type="primary"
                    className={styles.bbBGAzul}
                    onClick={() => {
                      if(this.props.checkTipoResponsavel) {
                        this.adicionaResponsavelDaLista(this.state.matricula);
                      } else{
                        this.adicionaResponsavelPorMatricula(this.state.matricula)
                      }
                    }}
                  >
                    Adicionar Responsável
                  </Button>
                </Col>
              </Row>
            </Form.Item>
        </>}
        <>
          <Form.Item>
            <Divider>Responsáveis inclusos</Divider>
            <List
              dataSource={responsaveis}
              pagination={{
                size: "small",
                pageSize: this.props.tamanhoPaginacao,
                total: responsaveis.length,
                showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens`
              }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    !this.props.soLeitura &&
                    <Button
                      type='text'
                      className={styles.vermelho}
                      icon={<DeleteOutlined />}
                      onClick={() => confirmarExclusao(
                        item.id,
                        this.excluiResponsavel,
                        'Tem certeza que deseja excluir este Responsável?'
                      )}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={24}
                        src={getProfileURL(item.matricula)}
                      />
                    }
                    title={
                      <a
                        href={getProfileURL(item.matricula)}
                        target="_blanc"
                      >
                        {item.nome}
                      </a>
                    }
                    description={
                      <>
                        <Paragraph>
                          {`${item.nomeFuncao} - ${item.nomeEquipe}`}
                        </Paragraph>
                        {this.renderCheckOnItem(item, this.props.administradorCheck, this.props.principalCheck)}
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Form.Item>
        </>
      </>
    );
  }
}

export default connect(null, {
  fetchDadosFunci,
})(Responsaveis);
