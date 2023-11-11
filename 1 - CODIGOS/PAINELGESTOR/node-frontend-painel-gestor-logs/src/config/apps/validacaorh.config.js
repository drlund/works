import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/validacaorh/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'Validação RH',
  }
];

export const ValidacaoRHConfig = {
  title: 'Validação RH',
  matomoTrackerId: 50,

  routes: [
    {
      title: 'Validação RH',
      default: true,
      path: basePath,
      component: React.lazy(() => import('pages/designacao/ValidacaoRH')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Validação RH',
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
  ValidacaoRHConfig.routes.filter((item) => (item.default ? (defRoute = item) : false));

  return defRoute;
};
