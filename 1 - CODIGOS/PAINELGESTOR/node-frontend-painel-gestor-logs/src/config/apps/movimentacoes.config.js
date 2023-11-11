// @ts-nocheck
import React from 'react';
import { SettingOutlined } from '@ant-design/icons';

const EM_MANUTENCAO = false;

const basePath = '/movimentacoes/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <SettingOutlined />,
  },
  {
    breadcrumbName: 'Movimentações',
  },
];

export const MovimentacoesConfig = {
  title: 'Movimentações',
  name: 'Movimentações',

  routes: [
    // QUORUM
    {
      title: 'Gerenciar Quórum',
      path: `${basePath}gerenciar-quorum/`,
      permissions: ['ADM_QUORUM_PROPRIO', 'ADM_QUORUM_QUALQUER'],
      secondaryLayout: true,
      verifyAllPermissions: false,
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() => import('pages/movimentacoes/QuorumForm')),
      // alterar futuramente quando alterar index.js
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Gerenciar Quórum',
        },
      ],
    },

    // JURISDICAO
    {
      title: 'Gerenciar Jurisdição',
      path: `${basePath}gerenciar-jurisdicao/`,
      permissions: ['ADM_JURISDICAO_PROPRIA', 'ADM_JURISDICAO_QUALQUER'],
      secondaryLayout: true,
      verifyAllPermissions: false,
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() =>
            import('pages/movimentacoes/Jurisdicao/JurisdicaoForm'),
          ),
      // alterar futuramente quando alterar index.js
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Gerenciar Jurisdição',
        },
      ],
    },

    // PARAMETRIZACOES
    {
      title: 'Parametrização das Alçadas',
      path: `${basePath}parametrizacao-das-alcadas/`,
      permissions: ['PARAM_ALCADAS_USUARIO', 'PARAM_ALCADAS_ADMIN'],
      verifyAllPermissions: false,
      component: React.lazy(() =>
        import('pages/movimentacoes/ParamAlcadasTable'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Parametrização das Alçadas',
        },
      ],
    },
    {
      title: 'Inclusão de Patrâmetros',
      path: `${basePath}inclusao-de-parametros/`,
      permissions: ['PARAM_ALCADAS_USUARIO', 'PARAM_ALCADAS_ADMIN'],
      verifyAllPermissions: false,
      component: React.lazy(() =>
        import('pages/movimentacoes/components/alcadas/FormParamAlcadas'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Inclusão de Patrâmetros' },
      ],
    },
    {
      title: 'Editar Patrâmetro',
      path: `${basePath}editar-parametros/`,
      permissions: ['PARAM_ALCADAS_USUARIO', 'PARAM_ALCADAS_ADMIN'],
      verifyAllPermissions: false,
      component: React.lazy(() =>
        import('pages/movimentacoes/components/alcadas/FormParamAlcadasPatch'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Edição de Patrâmetros' },
      ],
    },
    {
      title: 'Parametrização das Suspensões',
      path: `${basePath}parametrizacao-das-suspensoes/`,
      permissions: ['PARAM_SUSPENSOES_USUARIO'],
      verifyAllPermissions: false,
      component: React.lazy(() => import('pages/movimentacoes/ParamSuspensaoTable')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Parametrização das Suspensões',
        },
      ],
    },
    {
      title: 'Inclusão de Suspensão',
      path: `${basePath}incluir-suspensao/`,
      permissions: ['PARAM_SUSPENSOES_USUARIO'],
      verifyAllPermissions: false,
      component: React.lazy(() =>
        import('@/pages/movimentacoes/components/suspensao/FormParamSuspensao'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Inclusão de Patrâmetros' },
      ],
    },
    {
      title: 'Editar Suspensão',
      path: `${basePath}editar-suspensao/:id`,
      permissions: ['PARAM_SUSPENSOES_USUARIO'],
      verifyAllPermissions: false,
      component: React.lazy(() =>
        import('pages/movimentacoes/components/suspensao/FormParamSuspensaoPatch'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Edição de Suspensão' },
      ],
    },
  ],
};
