import React from 'react';
import { HomeOutlined } from '@ant-design/icons';


const basePath = '/hrxtra/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'Gerenciamento de Horas Extras',
  }
];

export const HrXtraConfig = {
  title: 'Hora Extra',
  logoFile: '/logos/designacao.svg',

  routes: [
    {
      title: 'Acompanhamento de Solicitações',
      default: true,
      path: basePath + 'acompanhamento',
      component: React.lazy(() => import('pages/hrxtra/Acompanhamento/')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Acompanhamento',
        },
      ]
    },
  ],

}

/**
 * Funcao que retorna a configuracao da rota padrao do aplicativo.
 */
export const getDefaultRoute = () => {
  let defRoute = null;
  HrXtraConfig.routes.filter(item => {
    return item.default ? defRoute = item : false;
  });

  return defRoute;
}
