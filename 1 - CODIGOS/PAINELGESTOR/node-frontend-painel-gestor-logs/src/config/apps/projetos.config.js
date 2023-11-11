import React from "react";
import { RocketOutlined } from "@ant-design/icons";

const basePath = "/projetos/";

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: "/",
    breadcrumbName: <RocketOutlined />,
  },
  {
    breadcrumbName: "Projetos",
  },
];

export const ProjetosConfig = {
  title: "Projetos",
  name: "Projetos",
  routes: [
    {
      title: "Lista de Projetos",
      path: basePath + "lista-projetos",
      permissions: ["USUARIO", "ADM"],
      component: React.lazy(() => import("pages/projetos/ProjetoLista")),
      breadcrumbRoutes: [...baseBCRoutes, { breadcrumbName: "Lista de Projetos" }],
    },
    {
      title: "Inclusão de Projeto",
      path: basePath + "incluir-projeto",
      permissions: ["USUARIO", "ADM"],
      component: React.lazy(() => import("pages/projetos/ProjetoForm")),
      breadcrumbsRoutes: [...baseBCRoutes, { breadcrumbName: "Incluir Projeto" }],
    },
    {
      title: "Detalhes do Projeto",
      path: basePath + "visualizar-projeto/:id",
      permissions: ["USUARIO", "ADM"],
      component: React.lazy(() => import("pages/projetos/ProjetoForm")),
      breadcrumbsRoutes: [...baseBCRoutes, { breadcrumbName: "Detalhar Projeto" }],
    },
    {
      title: "Edição de Projeto",
      path: basePath + "editar-projeto/:id",
      permissions: ["USUARIO", "ADM"],
      component: React.lazy(() => import("pages/projetos/ProjetoForm")),
      breadcrumbsRoutes: [...baseBCRoutes, { breadcrumbName: "Alterar Projeto" }],
    },
    {
      title: "Esclarecimentos / Observações",
      path: basePath + "esclarecimento-projeto/:id",
      permissions: ["USUARIO", "ADM"],
      component: React.lazy(() => import("pages/projetos/Esclarecimento")),
      breadcrumbsRoutes: [...baseBCRoutes, { breadcrumbName: "Esclarecimentos / Observações" }],
    },
    {
      title: "Acompanhar Desenvolvimento",
      path: basePath + "acompanhamento",
      permissions: ["ACPTOTAL", "ACPGERAD", "ACPANDAMENTO"],
      component: React.lazy(() => import("pages/projetos/Acompanhamento")),
      breadcrumbRoutes: [...baseBCRoutes, { breadcrumbName: "Acompanhar Desenvolvimento"}],
    },
    {
      title: "Minhas Atividades",
      path: basePath + 'central-atividades',
      permissions: ["DEV"],
      component: React.lazy(() => import("pages/projetos/CentralAtividade")),
      breadcrumbRoutes: [...baseBCRoutes,  { breadcrumbName: "Central de Atividades"}],
    }
  ],
};
