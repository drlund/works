import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/podcasts';
/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'Podcasts',
  },
];

export const PodcastsConfig = {
  title: 'Podcasts',
  name: 'Podcasts',
  routes: [
    {
      title: 'Podcasts',
      default: true,
      path: basePath,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/podcasts')),
      breadcrumbRoutes: [...baseBCRoutes, { breadcrumbName: 'Podcasts' }],
    },
    {
      title: 'Podcasts',
      default: true,
      path: `${basePath}/canal/:idCanal`,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/podcasts/Canal')),
      breadcrumbRoutes: [...baseBCRoutes, { breadcrumbName: 'Canal' }],
    },
  ],
};
