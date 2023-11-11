/**
 * Dessa forma, se o parâmetro já existir, o código irá chamar a função `gravarParametro` da sua repository para 
 * atualizar o parâmetro existente com a nova observação e setar o campo "ativo". Caso contrário, o código irá 
 * continuar com a atualização normal do parâmetro utilizando os métodos existentes. 
 * 
 * Lembre-se de ajustar as chamadas dos métodos `gravarParametro` e `patchParametros` de acordo com a lógica 
 * desejada e as necessidades específicas do seu sistema.
 */

/**
 * Para realizar a alteração do parâmetro com a ação de "Reinclusão" e retornar a mensagem como se fosse uma nova 
 * inclusão, você pode fazer algumas modificações no código. 
 * 
 * Primeiro, na função `patchParametros` da sua controller, você precisa chamar o método `gravarParametro` caso o 
 * parâmetro já exista. Para isso, você pode adicionar uma condição para verificar se o parâmetro já existe e, em 
 * seguida, chamar a função `gravarParametro` da sua controller:
*/

async patchParametros({ request, response, session }) {
  const dadosParametros = request.allParams();
  const usuario = session.get("currentUserAccount");
  const { id, comite, nomeComite, observacao } = dadosParametros;
  const acao = "Alteracao";
  const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
  const observacaoAtualizada = `Matrícula: ${
    usuario.matricula
  } - Data: ${dataAtual} - Ação: ${acao} - ${
    observacao ? observacao + " " : ""
  }`;
  const ucAlterarParametros = new UcAlterarParametros(new ParametrosAlcadasRepository());

  await ucAlterarParametros.validate({
    id,
    comite,
    nomeComite,
    observacao: observacaoAtualizada,
  });

  const parametroExistente = await ParamAlcadas.find(id);

  if (parametroExistente) {
    await this.gravarParametro({ request, response, session });
  } else {
    await ucAlterarParametros.run();
    response.ok();
  }
}


/**
 * Em seguida, na função `run` da sua useCase `UcAlterarParametros`, você pode adicionar a chamada ao método 
 * `gravarParametro` se o parâmetro já existir:
 */

async run() {
  if (this.validated === false) {
    throw new Error(
      "O método validate() deve ser chamado antes do run()"
    );
  }

  const { id, comite, nomeComite, observacao } = this.novoParametro;

  const parametroExistente = await ParamAlcadas.find(id);

  if (parametroExistente) {
    await this.ParametrosAlcadasRepository.gravarParametro(this.novoParametro, parametroExistente);
  } else {
    const novoParametro = {
      comite,
      nomeComite,
    };

    await this.ParametrosAlcadasRepository.patchParametros(id, novoParametro);
    await this.ParametrosAlcadasRepository.patchParametrosObservacao(id, observacao);
  }

  return true;
}
