import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { FERRAMENTAS_EM_MANUTENCAO } from 'config/app.config';

const basePath = '/mtn/';

const EM_MANUTENCAO = FERRAMENTAS_EM_MANUTENCAO.includes('MTN');
/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: 'MTN',
  },
];

export const MtnConfig = {
  title: 'MTN',
  name: 'MTN',
  matomoTrackerId: 46,
  routes: [
    {
      title: 'Minhas Ocorrências',
      default: true,
      path: basePath + 'minhas-ocorrencias',
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() => import('pages/mtn/MtnMinhasOcorrencias')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Minhas Ocorrências',
        },
      ],
    },

    {
      title: 'Administrar Ocorrências',
      default: true,
      permissions: ['MTN_ADM', 'MTN_READ_ONLY'],
      verifyAllPermissions: false,
      path: basePath + 'administrar-ocorrencias',
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() => import('pages/mtn/MtnAdministrarOcorrencias')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Administrar Ocorrências',
        },
      ],
    },
    {
      title: 'Alterar Medida',
      permissions: ['MTN_ALTERAR_MEDIDA'],
      path: basePath + 'alterar-medida',
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() => import('pages/mtn/MtnAlterarMedida')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Alterar Medida',
        },
      ],
    },
    {
      title: "Versionar Ocorrência",
      permissions: ["MTN_VERSIONAR_OCORRENCIA"],
      path: basePath + "versionar-ocorrencia",
      secondaryLayout: true,
      component: EM_MANUTENCAO ?
        React.lazy(() => import("pages/FerramentaEmManutencao")) :React.lazy(() => import("pages/mtn/VersionarOcorrencia")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Alterar Medida",
        },
      ],
    },
    {
      title: 'Questionário MTN',
      path: basePath + 'questionario/:id',
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() => import('pages/mtn/MtnQuestionario')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Questionário',
        },
      ],
    },
    
    {
      title: 'Acompanhar MTN',
      path: basePath + 'acompanhar/:idMtn',
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() => import('pages/mtn/MeuMtn')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Acompanhar Mtn',
        },
      ],
    },

    {
      title: 'Analisar MTN',
      path: basePath + 'analisar/:idMtn/:idEnvolvido?',
      permissions: ['MTN_ADM', 'MTN_READ_ONLY'],
      verifyAllPermissions: false,
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() => import('pages/mtn/MtnAnalisar')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Analisar Mtn',
        },
      ],
    },

    {
      title: 'Painel MTN',
      path: basePath + 'painel-mtn/',
      permissions: ['MTN_PAINEL'],
      verifyAllPermissions: false,
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() => import('pages/mtn/PainelMtn')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Painel MTN',
        },
      ],
    },
    {
      title: 'Gerenciar Prazos',
      path: basePath + 'gerenciar-prazos/',
      permissions: ['MTN_GERENCIAR_PRAZOS'],
      verifyAllPermissions: false,
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() => import('pages/mtn/MTNGerenciarPrazos')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Gerenciar Prazos MTN',
        },
      ],
    },
    {
      title: 'Painel Análises',
      path: basePath + 'painel-analises/',
      permissions: ['MTN_READ_ONLY'],
      verifyAllPermissions: false,
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() => import('pages/mtn/PainelDicoi')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Painel Análises',
        },
      ],
    },
    {
      title: 'Aprovar Medida',
      path: basePath + 'aprovar-medida/',
      permissions: ['MTN_APROVAR_MEDIDA'],
      secondaryLayout: true,
      verifyAllPermissions: false,
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() => import('pages/mtn/AprovarMedida')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Aprovar Medida',
        },
      ],
    },
    {
      title: 'People Analitics',
      path: basePath + 'people-analitics/:idEnvolvido',
      permissions: ['MTN_ADM', 'MTN_READ_ONLY'],
      verifyAllPermissions: false,
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() => import('pages/mtn/PeopleAnalitics')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'People Analitics',
        },
      ],
    },
    {
      title: 'Informações do Questionário',
      path: basePath + 'questionario-info/:idEnvolvido/:idMtn',
      permissions: ['MTN_ADM', 'MTN_READ_ONLY'],
      verifyAllPermissions: false,
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() => import('pages/mtn/QuestionarioInfo')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Informações do Questionário',
        },
      ],
    },
    {
      title: 'Notificações',
      path: basePath + 'notificacoes/:idEnvolvido',
      permissions: ['MTN_ADM', 'MTN_READ_ONLY'],
      verifyAllPermissions: false,
      component: EM_MANUTENCAO
        ? React.lazy(() => import('pages/FerramentaEmManutencao'))
        : React.lazy(() => import('pages/mtn/Notificacoes')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Notificações',
        },
      ],
    },
    {
      title: "Incluir Votação para Monitoramento",
      path: basePath + "incluir-votacao-monitoramento/:idMonitoramento",
      permissions: ["MTN_GERENCIAR_MONITORAMENTOS"],
      verifyAllPermissions: false,
      component: React.lazy(() =>
        import("pages/mtn/GerenciarMonitoramentos/MonitoramentosIncluirVotacao")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Monitoramentos - Incluir Parâmetros",
        },
      ],
    },
    {
      title: "Gerenciar Monitoramentos",
      path: basePath + "gerenciar-monitoramentos",
      permissions: ["MTN_GERENCIAR_MONITORAMENTOS"],
      verifyAllPermissions: false,
      component: React.lazy(() => import("pages/mtn/GerenciarMonitoramentos")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Gerenciar Monitoramentos",
        },
      ],
    },

    {
      title: "Votações",
      path: basePath + "votacoes",
      verifyAllPermissions: false,
      component: React.lazy(() => import("pages/mtn/Votacoes")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Parâmetros pra votação",
        },
      ],
    },

    {
      title: "Tratar Alteração de Parâmetro",
      path: basePath + "monitoramento/tratar-alteracao-parametros/:idVersao",
      verifyAllPermissions: false,
      component: React.lazy(() =>
        import("pages/mtn/TratarAlteracao")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Tratar alteração de parametros",
        },
      ],
    },
    {
      title: "Votar Versao",
      path: basePath + "monitoramento/votar-versao/:idMonitoramento",
      verifyAllPermissions: false,
      component: React.lazy(() => import("pages/mtn/VotarVersao")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Parâmetros pra votação",
        },
      ],
    },
    {
      title: "Consultar Votação",
      path: basePath + "monitoramento/consultar-votacao/:idMonitoramento",
      permissions: ["MTN_GERENCIAR_MONITORAMENTOS"],
      verifyAllPermissions: false,
      component: React.lazy(() => import("pages/mtn/ConsultarVotacao")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Consultar Votação",
        },
      ],
    },
    {
      title: "Gerenciar Comitê Expandido",
      path: basePath + "monitoramento/gerenciar-comite-expandido",
      permissions: ["MTN_GERENCIAR_MONITORAMENTOS"],
      verifyAllPermissions: false,
      component: React.lazy(() => import("pages/mtn/GerenciarComiteExtendido")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Gerenciar Comitê Expandido",
        },
      ],
    },
  ],
};

/**
 * Funcao que retorna a configuracao da rota padrao do aplicativo.
 */
export const getDefaultRoute = () => {
  let defRoute = null;
  MtnConfig.routes.filter((item) => {
    return item.default ? (defRoute = item) : false;
  });

  return defRoute;
};
