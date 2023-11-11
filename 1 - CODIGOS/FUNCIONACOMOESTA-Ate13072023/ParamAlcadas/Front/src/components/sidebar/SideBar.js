import { Button, Layout, Menu } from 'antd';
import moment from 'moment';
import { PropTypes } from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { toggleSideBar } from 'services/actions/commons';
import './SideBar.css';

import AmbienciaEntries from './menuEntries/AmbienciaEntries';
import ApiKeysEntries from './menuEntries/ApiKeysEntries';
import AutoridadesSecexEntries from './menuEntries/AutoridadesSecexEntries';
import BacenProcedentes from './menuEntries/BacenProcedentesEntries';
import CarrosselDeNoticiasEntries from './menuEntries/CarrosselDeNoticiasEntries';
import ControleDisciplinarEntries from './menuEntries/ControleDisciplinarEntries';
import DemandasEntries from './menuEntries/DemandasEntries';
import DesignacaoInterinaEntries from './menuEntries/DesignacaoInterinaEntries';
import EncantarEntries from './menuEntries/EncantarEntries';
import GestaoAcessosEntries from './menuEntries/GestaoAcessosEntries';
import HorasExtrasEntries from './menuEntries/HorasExtrasEntries';
import MovimentacoesEntries from './menuEntries/MovimentacoesEntries';
import MtnEntries from './menuEntries/MtnEntries';
import OrdemServicoEntries from './menuEntries/OrdemServicoEntries';
import PainelGestorEntries from './menuEntries/PainelGestorEntries';
import PatrociniosEntries from './menuEntries/PatrociniosEntries';
import ProcuracoesEntries from './menuEntries/ProcuracoesEntries';
import ProjetosEntries from './menuEntries/ProjetosEntries';
import TarifasEntries from './menuEntries/TarifasEntries';
import ValidacaoRHEntries from './menuEntries/ValidacaoRHEntries';
import FlexCriteriosEntries from './menuEntries/FlexCriteriosEntries';
import PodcastsEntries from './menuEntries/PodcastsEntries';

const { Sider } = Layout;

class SideBar extends PureComponent {
  constructor() {
    super();

    this.rootSubmenuKeys = [
      'demandas',
      'administracao',
      'mtn',
      'ctrlDiscipl',
      'desigInt',
      'validRH',
      'ordemserv',
      'bacenproc',
      'patrocinios',
      'autoridades-secex',
      'encantar',
      'hrXtra',
      'api-keys',
      'projetos',
      'procuracoes',
      'ambiencia',
      'painel',
      'carrossel',
      'flexCriterios',
      'podcasts',
    ];

    this.state = {
      openKeys: [],
    };

    this.outubro = moment().month() === 9 ? '#DCA09B' : '';
  }

  componentDidUpdate(prevProps, prevState) {
    const { sideBarCollapsed } = this.props;
    if (sideBarCollapsed && prevState.openKeys.length) {
      this.setState({ openKeys: [] });
    }
  }

  onOpenChange = (openKeys) => {
    const { openKeys: thisOpenKeys } = this.state;
    const latestOpenKey = openKeys.find(
      (key) => thisOpenKeys.indexOf(key) === -1,
    );

    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  customTrigger = () => {
    const {
      isFullScreenMode,
      toggleSideBar: thisToggleSideBar,
      sideBarCollapsed,
    } = this.props;
    if (!isFullScreenMode) {
      return null;
    }

    return (
      <Button onClick={() => thisToggleSideBar()}>
        {sideBarCollapsed ? '>' : '<'}
      </Button>
    );
  };

  render() {
    const {
      isFullScreenMode,
      sideBarCollapsed,
      toggleSideBar: thisToggleSideBar,
      title,
    } = this.props;
    const { openKeys } = this.state;
    const collapsedWidth = isFullScreenMode ? { collapsedWidth: 0 } : {};

    return (
      <Sider
        trigger={this.customTrigger()}
        collapsible
        collapsed={sideBarCollapsed}
        onBreakpoint={(broken) => {
          if (broken && !sideBarCollapsed) {
            thisToggleSideBar();
          }
        }}
        width={256}
        breakpoint="lg"
        {...collapsedWidth}
        className="sidebar-container"
        style={{
          overflow: 'auto',
          height: '100vh',
          left: 0,
          position: 'fixed',
        }}
      >
        <div
          className="sidebar-logo"
          style={{ backgroundColor: `${this.outubro}` }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/favicon.png`}
            alt="logo"
            width="32"
            height="32"
          />
          <h1>{title}</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          className="sidebar-menu"
          openKeys={openKeys}
          onOpenChange={this.onOpenChange}
        >
          {/* Entradas do Menus */}
          <AmbienciaEntries {...this.props} />
          <ApiKeysEntries {...this.props} />
          <AutoridadesSecexEntries {...this.props} />
          <BacenProcedentes {...this.props} />
          <CarrosselDeNoticiasEntries {...this.props} />
          <ControleDisciplinarEntries {...this.props} />
          <DemandasEntries {...this.props} />
          <DesignacaoInterinaEntries {...this.props} />
          <EncantarEntries {...this.props} />
          <GestaoAcessosEntries {...this.props} />
          <HorasExtrasEntries {...this.props} />
          <MovimentacoesEntries {...this.props} />
          <MtnEntries {...this.props} />
          <OrdemServicoEntries {...this.props} />
          <PainelGestorEntries {...this.props} />
          <PatrociniosEntries {...this.props} />
          <PodcastsEntries {...this.props} />
          <ProcuracoesEntries {...this.props} />
          <ProjetosEntries {...this.props} />
          <TarifasEntries {...this.props} />
          <ValidacaoRHEntries {...this.props} />
          <FlexCriteriosEntries {...this.props} />
        </Menu>
      </Sider>
    );
  }
}

/**
 * Props disponiveis para o componente.
 */
SideBar.propTypes = {
  title: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  sideBarCollapsed: state.app.sideBarCollapsed,
  isFullScreenMode: state.app.fullScreenMode,
  authState: state.app.authState,
});

export default connect(mapStateToProps, { toggleSideBar })(SideBar);
