/**A função `executaAcao` não precisa ser passada como parâmetro para as funções refatoradas. Ela será chamada dentro 
 * de cada uma delas, como uma função auxiliar interna, para encapsular a lógica comum. 
 * 
 * Agora a função `executaAcao` permanece como uma função auxiliar que não precisa ser passada como parâmetro para as 
 * funções refatoradas.
 * 
 * Aqui está a correção do código, removendo a passagem da função `executaAcao` como parâmetro:
*/

getObservacao(usuario, acao) {
  const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
  return `Matrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - `;
}

async executaAcao(acionaParams, params) {
  const usuario = params.session.get("currentUserAccount");
  const observacao = await this.getObservacao(usuario, params.acao);

  if (params.observacao) {
    params.observacaoAtualizada = observacao + params.observacao;
  } else {
    params.observacaoAtualizada = observacao;
  }

  return acionaParams(params);
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

    const ucExcluirParametro = new UcExcluirParametro(
      new ParametrosAlcadasRepository()
    );
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
  };

  await this.executaAcao(async (params) => {
    const ucGravarParametro = new UcGravarParametro(
      new ParametrosAlcadasRepository(),
      new ParamAlcadasIncluirFactory()
    );
    await ucGravarParametro.validate(usuario, dadosDosParametros);
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
    const ucAlterarParametros = new UcAlterarParametros(
      new ParametrosAlcadasRepository()
    );
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
