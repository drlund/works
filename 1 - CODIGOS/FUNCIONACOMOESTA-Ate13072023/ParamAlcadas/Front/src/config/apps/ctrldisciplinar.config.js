import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/ctrldisciplinar/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'Controle Disciplinar',
  }
];

export const CtrlDisciplinarConfig = {
  name: 'Controle Disciplinar',
  routes : [

    {
      title: 'Lista de Demandas Disciplinares',
      permissions: ['VISUALIZAR', 'ATUALIZAR'],
      default: true,
      path: basePath + 'demandas',
      component: React.lazy(() => import('pages/ctrldisciplinar/Demandas/')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Demandas',
        },
      ]
    },
    {
      title: 'Lista de Demandas Disciplinares :: Administrador',
      default: true,
      path: basePath + 'gerdemandas',
      component: React.lazy(() => import('pages/ctrldisciplinar/GerDemandas/')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Demandas :: Administrador',
        },
      ]
    },
    {
      title: 'Histórico de Demandas Disciplinares',
      permissions: ['VISUALIZAR', 'ATUALIZAR'],
      default: true,
      path: basePath + 'histdemandas',
      component: React.lazy(() => import('pages/ctrldisciplinar/HistDemandas/')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Histórico',
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
  CtrlDisciplinarConfig.routes.filter(item => {
    return item.default ? defRoute = item : false;
  });

  return defRoute;
}
