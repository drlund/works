import React from "react";
import { HomeOutlined } from "@ant-design/icons";

const basePath = "/encantar/";

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: "/",
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: "Encantar",
  },
];

export const EncantarConfig = {
  name: "Encantar",
  matomoTrackerId: 47,
  routes: [
    {
      title: "Catálogo",
      permissions: ["GERENCIAR_CATALOGO"],
      default: true,
      path: basePath + "catalogo",
      component: React.lazy(() => import("pages/encantar/estoque/Catalogo.js")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Catálogo",
        },
      ],
    },
    {
      title: "MOCKING ETIQUETAS",
      path: basePath + "etiqueta",
      component: React.lazy(() =>
        import("pages/encantar/ImprimirEtiqueta/MockingPage.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Mocking Etiqueta",
        },
      ],
    },
    {
      title: "Incluir Brinde",
      permissions: ["GERENCIAR_CATALOGO"],
      default: true,
      path: basePath + "novo-brinde",
      component: React.lazy(() =>
        import("pages/encantar/estoque/NovoBrinde.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          path: basePath + "catalogo",
          breadcrumbName: "Catálogo",
        },
        {
          breadcrumbName: "Incluir Novo Brinde",
        },
      ],
    },
    {
      title: "Editar Brinde",
      permissions: ["GERENCIAR_CATALOGO"],
      default: true,
      path: basePath + "editar-brinde/:id",
      component: React.lazy(() =>
        import("pages/encantar/estoque/EditarBrinde.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          path: basePath + "catalogo",
          breadcrumbName: "Catálogo",
        },
        {
          breadcrumbName: "Editar Brinde",
        },
      ],
    },
    {
      title: "Consulta Estoque",
      default: true,
      path: basePath + "estoque/consultar",
      component: React.lazy(() =>
        import("pages/encantar/estoque/ConsultarEstoque.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Consulta Estoque",
        },
      ],
    },
    {
      title: "Detentores Estoque",
      permissions: ["GERENCIAR_DETENTORES_ESTOQUE"],
      default: true,
      path: basePath + "estoque/detentores",
      component: React.lazy(() =>
        import("pages/encantar/estoque/DetentoresEstoque.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Detentores de Estoque",
        },
      ],
    },
    {
      title: "Consulta de Solicitações",
      default: true,
      path: basePath + "solicitacoes/consultar",
      component: React.lazy(() => import("pages/encantar/Solicitacoes.js")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Consulta de Solicitações",
        },
      ],
    },

    {
      title: "Consultar Solicitação",
      default: true,
      path: basePath + "solicitacao/:idSolicitacao",
      component: React.lazy(() => import("pages/encantar/Solicitacao.js")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Consultar Solicitação",
        },
      ],
    },
    {
      title: "Nova Solicitação",
      path: basePath + "solicitacoes/incluir",
      component: React.lazy(() =>
        import("pages/encantar/IncluirSolicitacao.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Incluir Solicitação",
        },
      ],
    },

    {
      title: "Aprovações",
      path: basePath + "solicitacoes/aprovacoes",
      component: React.lazy(() => import("pages/encantar/Aprovacoes.js")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Aprovações",
        },
      ],
    },

    {
      title: "Aprovação",
      path: basePath + "aprovar-solicitacao/:idSolicitacao",
      component: React.lazy(() => import("pages/encantar/Aprovacao.js")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Aprovação",
        },
      ],
    },
    {
      title: "Envio / Entrega",
      path: basePath + "envios",
      component: React.lazy(() => import("pages/encantar/EnvioEntrega.js")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Envio / Entrega",
        },
      ],
    },
    {
      title: "Tratar Devolução",
      path: basePath + "tratar-devolucao/:idSolicitacao",
      component: React.lazy(() =>
        import("pages/encantar/entregas/TratarDevolucao.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Envio / Entrega",
        },
      ],
    },
    {
      title: "Envio",
      path: basePath + "envio/:idSolicitacao",
      component: React.lazy(() => import("pages/encantar/entregas/Envio.js")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: " Envio / Entrega",
        },
      ],
    },
    {
      title: "Entrega Cliente",
      path: basePath + "entrega-cliente/:idSolicitacao",
      component: React.lazy(() =>
        import("pages/encantar/entregas/EntregaCliente.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: " Entrega para Cliente",
        },
      ],
    },
    {
      title: "Recebimento no Prefixo",
      path: basePath + "recebimento/:idSolicitacao",
      component: React.lazy(() =>
        import("pages/encantar/entregas/Recebimento.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Recebimento no Prefixo",
        },
      ],
    },
    {
      title: "Reações de Clientes",
      path: basePath + "reacoes-clientes",
      component: React.lazy(() => import("pages/encantar/Reacoes.js")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Reacoes de Clientes",
        },
      ],
    },
    {
      title: "Reação de Clientes",
      path: basePath + "reacao/:idSolicitacao",
      component: React.lazy(() => import("pages/encantar/Reacao.js")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Reacao de Clientes",
        },
      ],
    },
    {
      title: "Recebimentos Prefixo",
      path: basePath + "recebimentos-prefixo",
      component: React.lazy(() =>
        import("pages/encantar/RecebimentosPrefixo.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Recebimentos Prefixo",
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
  EncantarConfig.routes.filter((item) => {
    return item.default ? (defRoute = item) : false;
  });

  return defRoute;
};
