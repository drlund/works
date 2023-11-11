import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/demandas/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {    
    breadcrumbName: 'Demandas',
  }
];

export const DemandasConfig = {
  name: 'Demandas',
  matomoTrackerId: 43,
  
  routes : [
    
    {
      title: 'Minhas Demandas',
      default: true,
      path: basePath + 'minhas-demandas',
      component: React.lazy(() => import('pages/demandas/MinhasDemandas')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {          
          breadcrumbName: 'Minhas Demandas',
        },      
      ]
    },

    {
      title: 'Criação de Nova Demanda',
      permissions: ['GERENCIAR_DEMANDAS'],
      path: basePath + 'nova-demanda',
      component: React.lazy(() => import('pages/demandas/NovaDemanda')),
      breadcrumbRoutes: [ 
        ...baseBCRoutes,
        {          
          breadcrumbName: 'Nova Demanda',
        },      
      ]
    },
    {
      title: 'Editar Demanda',
      permissions: ['GERENCIAR_DEMANDAS'],
      path: basePath + 'editar-demanda/:id_demanda',
      component: React.lazy(() => import('pages/demandas/EditarDemanda')),
      breadcrumbRoutes: [ 
        ...baseBCRoutes,
        {          
          breadcrumbName: 'Editar Demanda',
        },      
      ]
    },

    {
      title: 'Minhas Demandas como Autor/Colaborador',
      permissions: ['GERENCIAR_DEMANDAS'],
      path: basePath + 'minhas-demandas-adm',
      component: React.lazy(() => import('pages/demandas/AdmDemandas')),
      breadcrumbRoutes: [ 
        ...baseBCRoutes,
        {          
          breadcrumbName: 'Minhas Demandas (Autor)',
        },      
      ]
    },

    {
      title: 'Responder Demanda',
      path: basePath + 'responder-demanda/:id',
      component: React.lazy(() => import('pages/demandas/responder/ResponderDemanda')),
      breadcrumbRoutes: [ 
        ...baseBCRoutes,
        {          
          breadcrumbName: 'Responder Demanda',
        },      
      ]
    },
    {
      title: 'Visualizar Demanda',
      path: basePath + 'visualizar-demanda/:id',
      component: React.lazy(() => import('pages/demandas/responder/ResponderDemanda')),
      breadcrumbRoutes: [ 
        ...baseBCRoutes,
        {          
          breadcrumbName: 'Visualizar Demanda',
        },      
      ]
    },
    {
      title: 'Acompanhar Demanda',
      permissions: ['GERENCIAR_DEMANDAS'],
      path: basePath + 'acompanhar-demanda/:id',
      component: React.lazy(() => import('pages/demandas/AcompanharDemanda')),
      breadcrumbRoutes: [ 
        ...baseBCRoutes,
        {
          path: basePath + 'minhas-demandas-adm',
          breadcrumbName: 'Minhas Demandas (Autor)'
        },
        {          
          breadcrumbName: 'Acompanhar Demanda',
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
  DemandasConfig.routes.filter(item => {
    return item.default ? defRoute = item : false;
  });

  return defRoute;
}
