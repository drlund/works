/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';
import {
  gravarProjeto,
  fetchProjeto,
  fetchListaProjetos,
} from 'services/ducks/Projetos.ducks';
import _ from 'lodash';
import {
  Tabs,
  Form,
  Row,
  Col,
  Button,
  message,
  Typography,
  Space,
  Affix,
} from 'antd';
import PageLoading from 'components/pageloading/PageLoading';
import history from '../../history';
import InformacaoBasica from './ProjetoForm/InformacaoBasica';
import Responsaveis from './Components/Responsaveis';
import Funcionalidade from './ProjetoForm/Funcionalidade';
import Anexo from './ProjetoForm/Anexo';
import Atividade from './ProjetoForm/Atividade';
import EsclarecimentoLista from './Components/EsclarecimentoLista';
import ModalConcluirProjeto from './Components/ModalConcluirProjeto';
import { constantes } from './Helpers/Constantes';
import styles from './projetos.module.css';
import AcessoNegado from './AcessoNegado';

const { TabPane } = Tabs;
const abaDefault = 'informacaoBasica';
const caminhoLeitura = '/projetos/visualizar-projeto/:id';
class ProjetoForm extends Component {
  state = {
    informacaoBasica: {
      id: null,
      titulo: null,
      resumo: null,
      objetivo: null,
      qtdePessoas: null,
      reducaoTempo: null,
      reducaoCusto: null,
      idStatus: null,
    },
    inputsChecks: {
      tituloCheck: null,
      resumoCheck: null,
      objetivoCheck: null,
      qtdePessoasCheck: null,
      reducaoTempoCheck: null,
      reducaoCustoCheck: null,
    },
    responsaveis: [],
    funcionalidades: [],
    anexos: [],
    esclarecimentos: [],
    anexosServidor: [],
    atividades: [],
    complexidades: [],
    prioridades: [],
    status: [],
    tipos: [],
    projetos: [],
    // eslint-disable-next-line react/no-unused-state
    exibirModalResponsaveis: false,
    soLeitura: false,
    projetoAlterado: false,
    perfilAcesso: [],
    acessoNegado: false,
    abaAtiva: abaDefault,
    exibirModalStatusProjeto: false,
    pageLoading: true,
  };

  componentDidMount() {
    this.fetchProjetoById();
  }

  setDefaultValues = () => {
    this.setState({
      informacaoBasica: {
        id: null,
        titulo: null,
        resumo: null,
        objetivo: null,
        qtdePessoas: null,
        reducaoTempo: null,
        reducaoCusto: null,
        idStatus: null,
      },
      inputsChecks: {
        tituloCheck: null,
        resumoCheck: null,
        objetivoCheck: null,
        qtdePessoasCheck: null,
        reducaoTempoCheck: null,
        reducaoCustoCheck: null,
      },
      responsaveis: [],
      funcionalidades: [],
      anexos: [],
      anexosServidor: [],
      atividades: [],
      exibirModalResponsaveis: false,
      projetoAlterado: false,
      acessoNegado: false,
      abaAtiva: abaDefault,
      exibirModalStatusProjeto: false,
    });
  };

  isSomenteLeitura = (status) => {
    const leitura = !!(this.props.match.path === caminhoLeitura
      || status !== constantes.statusNaoIniciado);
    return leitura;
  };

  /**
   * Verifica se o projeto foi altera, pois fica pendente de salvamento
   * @param {String} stateParaChecar - qual state está sendo alterado,
   * pois nem todos necessitam ser salvos
   * @returns boolean
   */
  isProjetoAlterado = (stateParaChecar) => !(
    stateParaChecar === 'inputsChecks' && this.state.projetoAlterado === false
  );

  fetchProjetoById = async (idProjeto = null) => {
    const permissao = getPermissoesUsuario('Projetos', this.props.authState);
    this.setState({ perfilAcesso: permissao });

    // verfica se o projeto já existe no BD
    let projeto = null;
    let listaProjetos = null;
    const id = idProjeto || this.props.match.params.id;
    if (!_.isNil(id)) {
      try {
        projeto = await fetchProjeto(id);
        const naoConcluidosTmp = fetchListaProjetos(
          false,
          constantes.statusNaoConcluidos,
        );
        const concluidosTmp = fetchListaProjetos(
          false,
          constantes.statusConcluido,
        );
        const [naoConcluidos, concluidos] = await Promise.all([
          naoConcluidosTmp,
          concluidosTmp,
        ]);
        listaProjetos = naoConcluidos.concat(concluidos);
        const aba = localStorage.getItem('@projetos/aba');
        const nomeAba = aba || abaDefault;
        this.setState({
          informacaoBasica: projeto.informacaoBasica,
          responsaveis: projeto.responsaveis,
          funcionalidades: projeto.funcionalidades,
          anexos: [],
          anexosServidor: projeto.anexosServidor,
          esclarecimentos: projeto.esclarecimentos,
          atividades: projeto.atividades,
          complexidades: projeto.listaComplexidades,
          prioridades: projeto.listaPrioridades,
          status: projeto.listaStatus,
          tipos: projeto.listaTipos,
          projetos: listaProjetos,
          abaAtiva: nomeAba,
          soLeitura: this.isSomenteLeitura(projeto.informacaoBasica.idStatus),
          pageLoading: false,
        });
      } catch (error) {
        this.setState({ acessoNegado: true, pageLoading: false });
      }
    } else {
      try {
        projeto = await fetchProjeto(null);
        this.setState({
          informacaoBasica: {
            ...this.state.informacaoBasica,
            idStatus: constantes.statusNaoIniciado,
          },
          complexidades: projeto.listaComplexidades,
          prioridades: projeto.listaPrioridades,
          status: projeto.listaStatus,
          tipos: projeto.listaTipos,
          pageLoading: false,
        });
      } catch (error) {
        this.setState({ acessoNegado: true, pageLoading: false });
      }
    }
  };

  onUpdateState = (parametro, valor) => {
    this.setState({
      [parametro]: valor,
      projetoAlterado: this.isProjetoAlterado(parametro),
    });
  };

  onInputChange = (valor) => {
    if (!valor.length) {
      return 'error';
    }
    return 'success';
  };

  /**
   * Cada input tem um atributo que indica se o campo está preenchido corretamente.
   * Este método faz uma checagem em lote de todos os inputs,
   * e se todos os campos obrigatórios foram preenchidos.
   * @returns boolean
   */
  checkGravar = () => {
    let atualizarEstadosInputs = {};
    if (!this.state.informacaoBasica.titulo) {
      atualizarEstadosInputs = {
        ...atualizarEstadosInputs,
        tituloCheck: 'error',
      };
    }
    if (!this.state.informacaoBasica.resumo) {
      atualizarEstadosInputs = {
        ...atualizarEstadosInputs,
        resumoCheck: 'error',
      };
    }
    if (!this.state.informacaoBasica.objetivo) {
      atualizarEstadosInputs = {
        ...atualizarEstadosInputs,
        objetivoCheck: 'error',
      };
    }
    if (!this.state.informacaoBasica.qtdePessoas) {
      atualizarEstadosInputs = {
        ...atualizarEstadosInputs,
        qtdePessoasCheck: 'error',
      };
    }
    if (!this.state.informacaoBasica.reducaoTempo) {
      atualizarEstadosInputs = {
        ...atualizarEstadosInputs,
        reducaoTempoCheck: 'error',
      };
    }
    if (!this.state.informacaoBasica.reducaoCusto) {
      atualizarEstadosInputs = {
        ...atualizarEstadosInputs,
        reducaoCustoCheck: 'error',
      };
    }
    if (!_.isEmpty(atualizarEstadosInputs)) {
      this.setState({
        inputsChecks: {
          ...this.state.inputsChecks,
          ...atualizarEstadosInputs,
        },
        abaAtiva: abaDefault,
      });
      message.error(constantes.MSG_CHK_CAMPOS);
      return false;
    }
    if (!this.state.responsaveis.length) {
      message.error(constantes.MSG_RESPONSAVEIS);
      return false;
    }
    if (!this.state.funcionalidades.length) {
      message.error(constantes.MSG_FUNCIONALIDADES);
      return false;
    }

    return true;
  };

  confirmarStatusProjeto = () => {
    if (!this.checkGravar()) {
      return;
    }
    const statusAtividades = this.state.atividades.map(
      (atividade) => atividade.idStatus,
    );
    if (
      typeof this.state.informacaoBasica.id === 'number'
      && statusAtividades.every((estado) => estado === constantes.statusConcluido)
    ) {
      this.setState({ exibirModalStatusProjeto: true });
    } else {
      this.setState({ projetoAlterado: false });
      this.gravarProjeto(false);
    }
  };

  mudaVisibilidadeModal = (visivel) => {
    this.setState({ exibirModalStatusProjeto: visivel });
  };

  gravarProjeto = async (encerrarProjeto) => {
    const { informacaoBasica } = this.state;
    if (encerrarProjeto) {
      informacaoBasica.idStatus = constantes.statusConcluido;
    }
    let solicitacaoGravada;
    try {
      solicitacaoGravada = await gravarProjeto({
        informacaoBasica,
        responsaveis: this.state.responsaveis,
        funcionalidades: this.state.funcionalidades,
        anexos: this.state.anexos,
        anexosServidor: this.state.anexosServidor,
        atividades: this.state.atividades,
      });
      if (solicitacaoGravada.projetoNovo) {
        this.setDefaultValues();
      } else {
        this.setState({
          projetoAlterado: false,
          exibirModalStatusProjeto: false,
        });
      }
      message.success('O projeto foi salvo com sucesso.');
      this.setState({ pageLoading: true }, async () => {
        await this.fetchProjetoById(solicitacaoGravada.idProjeto);
        if (
          this.state.informacaoBasica.idStatus === constantes.statusNaoIniciado
        ) {
          history.push(
            `/projetos/editar-projeto/${this.state.informacaoBasica.id}`,
          );
        } else {
          history.push(
            `/projetos/visualizar-projeto/${this.state.informacaoBasica.id}`,
          );
        }
        this.setState({ pageLoading: false });
      });
    } catch (error) {
      message.error('Falha ao salvar o projeto.');
      this.setState({ projetoAlterado: true });
    }
  };

  listaProjeto = () => {
    localStorage.removeItem('@projetos/aba');
    this.setState(
      { acessoNegado: false },
      history.push('/projetos/lista-projetos'),
    );
  };

  memorizarAba = (nomeAba) => {
    localStorage.setItem('@projetos/aba', nomeAba);
    this.setState({ abaAtiva: nomeAba });
  };

  render() {
    return (
      <Form>
        <Row wrap={false}>
          <Col className={styles.containerBotoesAcao}>
            {this.state.projetoAlterado && (
              <Affix offsetTop={10} className={styles.containerMsgAlerta}>
                <Typography.Text mark strong>
                  As alterações só terão efeito após o projeto ser gravado! Os
                  dados serão perdidos se cair seu login da intranet.
                </Typography.Text>
              </Affix>
            )}
            <Space>
              <Button
                type="primary"
                className={styles.bbBGAzul}
                onClick={this.listaProjeto}
              >
                Página Inicial
              </Button>
              {this.state.perfilAcesso.includes('DEV') && (
                <Button
                  type="primary"
                  className={styles.bbBGAzul}
                  onClick={() => history.push('/projetos/central-atividades/')}
                >
                  Central de Atividades
                </Button>
              )}
              <Button
                disabled={!this.state.projetoAlterado}
                type="primary"
                className={styles.bbBGAzul}
                onClick={() => this.confirmarStatusProjeto()}
              >
                Salvar
              </Button>
            </Space>
          </Col>
        </Row>
        <Row>
          <Col>
            {this.state.pageLoading ? (
              <PageLoading />
            )
              : !this.state.acessoNegado ? (
                <Tabs
                  type="card"
                  activeKey={this.state.abaAtiva}
                  onTabClick={(nomeAba) => this.memorizarAba(nomeAba)}
              >
                  <TabPane tab="Informações Básicas" key="informacaoBasica">
                    <InformacaoBasica
                      informacaoBasica={this.state.informacaoBasica}
                      inputsChecks={this.state.inputsChecks}
                      onUpdateState={this.onUpdateState}
                      soLeitura={this.state.soLeitura}
                      perfilAcesso={this.state.perfilAcesso}
                      status={this.state.status}
                  />
                    <Responsaveis
                      idStatusProjeto={this.state.informacaoBasica.idStatus}
                      funcionalidades={this.state.funcionalidades}
                      responsavelTemp={this.state.responsavelTemp}
                      responsaveis={this.state.responsaveis}
                      funcionalidadeTemp={this.state.funcionalidades}
                      onUpdateState={this.onUpdateState}
                      tamanhoPaginacao={5}
                      administradorCheck
                      origemSolicitacao={constantes.ORIGEM_INFO_BASICA}
                      soLeitura={this.state.soLeitura}
                      perfilAcesso={this.state.perfilAcesso}
                  />
                  </TabPane>
                  <TabPane tab="Funcionalidades" key="funcionalidade">
                    {constantes.TEXTO_FUNCIONALIDADE}
                    <Funcionalidade
                      idStatusProjeto={this.state.informacaoBasica.idStatus}
                      funcionalidadeTemp={this.state.funcionalidades}
                      funcionalidades={this.state.funcionalidades}
                      responsavelTemp={this.state.responsavelTemp}
                      responsaveis={this.state.responsaveis}
                      onUpdateState={this.onUpdateState}
                      tamanhoPaginacao={10}
                      soLeitura={this.state.soLeitura}
                      perfilAcesso={this.state.perfilAcesso}
                  />
                  </TabPane>
                  <TabPane tab="Anexos" key="anexo">
                    <Anexo
                      anexos={this.state.anexos}
                      anexosServidor={this.state.anexosServidor}
                      onUpdateState={this.onUpdateState}
                      soLeitura={this.state.soLeitura}
                      idStatusProjeto={this.state.informacaoBasica.idStatus}
                      perfilAcesso={this.state.perfilAcesso}
                  />
                  </TabPane>
                  <TabPane tab="Esclarecimentos/Observações" key="esclarecimento">
                    <EsclarecimentoLista
                      esclarecimentos={this.state.esclarecimentos}
                      fetchProjetoById={this.fetchProjetoById}
                      origemSolicitacao={constantes.ORIGEM_ABA_ESCLARECIMENTO}
                      idProjeto={this.props.match.params.id}
                  />
                  </TabPane>
                  {this.state.perfilAcesso.includes('DEV') && (
                  <TabPane tab="Atividades" key="atividade">
                    <Atividade
                      acessoNegado={this.state.acessoNegado}
                      projetos={this.state.projetos}
                      informacaoBasica={this.state.informacaoBasica}
                      funcionalidades={this.state.funcionalidades}
                      atividades={this.state.atividades}
                      responsaveis={this.state.responsaveis}
                      onUpdateState={this.onUpdateState}
                      idProjeto={this.props.match.params.id}
                      complexidades={this.state.complexidades}
                      prioridades={this.state.prioridades}
                      status={this.state.status}
                      tipos={this.state.tipos}
                    />
                  </TabPane>
                  )}
                </Tabs>
              ) : (
                <AcessoNegado />
              )}
          </Col>
        </Row>
        <ModalConcluirProjeto
          onOkFunction={this.gravarProjeto}
          onCancelFunction={this.gravarProjeto}
          changeStateFunction={this.mudaVisibilidadeModal}
          exibirModalStatusProjeto={this.state.exibirModalStatusProjeto}
        />
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  authState: state.app.authState,
});

export default connect(mapStateToProps, null)(ProjetoForm);
