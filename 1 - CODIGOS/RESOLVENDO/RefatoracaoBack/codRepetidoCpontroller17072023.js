/**
 * As funções `delParametro`, `gravarParametro` e `patchParametros` foram refatoradas para utilizar a função 
 * auxiliar `executeAction`, reduzindo a repetição de código. Essa abordagem torna o código mais legível e facilita 
 * futuras atualizações e manutenções.
 * 
 * Para eliminar a repetição de código entre essas três funções, podemos identificar as partes em comum e criar uma 
 * função auxiliar que encapsule essa lógica. Vamos extrair as partes repetidas, que são: 
 * 
 * 1. Obter o usuário da sessão e criar a string de observação formatada com a ação, a data atual e a matrícula do usuário.
 * 2. Validar e executar a ação correspondente para cada caso específico.
 * 
 * Refatoração das três funções utilizando uma função auxiliar:
*/

// Função auxiliar para obter a string formatada de observação
async function getObservacao(usuario, acao) {
  const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
  return `Matrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - `;
}

async function executeAction(actionFn, params) {
  const usuario = params.session.get("currentUserAccount");
  const observacao = await getObservacao(usuario, params.acao);

  if (params.observacao) {
    params.observacaoAtualizada = observacao + params.observacao;
  } else {
    params.observacaoAtualizada = observacao;
  }

  return actionFn(params);
}

// Funções refatoradas

async function delParametro({ request, response, session }) {
  const { id: idParametro, observacao } = request.allParams();
  const acao = "Exclusão";

  const parametroExistente = await ParamAlcadas.find(idParametro);
  parametroExistente.merge({ observacao: observacaoAtualizada });
  parametroExistente.save(observacaoAtualizada);

  const ucExcluirParametro = new UcExcluirParametro(new ParametrosAlcadasRepository());
  await ucExcluirParametro.validate(idParametro);
  const excluiParametro = await ucExcluirParametro.run();

  response.ok(excluiParametro);
}

async function gravarParametro({ request, response, session }) {
  const dadosDosParametros = request.allParams();
  const acao = "Inclusão";

  dadosDosParametros.observacao = `Matrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - ${dadosDosParametros.observacao}`;

  const ucGravarParametro = new UcGravarParametro(
    new ParametrosAlcadasRepository(),
    new ParamAlcadasIncluirFactory()
  );
  await ucGravarParametro.validate(usuario, dadosDosParametros);
  const parametroGravado = await ucGravarParametro.run();

  response.ok(parametroGravado);
}

async function patchParametros({ request, response, session }) {
  const dadosParametros = request.allParams();
  const { id, comite, nomeComite, observacao } = dadosParametros;
  const acao = "Alteracao";

  const ucAlterarParametros = new UcAlterarParametros(
    new ParametrosAlcadasRepository()
  );
  await ucAlterarParametros.validate({
    id,
    comite,
    nomeComite,
    observacao: observacaoAtualizada,
  });
  await ucAlterarParametros.run();

  response.ok();
}

// Funções refatoradas com a função auxiliar

async function delParametro({ request, response, session }) {
  const { id: idParametro, observacao } = request.allParams();
  const acao = "Exclusão";

  const params = {
    request,
    response,
    session,
    acao,
    observacao,
  };

  await executeAction(async (params) => {
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

async function gravarParametro({ request, response, session }) {
  const dadosDosParametros = request.allParams();
  const acao = "Inclusão";

  const params = {
    request,
    response,
    session,
    acao,
    observacao: dadosDosParametros.observacao,
  };

  await executeAction(async (params) => {
    const ucGravarParametro = new UcGravarParametro(
      new ParametrosAlcadasRepository(),
      new ParamAlcadasIncluirFactory()
    );
    await ucGravarParametro.validate(usuario, dadosDosParametros);
    const parametroGravado = await ucGravarParametro.run();

    params.response.ok(parametroGravado);
  }, params);
}

async function patchParametros({ request, response, session }) {
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

  await executeAction(async (params) => {
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
