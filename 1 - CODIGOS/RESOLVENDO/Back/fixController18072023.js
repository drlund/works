/**
 * A função `gravarParametro` deve receber o parâmetro `usuario` corretamente e os valores de `dataAtual`, `acao` e 
 * `matricula` serão salvos no banco de dados como esperado.
 * 
 * Parece que a variável `usuario` não está sendo passada corretamente para a função `gravarParametro`. Isso pode estar 
 * ocorrendo porque a variável `usuario` não está definida no escopo em que a função `gravarParametro` é chamada. Vamos 
 * corrigir isso passando a variável `usuario` como um parâmetro para a função `gravarParametro`. Além disso, vamos passar 
 * o parâmetro `dadosDosParametros` para a função `getObservacao` para garantir que os dados sejam corretamente formatados. 
 * 
 * Vou mostrar o código corrigido abaixo:
*/

async getObservacao(usuario, acao, dadosDosParametros) {
  const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
  return `Matrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - ${
    dadosDosParametros.observacao || ""
  }\n`;
}

async this.executaAcao(acionaFuncao, params) {
  const usuario = params.session.get("currentUserAccount");
  const observacao = await getObservacao(usuario, params.acao, params.dadosDosParametros);

  if (params.observacao) {
    params.observacaoAtualizada = observacao + params.observacao;
  } else {
    params.observacaoAtualizada = observacao;
  }

  return acionaFuncao(params);
}

async delParametro({ request, response, session }) {
  const { id: idParametro, observacao } = request.allParams();
  const acao = "Exclusão";

  const params = {
    request,
    response,
    session,
    acao,
    observacao,
  };

  await this.executaAcao(async (params) => {
    const parametroExistente = await ParamAlcadas.find(idParametro);
    parametroExistente.merge({ observacao: params.observacaoAtualizada });
    parametroExistente.save(params.observacaoAtualizada);

    const ucExcluirParametro = new UcExcluirParametro(new ParametrosAlcadasRepository());
    await ucExcluirParametro.validate(idParametro);
    const excluiParametro = await ucExcluirParametro.run();

    params.response.ok(excluiParametro);
  }, params);
}

async gravarParametro({ request, response, session }) {
  const dadosDosParametros = request.allParams();
  const acao = "Inclusão";

  const params = {
    request,
    response,
    session,
    acao,
    observacao: dadosDosParametros.observacao,
    dadosDosParametros, // Adicionamos a variável aqui
  };

  await this.executaAcao(async (params) => {
    const ucGravarParametro = new UcGravarParametro(new ParametrosAlcadasRepository(), new ParamAlcadasIncluirFactory());
    await ucGravarParametro.validate(params.usuario, params.dadosDosParametros); // Aqui utilizamos params.usuario
    const parametroGravado = await ucGravarParametro.run();

    params.response.ok(parametroGravado);
  }, params);
}

async patchParametros({ request, response, session }) {
  const dadosParametros = request.allParams();
  const { id, comite, nomeComite, observacao } = dadosParametros;
  const acao = "Alteracao";

  const params = {
    request,
    response,
    session,
    acao,
    observacao,
  };

  await this.executaAcao(async (params) => {
    const ucAlterarParametros = new UcAlterarParametros(new ParametrosAlcadasRepository());
    await ucAlterarParametros.validate({
      id,
      comite,
      nomeComite,
      observacao: params.observacaoAtualizada,
    });
    await ucAlterarParametros.run();

    params.response.ok();
  }, params);
}
