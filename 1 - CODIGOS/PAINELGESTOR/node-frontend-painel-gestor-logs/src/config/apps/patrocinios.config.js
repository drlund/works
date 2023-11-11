import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

const basePath = '/patrocinios/';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'Patrocínios e Promoção',
  },
];

export const PatrociniosConfig = {
  title: 'Patrocinios',
  name: 'Patrocínios',
  routes: [
    {
      title: 'Cadatrar e consultar SAC',
      path: `${basePath}cadastrar-consultar-sac`,
      permissions: ['USUARIO'],
      component: React.lazy(() => import('pages/patrocinios/Gestao')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Cadatrar e consultar SAC' },
      ],
    },
    {
      title: 'Nova Solicitação de Patrocínio e/ou Ação Promocional',
      path: `${basePath}novasolicitacao`,
      permissions: ['USUARIO'],
      component: React.lazy(() => import('pages/patrocinios/NovaSolicitacao')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Nova Solicitação' },
      ],
    },
    {
      title: 'Alteração de Solicitação de Patrocínio e/ou Ação Promocional',
      path: `${basePath}alterasolicitacao/:id`,
      permissions: ['USUARIO'],
      component: React.lazy(() =>
        import('pages/patrocinios/AlteraSolicitacao'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Alteração de Solicitação' },
      ],
    },
    {
      title: 'Visualização de Solicitação de Patrocínio e/ou Ação Promocional',
      path: `${basePath}visualizasolicitacao/:id`,
      permissions: ['USUARIO'],
      component: React.lazy(() =>
        import('pages/patrocinios/VisualizaSolicitacao'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Visualização de Solicitação' },
      ],
    },
    {
      title: 'Votação de Solicitação de Patrocínio e/ou Ação Promocional',
      path: `${basePath}votacao`,
      permissions: ['USUARIO'],
      component: React.lazy(() => import('pages/patrocinios/Votacao')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Votação de Solicitação' },
      ],
    },
    {
      title: 'Análise de Patrocínio e/ou Ação Promocional',
      path: `${basePath}analise/:id`,
      permissions: ['USUARIO'],
      component: React.lazy(() => import('pages/patrocinios/Analise')),
      breadcrumbRoutes: [...baseBCRoutes, { breadcrumbName: 'Análise' }],
    },
    {
      title: 'Visualização de Análise de Patrocínio e/ou Ação Promocional',
      path: `${basePath}visualiza-analise/:id`,
      permissions: ['USUARIO'],
      component: React.lazy(() => import('pages/patrocinios/VerAnalise')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Visualização de Análise' },
      ],
    },

    // Gestão de Patrocínios (Paulo)
    {
      title: 'Gestão do Orçamento',
      path: `${basePath}gestao-do-orcamento`,
      permissions: ['USUARIO'],
      component: React.lazy(() => import('pages/patrocinios/Gestao')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Gestão do Orçamento' },
      ],
    },
    {
      title: 'Iniciar Gestão',
      path: `${basePath}iniciar-gestao-patrocinios/:idSolicitacao`,
      permissions: ['USUARIO'],
      component: React.lazy(() =>
        import('pages/patrocinios/gestaoDePatrocinios/forms/FormGestao'),
      ),
      breadcrumbRoutes: [...baseBCRoutes, { breadcrumbName: 'Iniciar Gestão' }],
    },
    {
      // Editar projeto
      title: 'Editar Projeto',
      path: `${basePath}editar-projeto-patrocinios/:idSolicitacao`,
      permissions: ['USUARIO'],
      component: React.lazy(() =>
        import('pages/patrocinios/gestaoDePatrocinios/forms/FormProjeto'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Gerenciar Projeto' },
      ],
    },
    {
      // Orçamento table:
      title: 'Tabela Gerenciar Orçamentos',
      path: `${basePath}tabela-gerenciar-orcamento/:idSolicitacao`,
      permissions: ['USUARIO'],
      component: React.lazy(() =>
        import('pages/patrocinios/gestaoDePatrocinios/tabelas/TabelaOrcamento'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Gerenciar Orçamento' },
      ],
    },
    {
      // Orçamento form "Editar":
      title: 'Formulário Gerenciar Orçamento',
      path: `${basePath}gerenciar-orcamento-patrocinios/`,
      permissions: ['USUARIO'],
      component: React.lazy(() =>
        import('pages/patrocinios/gestaoDePatrocinios/forms/FormOrcamento'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Gerenciar Orçamento' },
      ],
    },
    {
      // Orçamento form "Incluir":
      title: 'Formulário Gerenciar Orçamento',
      path: `${basePath}gerenciar-orcamento-incluir/`,
      permissions: ['USUARIO'],
      component: React.lazy(() =>
        import('pages/patrocinios/gestaoDePatrocinios/forms/FormOrcamento'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Gerenciar Orçamento - Incluir' },
      ],
    },
    {
      // Provisão table:
      title: 'Tabela Gerenciar Provisão',
      path: `${basePath}tabela-gerenciar-provisao/:idSolicitacao`,
      permissions: ['USUARIO'],
      component: React.lazy(() =>
        import('pages/patrocinios/gestaoDePatrocinios/tabelas/TabelaProvisao'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Gerenciar Provisão' },
      ],
    },
    {
      // Provisão form "Editar":
      title: 'Formulário Gerenciar Provisão',
      path: `${basePath}gerenciar-provisao-patrocinios/`,
      permissions: ['USUARIO'],
      component: React.lazy(() =>
        import('pages/patrocinios/gestaoDePatrocinios/forms/FormProvisao'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Gerenciar Provisão' },
      ],
    },
    {
      // Provisão form "Incluir":
      title: 'Formulário Gerenciar Provisão',
      path: `${basePath}gerenciar-provisao-incluir/`,
      permissions: ['USUARIO'],
      component: React.lazy(() =>
        import('pages/patrocinios/gestaoDePatrocinios/forms/FormProvisao'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Gerenciar Provisão' },
      ],
    },
    {
      // Pagamentos table:
      title: 'Tabela de Pagamentos',
      path: `${basePath}tabela-gerenciar-pagamentos/:idSolicitacao`,
      permissions: ['USUARIO'],
      component: React.lazy(() =>
        import(
          'pages/patrocinios/gestaoDePatrocinios/tabelas/TabelaPagamentos'
        ),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Tabela de Pagamentos' },
      ],
    },
    {
      // Pagamentos form "Editar":
      title: 'Gerenciar Pagamentos',
      path: `${basePath}gerenciar-pagamentos-patrocinios/`,
      permissions: ['USUARIO'],
      component: React.lazy(() =>
        import('pages/patrocinios/gestaoDePatrocinios/forms/FormPagamentos'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Gerenciar Pagamentos' },
      ],
    },
    {
      // Pagamentos form "Incluir":
      title: 'Gerenciar Pagamentos',
      path: `${basePath}gerenciar-pagamentos-incluir/`,
      permissions: ['USUARIO'],
      component: React.lazy(() =>
        import('pages/patrocinios/gestaoDePatrocinios/forms/FormPagamentos'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Gerenciar Pagamentos' },
      ],
    },
    {
      title: 'Gerenciar Projetos de Patrocinios',
      path: `${basePath}gerenciar-projetos-tabela/:idSolicitacao`,
      permissions: ['USUARIO'],
      component: React.lazy(() =>
        import('pages/patrocinios/gestaoDePatrocinios/tabelas/TabelaProjeto'),
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        { breadcrumbName: 'Gerenciar Projetos' },
      ],
    },
  ],
};
