import React from 'react';
import { ToolOutlined, UserSwitchOutlined } from '@ant-design/icons';

const basePath = '/gerenciador-ferramentas';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <ToolOutlined />,
  },
  {
    breadcrumbName: 'Gerenciador de ferramentas',
    // path: basePath,
  },
];

export const GerenciadorFerramentasConfig = {
  title: 'Gerenciador de Ferramentas',
  name: 'Gerenciador de Ferramentas',

  routes: [
    {
      title: 'Gestão das ferramentas',
      path: basePath,
      permissions: ['ADMIN'],
      secondaryLayout: true,
      component: React.lazy(() => import('@/pages/gerenciador-ferramentas')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        /*  {
          breadcrumbName: 'Gestão',
        }, */
      ],
    },
  ],
};
