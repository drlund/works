import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/ordemserv/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {    
    breadcrumbName: 'Ordem de Serviço',
  }
];

export const OrdemServConfig = {
  name: 'Ordem de Serviço',
  matomoTrackerId: 42,
  routes : [    
    {
      title: 'Minhas Ordens',      
      default: true,
      path: basePath + 'minhas-ordens',
      component: React.lazy(() => import('pages/ordemserv/minhasordens/MinhasOrdens.js')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {          
          breadcrumbName: 'Minhas Ordens',
        },      
      ]
    },

    {
      title: 'Assinar Ordem',
      path: basePath + 'assinar-ordem/:id',
      component: React.lazy(() => import('pages/ordemserv/minhasordens/AssinarOrdem')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          path: '/ordemserv/minhas-ordens',
          breadcrumbName: 'Minhas Ordens',
        },
        {          
          breadcrumbName: 'Assinar Ordem',
        },      
      ]
    },

    {
      title: 'Dar Ciência na Ordem',
      path: basePath + 'dar-ciencia-ordem/:id',
      component: React.lazy(() => import('pages/ordemserv/minhasordens/DarCienciaOrdem')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          path: '/ordemserv/minhas-ordens',
          breadcrumbName: 'Minhas Ordens',
        },
        {          
          breadcrumbName: 'Dar Ciência na Ordem',
        },      
      ]
    },

    {
      title: 'Revogar Ordem',
      path: basePath + 'revogar-ordem/:id',
      component: React.lazy(() => import('pages/ordemserv/minhasordens/RevogarOrdem')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          path: '/ordemserv/minhas-ordens',
          breadcrumbName: 'Minhas Ordens',
        },
        {          
          breadcrumbName: 'Revogar Ordem',
        },      
      ]
    },

    {
      title: 'Nova Ordem',
      path: basePath + 'nova-ordem',
      component: React.lazy(() => import('pages/ordemserv/gerenciarordem/NovaOrdem')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          path: '/ordemserv/minhas-ordens',
          breadcrumbName: 'Minhas Ordens',
        },
        {          
          breadcrumbName: 'Nova Ordem',
        },      
      ]
    },

    {
      title: 'Editar Ordem',
      path: basePath + 'editar-ordem/:id_ordem',
      component: React.lazy(() => import('pages/ordemserv/gerenciarordem/EditarOrdem')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          path: '/ordemserv/minhas-ordens',
          breadcrumbName: 'Minhas Ordens',
        },
        {          
          breadcrumbName: 'Editar Ordem',
        },      
      ]
    },

    // {
    //   title: 'Painel Gerencial',
    //   permissions: ['GERENCIAR'],
    //   default: true,
    //   path: basePath + 'painel-gerencial',
    //   component: React.lazy(() => import('pages/ordemserv/gerenciarordem/painel-gerencial/PainelGerencial')),
    //   breadcrumbRoutes: [
    //     ...baseBCRoutes,
    //     {          
    //       breadcrumbName: 'Painel Gerencial',
    //     },      
    //   ]
    // },

    {
      title: 'Visualizar Ordem',
      path: basePath + 'visualizar-ordem/:id',
      component: React.lazy(() => import('pages/ordemserv/gerenciarordem/VisualizarOrdemForm')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          path: '/ordemserv/minhas-ordens',
          breadcrumbName: 'Minhas Ordens',
        },
        {          
          breadcrumbName: 'Visualizar Dados da Ordem',
        },      
      ]
    },

    {
      title: 'Visualizar Ordem - Link Público',
      path: basePath + 'acesso-publico/:id',
      component: React.lazy(() => import('pages/ordemserv/gerenciarordem/VisualizarLinkPublicoForm')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          path: '/ordemserv/minhas-ordens',
          breadcrumbName: 'Minhas Ordens',
        },
        {          
          breadcrumbName: 'Visualizar Ordem via Link Público',
        },      
      ]
    },

    {
      title: 'Lista de Sugestões',
      path: basePath + 'ordens-analisadas',
      component: React.lazy(() => import('pages/ordemserv/minhasordens/OrdensAnalisadas')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          path: '/ordemserv/ordens-analisadas',
          breadcrumbName: 'Lista de Sugestões'
        }
      ]
    },

  ],
}

/**
 * Funcao que retorna a configuracao da rota padrao do aplicativo.
 */
export const getDefaultRoute = () => {
  let defRoute = null;
  OrdemServConfig.routes.filter(item => {
    return item.default ? defRoute = item : false;
  });

  return defRoute;
}