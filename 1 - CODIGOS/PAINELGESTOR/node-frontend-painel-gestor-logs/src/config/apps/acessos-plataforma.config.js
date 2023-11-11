import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/acessos-plataforma/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'Acessos Plataforma',
  }
];

export const AcessosPlataformaConfig = {
  title: 'Acessos Plataforma',
  routes : [

    {
      title: 'Acessos',
      default: true,
      path: basePath + 'acessos',
      component: React.lazy(() => import('pages/acessos-plataforma/AcessosForm')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Acessos',
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
  AcessosPlataformaConfig.routes.filter(item => {
    return item.default ? defRoute = item : false;
  });

  return defRoute;
}
