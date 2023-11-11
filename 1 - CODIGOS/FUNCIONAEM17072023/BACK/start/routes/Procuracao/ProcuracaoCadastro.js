// @ts-ignore
const Router = use("Route");

Router.group(() => {
  Router.get(
    "/download-arquivo/:docName",
    "Procuracoes/CadastroController.downloadArquivo",
  );
  Router.get(
    "/lista-cartorios",
    "Procuracoes/CadastroController.getListaCartorios"
  );
  Router.get(
    "/lista-subsidiarias",
    "Procuracoes/CadastroController.getListaSubsidiarias"
  );
  Router.get(
    "/pesquisar-outorgado",
    "Procuracoes/CadastroController.pesquisarOutorgado"
  );
  Router.get(
    "/pesquisar-poderes-outorgante/:matricula",
    "Procuracoes/CadastroController.pesquisarPoderesOutorgante"
  );

  Router.post(
    "/cadastrar-cartorio",
    "Procuracoes/CadastroController.cadastrarCartorio"
  );
  Router.post(
    "/cadastrar-procuracao/",
    "Procuracoes/CadastroController.cadastrarProcuracao"
  ).middleware(["parseCadastrarProcuracao"]);

  Router.post(
    "/cadastrar-subsidiaria",
    "Procuracoes/CadastroController.cadastrarSubsidiaria"
  );
})
  .prefix("/procuracoes/cadastro")
  .middleware(["isTokenValid"]);
