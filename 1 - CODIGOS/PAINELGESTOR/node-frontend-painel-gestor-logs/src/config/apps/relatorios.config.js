import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/relatorios/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'Relatórios',
  }
];

export const RelatoriosConfig = {
  title: 'Relatórios',
  logoFile: '/logos/relatorios.svg',
  name: 'Relatórios Gerenciais',

  routes : [

    {
      title: 'Relatórios Gerenciais',
      default: true,
      path: basePath,
      component: React.lazy(() => import('pages/relatorios/index.js')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Relatórios Gerenciais',
        },
      ]
    }
  ],

}

/**
 * Funcao que retorna a configuracao da rota padrao do aplicativo.
 */
export const getDefaultRoute = () => {
  let defRoute = null;
  RelatoriosConfig.routes.filter(item => {
    return item.default ? defRoute = item : false;
  });

  return defRoute;
}
