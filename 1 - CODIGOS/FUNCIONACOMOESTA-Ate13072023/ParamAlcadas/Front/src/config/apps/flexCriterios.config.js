import React from 'react';
import { UserSwitchOutlined } from '@ant-design/icons';

const basePath = '/flex-criterios';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <UserSwitchOutlined />,
  },
  {
    breadcrumbName: 'Flexibilização de Critérios',
    // path: basePath,
  },
];

export const FlexCriteriosConfig = {
  title: 'Flexibilização de Critérios',
  name: 'Flexibilização de Critérios',

  routes: [
    {
      title: 'Consultar',
      path: basePath,
      // permissions: [
      //   'SOLICITANTE',
      //   'MANIFESTANTE',
      //   'ANALISTA',
      //   'DESPACHANTE',
      //   'DEFERIDOR',
      //   'EXECUTANTE',
      //   'ROOT',
      // ],
      // verifyAllPermissions: false,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/flexCriterios')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Consultar',
        },
      ],
    },
    {
      title: 'Incluir',
      default: true,
      path: `${basePath}/incluir`,
      // permissions: [
      //   'SOLICITANTE',
      //   'MANIFESTANTE',
      //   'ANALISTA',
      //   'DESPACHANTE',
      //   'DEFERIDOR',
      //   'ROOT',
      // ],
      // verifyAllPermissions: false,
      secondaryLayout: true,
      component: React.lazy(() =>
        import('pages/flexCriterios/components/incluir/inclusao'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Incluir',
        },
      ],
    },
    {
      title: 'Resumo do Pedido',
      default: true,
      path: `${basePath}/resumo/:idFlex`,
      // permissions: [
      //   'SOLICITANTE',
      //   'MANIFESTANTE',
      //   'ANALISTA',
      //   'DESPACHANTE',
      //   'DEFERIDOR',
      //   'EXECUTANTE',
      //   'ROOT',
      // ],
      // verifyAllPermissions: false,
      secondaryLayout: true,
      component: React.lazy(() =>
        import('pages/flexCriterios/components/detalhar/resumoPedido'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Deferir',
        },
      ],
    },
    {
      title: 'Manifestação',
      default: true,
      path: `${basePath}/manifestar/:idFlex`,
      // permissions: [
      //   'MANIFESTANTE',
      //   'ANALISTA',
      //   'DESPACHANTE',
      //   'DEFERIDOR',
      //   'EXECUTANTE',
      //   'ROOT',
      // ],
      // verifyAllPermissions: false,
      secondaryLayout: true,
      component: React.lazy(() =>
        import('pages/flexCriterios/components/manifestar/manifestacoes'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Manifestar',
        },
      ],
    },
    {
      title: 'Detalhes da Solicitação',
      default: true,
      path: `${basePath}/detalhar/:idFlex`,
      // permissions: [
      //   'SOLICITANTE',
      //   'MANIFESTANTE',
      //   'ANALISTA',
      //   'DESPACHANTE',
      //   'DEFERIDOR',
      //   'EXECUTANTE',
      //   'ROOT',
      // ],
      // verifyAllPermissions: false,
      secondaryLayout: true,
      component: React.lazy(() =>
        import('pages/flexCriterios/components/detalhar/detalhePedido'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Detalhes do Pedido',
        },
      ],
    },
  ],
};
