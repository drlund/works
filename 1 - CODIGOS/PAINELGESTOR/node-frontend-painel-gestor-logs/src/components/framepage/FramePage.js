/**
 * Wrapper dos elementos da Pagina Corrente a ser exbida na aplicacao.
 */
import React, { Component } from 'react';
import { Layout, BackTop } from 'antd';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import './FramePage.css';
import menuConfig, { DefaultPage } from 'config/menu.config';
import PgHeader from 'components/pageheader/PgHeader';
import PageLoading from 'components/pageloading/PageLoading';
import PageNotFound from 'pages/errors/PageNotFound';
import AccessDenied from 'pages/errors/AccessDenied';
import NotAuthenticated from 'pages/errors/NotAuthenticated';
import { verifyPermission } from 'utils/Commons';
import FerramentaEmManutencao from '@/pages/FerramentaEmManutencao';

const { Content } = Layout;

class FramePage extends Component {
  /**
   * Metodo especifico que renderiza o header descritivo da pagina
   * conforme definições passadas em routeCfg.
   */

  renderPageHeader = (routeCfg) => {
    const title = routeCfg.title ? routeCfg.title : null;
    const subTitle = routeCfg.subTitle ? routeCfg.subTitle : null;
    const breadcrumbRoutes = routeCfg.breadcrumbRoutes
      ? routeCfg.breadcrumbRoutes
      : null;

    if (!title) return null;

    return (
      <PgHeader title={title} subTitle={subTitle} routes={breadcrumbRoutes} />
    );
  };

  /**
   * Metodo que renderiza o header e o conteudo da pagina selecionada
   * pela rota de acordo com as configurações definidas em routeCfg.
   */
  renderPageContent = ({ routeCfg, props, name, trackerId }) => {
    const { authState, appsStatus, configureTrackerId } = this.props;
    const PageContent = routeCfg.component;

    if (!authState.isLoggedIn) {
      // vai para a pagina de solicitacao de login
      return <NotAuthenticated />;
    }

    const statusEmManutencao = 2;
    const statusDesativada = 3;
    const pathEmManutencao = appsStatus?.find((elem) => {
      return (
        routeCfg.path.includes(elem.rootPath) &&
        (elem.codigoStatus == statusEmManutencao ||
          elem.codigoStatus == statusDesativada)
      );
    });

    if (pathEmManutencao) {
      return <FerramentaEmManutencao />;
    }

    if (name && routeCfg.permissions) {
      // foram passados os parametros de permissao da ferramenta
      // verficando acesso na rota...
      const hasPermission = verifyPermission({
        ferramenta: name,
        permissoesRequeridas: routeCfg.permissions,
        authState,
        verificarTodas: routeCfg.verifyAllPermissions
          ? routeCfg.verifyAllPermissions
          : false,
      });

      if (!hasPermission) {
        // vai para a pagina de acesso negado
        return (
          <AccessDenied
            nomeFerramenta={`${name} - ${routeCfg.path}`}
            extraText={routeCfg.noPermissionMessage}
          />
        );
      }
    }

    if (trackerId) {
      // id do matomo configurado na ferramenta.
      configureTrackerId(trackerId);
    }

    return (
      <>
        {this.renderPageHeader(routeCfg)}
        <Content
          className={
            routeCfg.secondaryLayout === true
              ? 'framepage-main-secondary'
              : 'framepage-main'
          }
        >
          <React.Suspense fallback={<PageLoading />}>
            <PageContent {...props} />
          </React.Suspense>
        </Content>
      </>
    );
  };

  renderAllRoutes = () => {
    const routeItems = Object.keys(menuConfig).map(
      (menuKey) => menuConfig[menuKey],
    );

    return routeItems.map((item) =>
      item.routes.map((route) => (
        <Route
          path={route.path}
          exact
          render={(props) =>
            this.renderPageContent({
              routeCfg: route,
              props,
              name: item.name,
              trackerId: item.matomoTrackerId,
            })
          }
        />
      )),
    );
  };

  render() {
    const defPage = DefaultPage || { component: PageNotFound };

    return (
      <>
        <BackTop />
        <Switch>
          <Route
            path="/"
            exact
            render={() => this.renderPageContent({ routeCfg: defPage })}
          />
          {this.renderAllRoutes()}
          <Route path="*" component={PageNotFound} />
        </Switch>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  authState: state.app.authState,
  appsStatus: state.app.appsStatus,
});

export default connect(mapStateToProps, {})(FramePage);
