/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import {
  Typography,
  Row,
  Col,
  Space,
  Tooltip,
  Button,
  Form,
  Input,
  Select,
  Avatar,
  Divider,
  message,
  Switch,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  gravarEsclarecimento,
  fetchProjeto,
} from 'services/ducks/Projetos.ducks';
import history from '../../history';
import styles from './projetos.module.css';
import { constantes } from './Helpers/Constantes';
import EsclarecimentoLista from './Components/EsclarecimentoLista';
import { tituloCurto } from './Helpers/CommonsFunctions';
import AcessoNegado from './AcessoNegado';

const { Option } = Select;

class Esclarecimento extends Component {
  state = {
    idProjeto: null,
    idFuncionalidade: null,
    idAtividade: null,
    idEsclarecimento: null,
    pedido: null,
    pedidoCheck: null,
    matriculaIndicadoResponder: null,
    soLeitura: false,
    responsaveis: [],
    funcionalidades: [],
    atividades: [],
    esclarecimentos: [],
    isObservacao: true,
    acessoNegado: false,
  };

  componentDidMount() {
    this.fetchProjetoById();
  }

  fetchProjetoById = async () => {
    try {
      const { id } = this.props.match.params;
      const projeto = await fetchProjeto(id);
      if (projeto) {
        this.setState({
          idProjeto: projeto.informacaoBasica.id,
          responsaveis: projeto.responsaveis,
          funcionalidades: projeto.funcionalidades,
          atividades: projeto.atividades,
          esclarecimentos: projeto.esclarecimentos,
        });
      }
    } catch (error) {
      this.setState({ acessoNegado: true });
    }
  };

  gravarEsclarecimento = async () => {
    if (this.state.pedidoCheck !== 'success') {
      this.setState({ pedidoCheck: 'error' });
      message.error('O campo Pedido/Observação deve ser preenchido.');
      return;
    }
    try {
      await gravarEsclarecimento({
        idProjeto: this.state.idProjeto,
        idEsclarecimento: this.state.idEsclarecimento,
        idFuncionalidade: this.state.idFuncionalidade,
        idAtividade: this.state.idAtividade,
        pedido: this.state.pedido,
        matriculaIndicadoResponder: this.state.matriculaIndicadoResponder,
        isObservacao: this.state.isObservacao,
      });
      this.setDefaultValues();
      this.fetchProjetoById();
      message.success('A solicitação/observação foi salva com sucesso.');
    } catch (error) {
      message.error('Falha ao gravar a solicitação/observação.');
    }
  };

  setDefaultValues = () => {
    this.setState({
      idProjeto: null,
      idFuncionalidade: null,
      idAtividade: null,
      idEsclarecimento: null,
      pedido: null,
      pedidoCheck: null,
      matriculaIndicadoResponder: null,
      soLeitura: false,
      isObservacao: true,
      ativo: null,
    });
  };

  renderDropDownEsclarecimento = () => {
    if (this.state.esclarecimentos.length) {
      return this.state.esclarecimentos.map((item) => (
        <Option value={item.id} key={item.id}>
          {tituloCurto(item.pedido)}
        </Option>
      ));
    }
    return (
      <Option value={0} disabled>
        <Typography.Paragraph>
          Não há esclarecimentos para exibir.
        </Typography.Paragraph>
      </Option>
    );
  };

  renderDropDown = (conteudo) => {
    let frase;
    switch (conteudo) {
      case 'responsaveis':
        frase = 'Nenhum responsável foi encontrado.';
        break;
      case 'funcionalidades':
        frase = 'Nenhuma funcionalidade foi encontrada.';
        break;
      case 'atividades':
        frase = 'Nenhuma atividade foi encontrada.';
        break;
      default:
        frase = 'Erro ao preencher a lista';
        break;
    }
    if (this.state[conteudo].length) {
      return this.state[conteudo].map((item) => (conteudo === 'responsaveis' ? (
        <Option value={item.matricula} key={item.id}>
          <Space>
            <Avatar
              src={`https://humanograma.intranet.bb.com.br/avatar/${item.matricula}`}
              />
            {item.nome}
          </Space>
        </Option>
      ) : (
        <Option value={item.id} key={item.id}>
          {item.titulo}
        </Option>
      )));
    }
    return (
      <Option value={null} disabled>
        <Typography.Paragraph>{frase}</Typography.Paragraph>
      </Option>
    );
  };

  onSelected = (valor, nome) => {
    this.setState({ [nome]: valor });
  };

  render() {
    return (
      <Form>
        <Row wrap={false}>
          <Col className={styles.containerBotoesAcao}>
            <Space>
              <Button
                type="primary"
                className={styles.bbBGAzul}
                onClick={() => history.goBack()}
              >
                Voltar
              </Button>
              {!this.state.acessoNegado && (
                <Button
                  type="primary"
                  className={styles.bbBGAzul}
                  onClick={this.gravarEsclarecimento}
                >
                  Salvar
                </Button>
              )}
            </Space>
          </Col>
        </Row>
        {!this.state.acessoNegado ? (
          <>
            <Divider>
              Registrar
              {' '}
              <Switch
                checkedChildren="Observação"
                unCheckedChildren="Esclarecimento"
                checked={this.state.isObservacao}
                onChange={(check) => {
                  this.setState({
                    isObservacao: check,
                    idEsclarecimento: null,
                    idFuncionalidade: null,
                    idAtividade: null,
                    matriculaIndicadoResponder: null,
                  });
                }}
              />
            </Divider>
            <Form.Item
              style={{ justifyContent: 'flex-end', maxWidth: '90%' }}
              {...constantes.layoutForm}
              label={
                this.state.isObservacao ? (
                  <Space>
                    {constantes.LABEL_OBSERVACAO_ESCLARECIMENTO}
                    <Tooltip title={constantes.INFO_OBSERVACAO_ESCLARECIMENTO}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                ) : (
                  <Space>
                    {constantes.LABEL_PEDIDO_ESCLARECIMENTO}
                    <Tooltip title={constantes.INFO_PEDIDO_ESCLARECIMENTO}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                )
              }
              validateStatus={this.state.pedidoCheck}
              hasFeedback
            >
              <Input.TextArea
                readOnly={this.props.soLeitura}
                value={this.state.pedido}
                onChange={(e) => {
                  this.setState({ pedido: e.target.value });
                }}
                onBlur={(e) => {
                  let valorCheck;
                  if (!e.target.value.length) {
                    valorCheck = 'error';
                  } else {
                    valorCheck = 'success';
                  }
                  this.setState({ pedidoCheck: valorCheck });
                }}
              />
            </Form.Item>
            {!this.state.isObservacao && (
              <>
                <Form.Item
                  style={{ justifyContent: 'flex-end', maxWidth: '90%' }}
                  {...constantes.layoutForm}
                  label={(
                    <Space>
                      {constantes.LABEL_RESPONSAVEL_ESCLARECIMENTO}
                      <Tooltip
                        title={constantes.INFO_RESPONSAVEL_ESCLARECIMENTO}
                      >
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Space>
                  )}
                  hasFeedback
                >
                  <Select
                    defaultValue={null}
                    onChange={(valor) => this.onSelected(valor, 'matriculaIndicadoResponder')}
                  >
                    <Option value={null} key="nulo">
                      Nenhum item selecionado
                    </Option>
                    {this.renderDropDown('responsaveis')}
                  </Select>
                </Form.Item>
                <Form.Item
                  style={{ justifyContent: 'flex-end', maxWidth: '90%' }}
                  {...constantes.layoutForm}
                  label={(
                    <Space>
                      {constantes.LABEL_FUNCIONALIDADE_ESCLARECIMENTO}
                      <Tooltip
                        title={constantes.INFO_FUNCIONALIDADE_ESCLARECIMENTO}
                      >
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Space>
                  )}
                  hasFeedback
                >
                  <Select
                    defaultValue={null}
                    onChange={(valor) => this.onSelected(valor, 'idFuncionalidade')}
                  >
                    <Option value={null} key="nulo">
                      Nenhum item selecionado
                    </Option>
                    {this.renderDropDown('funcionalidades')}
                  </Select>
                </Form.Item>
                <Form.Item
                  style={{ justifyContent: 'flex-end', maxWidth: '90%' }}
                  {...constantes.layoutForm}
                  label={(
                    <Space>
                      {constantes.LABEL_ATIVIDADE_ESCLARECIMENTO}
                      <Tooltip title={constantes.INFO_ATIVIDADE_ESCLARECIMENTO}>
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Space>
                  )}
                  hasFeedback
                >
                  <Select
                    defaultValue={null}
                    onChange={(valor) => this.onSelected(valor, 'idAtividade')}
                  >
                    <Option value={null} key="nulo">
                      Nenhum item selecionado
                    </Option>
                    {this.renderDropDown('atividades')}
                  </Select>
                </Form.Item>
                <Form.Item
                  style={{ justifyContent: 'flex-end', maxWidth: '90%' }}
                  {...constantes.layoutForm}
                  label={(
                    <Space>
                      {constantes.LABEL_ESCLARECIMENTO_ESCLARECIMENTO}
                      <Tooltip
                        title={constantes.INFO_ESCLARECIMENTO_ESCLARECIMENTO}
                      >
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Space>
                  )}
                  hasFeedback
                >
                  <Select
                    defaultValue={null}
                    onChange={(valor) => this.onSelected(valor, 'idEsclarecimento')}
                  >
                    <Option value={null} key="nulo">
                      Nenhum item selecionado
                    </Option>
                    {this.renderDropDownEsclarecimento()}
                  </Select>
                </Form.Item>
              </>
            )}
            <Form.Item>
              <EsclarecimentoLista
                esclarecimentos={this.state.esclarecimentos}
                fetchProjetoById={this.fetchProjetoById}
                origemSolicitacao={constantes.ORIGEM_FORM_ESCLARECIMENTO}
              />
            </Form.Item>
          </>
        ) : (
          <AcessoNegado />
        )}
      </Form>
    );
  }
}

export default Esclarecimento;
