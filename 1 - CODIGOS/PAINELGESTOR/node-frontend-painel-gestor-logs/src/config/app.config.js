import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/app/administrar/';

export const FERRAMENTAS_EM_MANUTENCAO = [];

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: 'acessos',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'Demandas',
  }
];

const AppConfig = {
  showBTLoader: (process.env.NODE_ENV === 'production'),
  routes: [
    {
      title: 'Administrar Acesso de Usuários/Dependências',
      default: true,
      path: basePath + 'acessos',
      component: React.lazy(() => import('pages/app/AcessosForm')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Acessos',
        },
      ]
    },
    {
      title: 'Administrar Permissões de Accesso das Ferramentas',
      default: false,
      path: basePath + 'permissoes',
      component: React.lazy(() => import('pages/app/PermissoesForm')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Permissoes de Acesso',
        },
      ]
    },

  ]
};

export default AppConfig;
