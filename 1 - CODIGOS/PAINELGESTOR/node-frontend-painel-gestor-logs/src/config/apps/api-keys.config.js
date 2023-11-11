import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/api-keys/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {    
    breadcrumbName: 'Chaves de API',
  }
];

export const APIKeysConfig = {
  title: 'Chaves de API',  
  name: 'Chaves de API',

  routes : [
    {
      title: 'Consulta de Chaves',
      path: basePath + 'consultar-chaves',
      permissions: ['GERENCIAR_CHAVES'],
      component: React.lazy(() => import('pages/api-keys/ListaChaves')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Consulta de Chaves'
        }
      ]
    }
  ]
}