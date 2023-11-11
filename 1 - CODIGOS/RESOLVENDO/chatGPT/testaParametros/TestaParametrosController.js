 "use strict";

const UcTestaParametros = use("App/Commons/Movimentacoes/UseCases/UcTestaParametros");
const UcExcluirParametro = use("App/Commons/Movimentacoes/UseCases/UcExcluirParametro")
const TestaParametrosRepository = use("App/Commons/Movimentacoes/Repositories/TestaParametrosRepository");
const ParamAlcadasIncluirFactory = use("App/Commons/Movimentacoes/Factories/ParamAlcadasIncluirFactory");
const UcGravarParametro = use("App/Commons/Movimentacoes/UseCases/UcGravarParametro");
const UcAlterarParametros = use("App/Commons/Movimentacoes/UseCases/UcAlterarParametros");
const UcCargosComissoes = use("App/Commons/Movimentacoes/UseCases/UcCargosComissoes");

class TestaParametrosController {
    async getParametros({ response, request}){
        const  {id}  = request.allParams();
        const ucTestaParametros = new UcTestaParametros(new TestaParametrosRepository());
        await ucTestaParametros.validate(id);
        const listaParametros = await ucTestaParametros.run();
    
        response.ok(listaParametros);
      }
  
    async delParametro({request, response}){
      const {id: idParametro} = request.allParams();
      const ucExcluirParametro = new UcExcluirParametro(new TestaParametrosRepository());
      await ucExcluirParametro.validate(idParametro);
      const excluiParametro = await ucExcluirParametro.run();
  
      response.ok(excluiParametro);
    }

    async gravarParametro({request, response, session}){
      const dadosDosParametros = request.allParams();
      const usuario = session.get("currentUserAccount");
      const ucGravarParametro = new UcGravarParametro(new TestaParametrosRepository(), new ParamAlcadasIncluirFactory());
      await ucGravarParametro.validate(usuario, dadosDosParametros);
      const parametroGravado = await ucGravarParametro.run();

      response.ok(parametroGravado);
    }

async patchParametros({ request, response }) {
  try {
    const dadosParametros = request.allParams();
    const ucAlterarParametros = new UcAlterarParametros(new TestaParametrosRepository());
    await ucAlterarParametros.validate(dadosParametros);
    await ucAlterarParametros.run();

    return response.status(200).json({ message: 'Parâmetros atualizados com sucesso' });
  } catch (error) {
    return response.status(500).json({ error: 'Ocorreu um erro ao atualizar os parâmetros' });
  }
}
    
    async getCargosComissoesFot09({ response, request}){
      const  {cod_dependencia}  = request.allParams();
      const ucCargosComissoes = new UcCargosComissoes(new TestaParametrosRepository());
      await ucCargosComissoes.validate(cod_dependencia);
      const listaCargosComissoes = await ucCargosComissoes.run();
  
      response.ok(listaCargosComissoes);
    }

}

module.exports = TestaParametrosController;