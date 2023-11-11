import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/bacenproc/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {    
    breadcrumbName: 'Bacen Procedentes',
  }
];

export const BacenProcConfig = {
  title: 'Bacen Procedentes',  
  name: 'Bacen Procedentes',

  routes : [
    {
      title: 'Acompanhamento Bacen Procedentes',
      path: basePath + 'Acompanhamento',
      permissions: ['USUARIO'],
      component: React.lazy(() => import('pages/bacenproc/Acompanhamento')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Acompanhamento Bacen Procedentes',
        }
      ]
    }
  ]
}