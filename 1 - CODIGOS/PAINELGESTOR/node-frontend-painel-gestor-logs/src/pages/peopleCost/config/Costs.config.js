import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/costs';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'Custo de Reunião',
    path: basePath,
  },
];

export const CostsConfig = {
  title: 'Custo de Reunião',
  name: 'costs',

  routes: [
    {
      title: 'Esta reunião poderia ser um email?',
      default: true,
      path: `${basePath}/meeting`,
      secondaryLayout: true,
      component: React.lazy(() => import('@/pages/peopleCost/MeetingCost')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
      ],
    },
    {
      title: 'Eficiência',
      default: true,
      path: `${basePath}/efficiency`,
      secondaryLayout: true,
      component: React.lazy(() => import('@/pages/peopleCost/EfficiencyCost')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
      ],
    },
  ],
};

/**
 * Funcao que retorna a configuracao da rota padrao do aplicativo.
 */
export const getDefaultRoute = () => CostsConfig.routes.find((item) => item.default);
