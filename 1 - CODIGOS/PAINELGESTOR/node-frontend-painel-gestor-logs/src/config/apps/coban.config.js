import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/coban/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'COBAN',
  }
];

export const CobanConfig = {
  title: 'COBAN',
  logoFile: '/logos/coban.svg',

  routes : [

    {
      title: 'Formulário COBAN',
      default: true,
      path: basePath + 'form',
      component: React.lazy(() => import('pages/coban/Coban/')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Form COBAN',
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
  CobanConfig.routes.filter(item => {
    return item.default ? defRoute = item : false;
  });

  return defRoute;
}
