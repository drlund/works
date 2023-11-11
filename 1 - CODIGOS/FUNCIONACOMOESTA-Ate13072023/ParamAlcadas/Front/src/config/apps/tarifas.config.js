import React from "react";
import { HomeOutlined } from "@ant-design/icons";

const basePath = "/tarifas/";

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: "/",
    breadcrumbName: <HomeOutlined />,
  },
  {
    breadcrumbName: "Tarifas",
  },
];

export const TarifasConfig = {
  name: "Tarifas",
  routes: [
    {
      title: "Público Alvo",
      default: true,
      path: basePath + "publico-alvo",
      component: React.lazy(() => import("pages/tarifas/PublicoAlvo.js")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Público Alvo",
        },
      ],
    },
    {
      title: "Pendentes pagamento em espécie",
      path: basePath + "pagamento-especie",
      component: React.lazy(() =>
        import("pages/tarifas/PendentesPgtoEspecie.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Pendentes pagamento em espécie",
        },
      ],
    },
    {
      title: "Pendentes pagamento em conta",
      path: basePath + "pagamento-conta-corrente",
      permissions: ["PGTO_CONTA", "ADMIN"],
      component: React.lazy(() => import("pages/tarifas/PendentesPgtoCC.js")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Pendentes pagamento em conta",
        },
      ],
    },
    {
      title: "Registrar Pagamento",
      path: basePath + "registrar-pagamento-especie/:idOcorrencia",
      component: React.lazy(() =>
        import("pages/tarifas/RegistrarPagamentoEspecie.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Pagamento em Espécie",
        },
      ],
    },
    {
      title: "Ocorrência Finalizada",
      path: basePath + "ocorrencia-finalizada/:idOcorrencia",
      component: React.lazy(() =>
        import("pages/tarifas/OcorrenciaFinalizada.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Ocorrência Finalizada",
        },
      ],
    },
    {
      title: "Cancelar Reserva",
      path: basePath + "cancelar-reserva/:idOcorrencia",
      component: React.lazy(() => import("pages/tarifas/CancelarReserva.js")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Cancelar Reserva",
        },
      ],
    },
    {
      title: "Registrar Pagamento",
      path: basePath + "registrar-pagamento-conta/:idOcorrencia",
      permissions: ["PGTO_CONTA", "ADMIN"],
      component: React.lazy(() =>
        import("pages/tarifas/RegistrarPagamentoConta.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Registrar Pagamento C/C",
        },
      ],
    },
    {
      title: "Reservar Ocorrência",
      path: basePath + "reservar-ocorrencia/:idOcorrencia",
      component: React.lazy(() =>
        import("pages/tarifas/ReservarOcorrencia.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Reservar Ocorrência",
        },
      ],
    },
    {
      title: "Confirmar Pgto.",
      path: basePath + "confirmar-pgto/:idOcorrencia",
      component: React.lazy(() => import("pages/tarifas/ConfirmarPgto.js")),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Confirmar Pgto.",
        },
      ],
    },
    {
      title: "Gerenciar Ocorrências",
      path: basePath + "gerenciar-ocorrencias/",
      component: React.lazy(() =>
        import("pages/tarifas/GerenciarOcorrencias.js")
      ),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: "Gerenciar Ocorrências",
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
  TarifasConfig.routes.filter((item) => {
    return item.default ? (defRoute = item) : false;
  });

  return defRoute;
};
