import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/elogios/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {    
    breadcrumbName: 'Elogios',
  }
];

export const ElogiosConfig = {
  title: 'Elogios', 
  name: 'Elogios',
  
  routes : [
    
    {
      title: 'Novo Elogio',
      default: true,
      path: basePath + 'registrar-elogio',
      component: React.lazy(() => import('pages/elogios/RegistrarElogio')),
      permissions: ['REGISTRAR_ELOGIO'],
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {          
          breadcrumbName: 'Registrar Elogio',
        },      
      ]
    },

    {
      title: 'Editar Elogio',
      path: basePath + 'editar-elogio/:id',
      component: React.lazy(() => import('pages/elogios/EditarElogio')),
      permissions: ['REGISTRAR_ELOGIO'],
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {          
          breadcrumbName: 'Editar Elogio',
        },      
      ]
    },

    {
      title: 'Lista de Elogios',
      path: basePath + 'lista-elogios',
      component: React.lazy(() => import('pages/elogios/AutorizacaoElogiosForm')),
      permissions: ['REGISTRAR_ELOGIO'],
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {          
          breadcrumbName: 'Visualizar ou Autorizar Envio de Elogios',
        },      
      ]
    },
    
    {
      title: 'Histórico Elogios',
      path: basePath + 'historico-elogios',
      component: React.lazy(() => import('pages/elogios/HistoricoElogios')),
      permissions: ['REGISTRAR_ELOGIO'],
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {          
          breadcrumbName: 'Histórico Elogios',
        },      
      ]
    },

    {
      title: 'Histórico de ODI\'s',
      path: basePath + 'historico-odi',
      component: React.lazy(() => import('pages/elogios/HistoricoODI')),
      permissions: ['REGISTRAR_ELOGIO', 'VER_HISTORICO_ODI'],
      verifyAllPermissions: true,
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {          
          breadcrumbName: 'Histórico de ODI\'',
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
  ElogiosConfig.routes.filter(item => {
    return item.default ? defRoute = item : false;
  });

  return defRoute;
}
