import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/designacao/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'Adição :: Designação Interina',
  }
];

export const DesignacaoConfig = {
  title: 'Designação Interina',
  matomoTrackerId: 48,

  routes: [
    {
      title: 'Pendências',
      default: true,
      path: basePath,
      component: React.lazy(() => import('pages/designacao/Manutencao')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Pendências',
        },
      ]
    },
  ],

};

/**
 * Funcao que retorna a configuracao da rota padrao do aplicativo.
 */
export const getDefaultRoute = () => {
  let defRoute = null;
  DesignacaoConfig.routes.filter((item) => (item.default ? (defRoute = item) : false));

  return defRoute;
};
