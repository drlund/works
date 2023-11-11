import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/painel-gestor';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'Painel Gestor 2.0',
  },
];

export const PainelGestorConfig = {
  title: 'Painel Gestor 2.0',
  matomoTrackerId: 49,
  logoFile: '/logos/painelGestor.svg',

  routes: [
    {
      title: 'Painel de Gestão Administrativa',
      path: `${basePath}`,
      secondaryLayout: true,
      permissions: ['ADM'],
      component: React.lazy(() => import('pages/painelGestor')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Acompanhamento dos Indicadores',
        },
      ],
    },
    {
      title: 'Log de Acessos',
      path: `${basePath}/log-acessos`,
      permissions: ['ADM_LOGS'],
      secondaryLayout: true,
      verifyAllPermissions: false,
      default: true,
      component: React.lazy(() => import('pages/painelGestor/LogAcessosTable')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Log de Acessos',
        },
      ],
    },
    {
      title: 'Log de Atualizações',
      path: `${basePath}/log-atualizacoes`,
      permissions: ['ADM_LOGS'],
      secondaryLayout: true,
      verifyAllPermissions: false,
      component: React.lazy(() => import('pages/painelGestor/LogAtualizacoesTable')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Log de Atualizações',
        },
      ],
    },
  ],
};

/**
 * Funcao que retorna a configuracao da rota padrao do aplicativo.
 */
export const getDefaultRoute = () => {
  let defRoute = null;
  PainelGestorConfig.routes.filter((item) =>
    item.default ? (defRoute = item) : false,
  );

  return defRoute;
};
