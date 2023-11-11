import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/procuracoes';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'Procurações',
    path: basePath,
  },
];

export const ProcuracoesConfig = {
  title: 'Procurações',
  name: 'Procurações',

  routes: [
    {
      title: 'Home',
      default: true,
      path: basePath,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/procuracoes/Home')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
      ],
    },
    {
      title: 'Procurações',

      path: `${basePath}/cadastrar`,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/procuracoes/Cadastrar')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Cadastrar',
          path: `${basePath}/cadastrar`,
        },
      ],
    },
    {
      title: 'Procurações',
      path: `${basePath}/cadastrar/:idMinuta`,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/procuracoes/Cadastrar')
        .then((module) => ({ default: module.CadastrarContinue }))),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Cadastrar',
          path: 'cadastrar',
        },
        {
          breadcrumbName: 'Cadastrar de uma Minuta',
        },
      ],
    },
    {
      title: 'Procurações',

      path: `${basePath}/gestao`,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/procuracoes/Gestao')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Gestão',
          path: `${basePath}/gestao`,
        },
      ],
    },
    {
      title: 'Procurações',

      path: `${basePath}/minuta`,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/procuracoes/Minuta')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Minuta',
          path: `${basePath}/minuta`,
        },
      ],
    },
    {
      title: 'Procurações',
      path: `${basePath}/minuta/:idMinuta`,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/procuracoes/Minuta')
        .then((module) => ({ default: module.MinutasContinue }))),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Minutas',
          path: 'minuta',
        },
        {
          breadcrumbName: 'Baixar Minuta',
        },
      ],
    },
    {
      title: 'Procurações',
      path: `${basePath}/gerarMinuta`,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/procuracoes/Minuta/internalComponents/TemplateGenerator')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Minutas',
          path: 'minuta',
        },
        {
          breadcrumbName: 'Gerar Minuta',
        },
      ],
    },
    {
      title: 'Procurações',

      path: `${basePath}/pesquisar`,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/procuracoes/Pesquisar/index')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Pesquisar',
          path: `${basePath}/pesquisar`,
        },
      ],
    },
    {
      title: 'Procurações',
      default: true,
      path: `${basePath}/solicitacoes`,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/procuracoes/Solicitacoes')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Solicitações',
          path: `${basePath}/solicitacoes`,
        },
      ],
    },
    {
      title: 'Procurações',
      path: `${basePath}/massificado`,
      component: React.lazy(() => import('pages/procuracoes/Massificado')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Massificado',
        },
      ],
    },
    {
      title: 'Procurações',
      path: `${basePath}/massificado/minuta`,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/procuracoes/Massificado/Minuta')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Massificado',
          path: `massificado`,
        },
        {
          breadcrumbName: 'Minuta',
        },
      ],
    },
    {
      title: 'Procurações',
      path: `${basePath}/massificado/minuta/:idMassificado`,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/procuracoes/Massificado/Minuta')
        .then((module) => ({ default: module.MassificadoContinue }))),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Massificado',
          path: 'massificado',
        },
        {
          breadcrumbName: 'Baixar Massificado',
        },
      ],
    },
    {
      title: 'Procurações',
      path: `${basePath}/massificado/cadastro`,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/procuracoes/Massificado/Cadastro')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Massificado',
          path: `massificado`,
        },
        {
          breadcrumbName: 'Cadastro',
        },
      ],
    },
  ],
};

/**
 * Funcao que retorna a configuracao da rota padrao do aplicativo.
 */
export const getDefaultRoute = () => ProcuracoesConfig.routes.find((item) => item.default);
