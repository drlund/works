import React, { Component } from 'react';
import history from '../../history';
import { connect } from 'react-redux';
import {
  Divider,
  Switch,
  Space,
  Tooltip,
  Button,
  Badge,
  message,
  Skeleton,
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  fetchProjeto as getProjetoById,
  fetchListaProjetos,
  fetchListaAtividades,
  alterarAtividadeByCentral,
  gravarPausa,
} from 'services/ducks/Projetos.ducks';
import PageLoading from 'components/pageloading/PageLoading';
import { badgeColor } from './Helpers/CommonsFunctions';
import SearchTable from 'components/searchtable/SearchTable';
import ModalConcluirProjeto from './Components/ModalConcluirProjeto';
import ModalPausarAtividade from './Components/ModalPausarAtividade';
import AlfaSort from 'utils/AlfaSort';
import { constantes } from './Helpers/Constantes';

class CentralAtividades extends Component {
  state = {
    projetos: [],
    projetosNC: null,
    projetosC: null,
    atividades: [],
    atividadesNC: null,
    atividadesC: null,
    listaAtividades: null,
    atividadeSelecionada: { id: null },
    idNovoStatusAtividade: null,
    mostraTudo: false,
    exibirModalStatusProjeto: false,
    exibirModalPausa: false,
  };

  componentDidMount() {
    this.atualizaListaAtividades(
      this.props.authState.sessionData.chave,
      false,
      constantes.listaAtividadesNovaNaoConcluida,
    );
  }

  getAtividadesNaoConcluidas = async (matricula) => {
    try {
      const atividades = fetchListaAtividades(
        matricula,
        constantes.statusNaoConcluidos,
      );
      const projetos = fetchListaProjetos(true, constantes.statusNaoConcluidos);

      const [atividadesNC, projetosNC] = await Promise.all([
        atividades,
        projetos,
      ]);

      const atividadesOrdenadas = atividadesNC.sort((a, b) => {
        if(a.situacao.toLocaleLowerCase() < b.situacao.toLocaleLowerCase()) return -1;
        if(a.situacao.toLocaleLowerCase() > b.situacao.toLocaleLowerCase()) return 1;
        return 0;
      })

      return [atividadesOrdenadas, projetosNC];
    } catch (error) {
      message.error(error);
    }
  };

  getAtividadesConcluidas = async (matricula) => {
    const atividades = await fetchListaAtividades(
      matricula,
      constantes.statusConcluido,
    );
    const projetos = await fetchListaProjetos(true, constantes.statusConcluido);
    const [atividadesC, projetosC] = await Promise.all([atividades, projetos]);

    return [atividadesC, projetosC];
  };

  atualizaListaAtividades = async (matricula, mostraTudo, tipoSolicitacao) => {
    let atividadesNC;
    let atividadesC;
    let projetosNC;
    let projetosC;
    let listaAtividades;
    this.setState({ listaAtividades: null }, async () => {
      switch (tipoSolicitacao) {
        case constantes.listaAtividadesNovaNaoConcluida:
          [atividadesNC, projetosNC] = await this.getAtividadesNaoConcluidas(
            matricula,
          );
          this.setState({
            projetos: projetosNC,
            projetosNC,
            atividadesNC,
            listaAtividades: atividadesNC,
            mostraTudo,
          });
          break;

        case constantes.listaAtividadesNovaConcluida:
          [atividadesC, projetosC] = await this.getAtividadesConcluidas(
            matricula,
          );
          this.setState({
            projetos: this.state.projetosNC.concat(projetosC),
            projetosC,
            atividadesC,
            listaAtividades: this.state.atividadesNC.concat(atividadesC),
            mostraTudo,
          });
          break;

        case constantes.listaAtividadesAtualizaNaoConcluida:
          [atividadesNC, projetosNC] = await this.getAtividadesNaoConcluidas(
            matricula,
          );
          listaAtividades = mostraTudo
            ? atividadesNC.concat(this.state.atividadesC)
            : atividadesNC;
          this.setState({
            projetos: projetosNC.concat(this.state.projetosC),
            projetosNC,
            atividadesNC,
            listaAtividades,
            mostraTudo,
          });
          break;

        case constantes.listaAtividadesAtualizaConcluida:
          [atividadesNC, projetosNC] = await this.getAtividadesNaoConcluidas(
            matricula,
          );
          [atividadesC, projetosC] = await this.getAtividadesConcluidas(
            matricula,
          );
          listaAtividades = mostraTudo
            ? atividadesNC.concat(atividadesC)
            : atividadesNC;
          this.setState({
            projetos: projetosNC.concat(projetosC),
            projetosNC,
            projetosC,
            atividadesNC,
            atividadesC,
            listaAtividades,
            mostraTudo,
          });
          break;

        case constantes.listaAtividadesExibeNaoConcluida:
          this.setState({
            listaAtividades: this.state.atividadesNC,
            mostraTudo,
          });
          break;

        case constantes.listaAtividadesExibeConcluida:
          this.setState({
            listaAtividades: this.state.atividadesNC.concat(
              this.state.atividadesC,
            ),
            mostraTudo,
          });
          break;

        default:
          return;
      }
    });
  };

  setDefaultValues = () => {
    this.setState({
      atividadeSelecionada: { id: null },
      idNovoStatusAtividade: null,
      exibirModalStatusProjeto: false,
      exibirModalPausa: false,
    });
  };

  setAtividadeSelecionada = (idAtividade) => {
    return this.state.listaAtividades.find(
      (atividade) => atividade.id === idAtividade,
    );
  };

  confirmarAlteracaoAtividade = async (idAtividade, idNovoStatusAtividade) => {
    const atividadeSelecionada = this.setAtividadeSelecionada(idAtividade);
    const projeto = await getProjetoById(atividadeSelecionada.idProjeto);
    let exibirModal = false;
    const statusAtividades = projeto.atividades.map((atividade) => {
      if (atividade.id === idAtividade) {
        // atualiza o status na lista de status
        atividade.idStatus = idNovoStatusAtividade;
        // atualiza o status na atividade
        atividadeSelecionada.idStatus = idNovoStatusAtividade;
      }
      return atividade.idStatus;
    });
    if (
      statusAtividades.every((estado) => estado === constantes.statusConcluido)
    ) {
      exibirModal = true;
    }
    if (!exibirModal) {
      await this.alterarAtividade(false, atividadeSelecionada);
    } else {
      this.setState({
        exibirModalStatusProjeto: exibirModal,
        atividadeSelecionada,
      });
    }
  };

  visibilidadeModalConcluirProjeto = (visivel) => {
    this.setState({ exibirModalStatusProjeto: visivel });
  };

  visibilidadeModalPausa = (valor) => {
    this.setState({ exibirModalPausa: valor });
  };

  incluirPausa = async (pausa) => {
    // chamar rota para pausa
    try {
      await gravarPausa(pausa);
      message.success('Pausa incluída com sucesso.');
    } catch (error) {
      message.error('Falha ao incluir a pausa. Tente novamente');
    }
    this.setDefaultValues();

    this.atualizaListaAtividades(
      this.props.authState.sessionData.chave,
      this.state.mostraTudo,
      constantes.listaAtividadesNovaNaoConcluida,
    );
  };

  alterarAtividade = async (
    encerrarProjeto,
    atividadeSelecionada = this.state.atividadeSelecionada,
  ) => {
    const atividadeAlterada = await alterarAtividadeByCentral(
      atividadeSelecionada.idProjeto,
      encerrarProjeto
        ? constantes.statusConcluido
        : atividadeSelecionada.projeto.idStatus,
      atividadeSelecionada.id,
      atividadeSelecionada.idStatus,
    )
    await this.atualizaListaAtividades(
      this.props.authState.sessionData.chave,
      this.state.mostraTudo,
      constantes.listaAtividadesAtualizaConcluida,
    )
      .then(() => {
        message.success(atividadeAlterada);
        this.setState({
          exibirModalStatusProjeto: false,
          atividadeSelecionada: atividadeSelecionada,
        });
      })
      .catch(() => {
        message.error('Falha ao alterar a atividade.');
      });
  };

  columns = [
    {
      title: 'Projeto',
      dataIndex: 'projeto',
      key: 'projeto',
      render: (record) => record.titulo,
      sorter: (a, b) => AlfaSort(a.idProjeto, b.idProjeto),
    },
    {
      title: 'Funcionalidade',
      dataIndex: 'funcionalidade',
      key: 'funcionalidade',
      render: (record) => record.titulo,
      sorter: (a, b) => AlfaSort(a.idFuncionalidade, b.idFuncionalidade),
    },
    {
      title: 'Atividade',
      dataIndex: 'titulo',
      key: 'atividade',
      sorter: (a, b) => AlfaSort(a.titulo, b.titulo),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (text, record) => (
        <Badge
          count={text}
          style={{ backgroundColor: badgeColor(record.idStatus) }}
        />
      ),
      sorter: (a, b) => AlfaSort(a.idStatus, b.idStatus),
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
      key: 'situacao',
      align: 'center',
      render: (text, record) => (
        <Badge
          count={text}
          style={{ backgroundColor: badgeColor(record.idSituacao) }}
        />
      ),
      sorter: (a, b) => AlfaSort(a.idStatus, b.idStatus),
    },
    {
      title: 'Prazo',
      dataIndex: 'prazoRestante',
      key: 'prazo',
      align: 'center',
      render: (text, record) => {
        if (record.idStatus === constantes.statusNaoIniciado) {
          return record.prazo + record.prazoPausas;
        }
        return text;
      },
    },
    {
      title: 'Ações',
      key: 'acoes',
      width: '10%',
      align: 'center',
      render: (text, record) => (
        <Space>
          <Tooltip title="Iniciar Atividade">
            <Button
              disabled={
                record.idStatus === constantes.statusNaoIniciado ? false : true
              }
              type="text"
              icon={
                <PlayCircleOutlined
                  style={{ color: badgeColor(constantes.statusEmAndamento) }}
                />
              }
              onClick={() =>
                this.confirmarAlteracaoAtividade(
                  record.id,
                  constantes.statusEmAndamento,
                )
              }
            />
          </Tooltip>
          <Tooltip title="Pausar Atividade">
            <Button
              disabled={
                record.idStatus === constantes.statusEmAndamento ? false : true
              }
              type="text"
              icon={
                <PauseCircleOutlined
                  style={{
                    color: badgeColor(
                      constantes.statusAguardandoEsclarecimento,
                    ),
                  }}
                />
              }
              onClick={() => {
                this.setState(
                  {
                    atividadeSelecionada: this.setAtividadeSelecionada(
                      record.id,
                    ),
                  },
                  this.visibilidadeModalPausa(true),
                );
              }}
            />
          </Tooltip>
          <Tooltip title="Encerrar Atividade">
            <Button
              disabled={
                record.idStatus === constantes.statusEmAndamento ? false : true
              }
              type="text"
              icon={
                <CheckCircleOutlined
                  style={{ color: badgeColor(constantes.statusConcluido) }}
                />
              }
              onClick={() =>
                this.confirmarAlteracaoAtividade(
                  record.id,
                  constantes.statusConcluido,
                )
              }
            />
          </Tooltip>
          <Tooltip title="Visualizar Projeto">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: constantes.bbAzul }} />}
              onClick={() =>
                history.push(`/projetos/visualizar-projeto/${record.idProjeto}`)
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  isNovaRequisicao = (mostraTudo) => {
    if (mostraTudo && !this.state.atividadesC) {
      return constantes.listaAtividadesNovaConcluida;
    }
    if (mostraTudo && this.state.atividadesC) {
      return constantes.listaAtividadesExibeConcluida;
    }
    if (!mostraTudo && !this.state.atividadesNC) {
      return constantes.listaAtividadesNovaNaoConcluida;
    }
    if (!mostraTudo && this.state.atividadesNC) {
      return constantes.listaAtividadesExibeNaoConcluida;
    }
  };

  render() {
    return (
      <>
        <Divider orientation="right">
          Mostrar Todos{' '}
          <Switch
            checked={this.state.mostraTudo}
            checkedChildren="Sim"
            unCheckedChildren="Não"
            onChange={(check) => {
              this.atualizaListaAtividades(
                this.props.authState.sessionData.chave,
                check,
                this.isNovaRequisicao(check),
              );
            }}
          />
        </Divider>
        <SearchTable
          dataSource={this.state.listaAtividades}
          columns={this.columns}
          locale={{
            emptyText: !this.state.listaAtividades && (
              <>
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
              </>
            ),
          }}
          loading={
            !this.state.listaAtividades
              ? { spinning: true, indicator: <PageLoading /> }
              : false
          }
        />
        <ModalConcluirProjeto
          onOkFunction={this.alterarAtividade}
          onCancelFunction={this.alterarAtividade}
          changeStateFunction={this.visibilidadeModalConcluirProjeto}
          exibirModalStatusProjeto={this.state.exibirModalStatusProjeto}
        />
        <ModalPausarAtividade
          projetos={this.state.projetos}
          idAtividadePausada={this.state.atividadeSelecionada.id}
          exibirModalPausa={this.state.exibirModalPausa}
          onOkFunction={this.incluirPausa}
          onCancelFunction={this.visibilidadeModalPausa}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authState: state.app.authState,
  };
};

export default connect(mapStateToProps, null)(CentralAtividades);
