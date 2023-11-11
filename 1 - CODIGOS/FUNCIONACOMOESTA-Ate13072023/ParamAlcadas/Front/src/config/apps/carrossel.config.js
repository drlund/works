import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/carrossel/';
/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'Carrossel de Notícias',
  },
];

export const CarrosselConfig = {
  title: 'Carrossel',
  name: 'Carrossel',
  routes: [
    {
      title: 'Gestão',
      path: basePath,
      secondaryLayout: true,
      //   permissions: ["USUARIO", "ADM"],
      component: React.lazy(() => import('pages/carrossel/index')),
      breadcrumbRoutes: [...baseBCRoutes, { breadcrumbName: 'Gestão' }],
    },
    {
      title: 'Player',
      path: `${basePath}PlayerVideo`,
      secondaryLayout: true,
      //   permissions: ["USUARIO", "ADM"],
      component: React.lazy(() => import('pages/carrossel/components/PlayerVideo')),
      breadcrumbRoutes: [...baseBCRoutes, { breadcrumbName: 'Player Vídeos' }],
    }
  ],
};
