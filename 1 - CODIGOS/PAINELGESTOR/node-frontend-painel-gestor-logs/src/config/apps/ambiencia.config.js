import React from 'react';
import { ShopOutlined } from '@ant-design/icons';

const basePath = '/ambiencia/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <ShopOutlined />,
  },
  {
    breadcrumbName: 'Ambiência',
  },
];

export const AmbienciaConfig = {
  title: 'Ambiência',
  name: 'Ambiência',
  routes: [
    {
      title: 'Ambiência',
      path: basePath,
      secondaryLayout: true,
      permissions: ['AVALIADOR_GERAL', 'ADM'],
      component: React.lazy(() => import('pages/ambiencia/index.js')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Avaliação de Ambientes' },
      ],
    },
    {
      title: 'Avaliação Finalizada',
      path: basePath + 'avaliacao-finalizada/:idCampanha',
      secondaryLayout: true,
      permissions: ['AVALIADOR_GERAL', 'ADM'],
      component: React.lazy(() =>
        import('pages/ambiencia/FinalizarAvaliacao.js'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Avaliação Finalizada' },
      ],
    },
    {
      title: 'Campanha Finalizada',
      path: basePath + 'campanha-finalizada/:idCampanha',
      secondaryLayout: true,
      permissions: ['AVALIADOR_GERAL', 'ADM'],
      component: React.lazy(() =>
        import('pages/ambiencia/CampanhaFinalizada.js'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Campanha Finalizada' },
      ],
    },
    {
      title: 'Avaliação de ambientes',
      path: basePath + 'registrar-avaliacao/:idCampanha',
      secondaryLayout: true,
      permissions: ['AVALIADOR_GERAL', 'ADM'],
      component: React.lazy(() => import('pages/ambiencia/RegistrarAvaliacao')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Avaliação de Ambientes' },
      ],
    },
  ],
};
