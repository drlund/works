import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/autoridades/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {    
    breadcrumbName: 'Autoridades Secex',
  }
];

export const AutoridadesSecexConfig = {
  title: 'Autoridades Secex',  
  name: 'Autoridades Secex',

  routes : [
    {
      title: 'Público Alvo',
      path: basePath + 'publico-alvo',
      permissions: ['USUARIO'],
      component: React.lazy(() => import('pages/autoridadessecex/PublicoAlvo')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Público Alvo',
        }
      ]
    },
    {
      title: 'Dados de Autoridades',
      path: basePath + 'dados-autoridades',
      permissions: ['USUARIO'],
      component: React.lazy(() => import('pages/autoridadessecex/DadosAutoridades')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Dados de Autoridades',
        }
      ]
    },
    {
      title: 'Aniversários de Autoridades',
      path: basePath + 'consulta-aniversarios',
      component: React.lazy(() => import('pages/autoridadessecex/ConsultaAniversarios')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Aniversários de Autoridades',
        }
      ]
    }
  ]
}