import React, { Component } from 'react';
import { ContainerOutlined, EyeOutlined } from '@ant-design/icons';
import { Tabs, Button, message, Tooltip } from 'antd';
import history from '../../history';
import { connect } from 'react-redux';
import { saveDemanda, validateDemanda } from 'services/actions/demandas';
import PageLoading from 'components/pageloading/PageLoading';
import _  from 'lodash';
import uuid from 'uuid/v4';
import styled from 'styled-components';

/** Componentes com o conteúdo das abas */

//lazy import dos componentes das abas
const PerguntasForm = React.lazy(() => import('./perguntas/PerguntasForm'));
const GeralForm = React.lazy(() => import('./geral/GeralForm'));
const ColaboradoresForm = React.lazy(() => import( './colaboradores/ColaboradoresForm'));
const PublicoAlvoForm = React.lazy(() => import( './publicoalvo/PublicoAlvoForm'));
const NotificacoesForm = React.lazy(() => import( './notificacoes/NotificacoesForm'));
const TabelaHistorico = React.lazy(() => import( './historico/TabelaHistorico'));
const VisualizarForm = React.lazy(() => import( './visualizarform/VisualizarFormulario'));

const TabPane = Tabs.TabPane;

const TabLabel = styled.label`
  color: !important;
  cursor: pointer;
  color: ${props => props.hasError && "red"}
`;

class DemandasForm extends Component {
  state = { saving: false, visualizarKey: uuid() }

  onTrySave = () => {
    //a validacao dos dados de todos os formularios encontra-se na 
    //implementacao do action
    this.setState({ saving: true }, this.onValidate);
  }

  onValidate = () => {
    this.props.validateDemanda({successCallback: this.onSave, errorCallback: this.onSaveError})
  }

  onSave = () => {
    setTimeout(() => {
      this.props.saveDemanda({successCallback: this.onSaveSuccess, errorCallback: this.onSaveError})
    }, 2000);
  }

  onCancel = () => {
    history.push('/demandas/minhas-demandas')
  }

  onSaveError = (errorMessage) => {
    message.error('Erro Retornado: ' + errorMessage, 7);
    this.setState({ saving: false });
  }

  onSaveSuccess = () => {
    message.success('Demanda salva com sucesso!', 7);
    this.setState({ saving: false });
  }

  renderActions = () => {
    return (
      <div>
      { this.props.demandaAtual.id && 
        <Tooltip title="Acompanhar demanda">
        <Button
          type="primary"
          ghost
          icon={<EyeOutlined />}
          onClick={ () => history.push(`/demandas/acompanhar-demanda/${this.props.demandaAtual.id}`)}
          style={{marginRight: "10px"}}
        />
        </Tooltip>
      }

      <Button 
        type="primary" 
        style={{marginRight: '10px'}}
        onClick={this.onTrySave}
        loading={this.state.saving}
      >
        Salvar
      </Button>

      <Button disabled={this.state.saving} onClick={this.onCancel}>Cancelar</Button>
      </div>
    );
  }

  onTabChange = (tabKey) => {
    if (tabKey === "visualizarForm") {
      this.setState({ visualizarKey: uuid()})
    }
  }

  render() {
    let tabKey = 0;

    if (this.state.saving) {
      return (
        <Tabs type="card" tabBarExtraContent={this.renderActions()}>
          <TabPane tab="Salvando a demanda..." key={tabKey++}>
            <PageLoading />
          </TabPane>
        </Tabs>
      )
    }

    return (
      <Tabs type="card" tabBarExtraContent={this.renderActions()} onChange={this.onTabChange}>        
        <TabPane tab={<TabLabel hasError={this.props.demandasErros.geral.length}>Geral</TabLabel>} 
          key={tabKey++}
        >
          <React.Suspense fallback={<PageLoading />}>
            <GeralForm />
          </React.Suspense>
        </TabPane>
        
        <TabPane tab={<TabLabel hasError={!_.isEmpty(this.props.demandasErros.perguntas)}>Perguntas</TabLabel>}
          key={tabKey++}
        >
          <React.Suspense fallback={<PageLoading />}>
            <PerguntasForm />
          </React.Suspense>
        </TabPane>

        <TabPane tab={<TabLabel hasError={!_.isEmpty(this.props.demandasErros.notificacoes)}>Gerenciar Notificações</TabLabel>} 
          key={tabKey++}>
          <React.Suspense fallback={<PageLoading />}>
            <NotificacoesForm />
          </React.Suspense>
        </TabPane>
        
        <TabPane tab={<TabLabel hasError={!_.isEmpty(this.props.demandasErros.publicoAlvo)}>Público Alvo</TabLabel>}
         key={tabKey++}>
          <React.Suspense fallback={<PageLoading />}>
            <PublicoAlvoForm />
          </React.Suspense> 
        </TabPane>

        <TabPane tab="Administradores" key={tabKey++}>
          <React.Suspense fallback={<PageLoading />}>
            <ColaboradoresForm />
          </React.Suspense>  
        </TabPane>

        <TabPane tab="Histórico" key={tabKey++}>
          <React.Suspense fallback={<PageLoading />}>
            <TabelaHistorico />
          </React.Suspense> 
        </TabPane>

        <TabPane tab={<React.Fragment><ContainerOutlined /> Visualizar Formulário</React.Fragment>} key="visualizarForm">
          <React.Suspense fallback={<PageLoading />}>
            <VisualizarForm key={this.state.visualizarKey}/>
          </React.Suspense> 
        </TabPane>

      </Tabs>
    );
  }
}

const mapStateToProperties = state => {
  return { demandaAtual: state.demandas.demanda_atual,
           demandasErros: state.demandas.demanda_erros }
}

export default connect(mapStateToProperties, {
  saveDemanda,
  validateDemanda
})(DemandasForm);
