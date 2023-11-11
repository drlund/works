// 14/07/2023
/**
 * Para realizar a alteração e tratar como uma reinclusão, você precisará fazer algumas modificações no código existente. 
 * Aqui está uma sugestão de como você pode realizar essa alteração.
 * 
 * Com essas alterações, quando você chamar a função `gravarParametro` e existir um parâmetro com os mesmos valores de 
 * `prefixoDestino` e `comissaoDestino`, o código irá atualizar o campo `ativo` para "1" e adicionar as informações do 
 * usuário atual antes de chamar a função `run()` da `UcGravarParametro`. Dessa forma, ele tratará a alteração como uma 
 * reinclusão e persistirá as informações atualizadas.
 * 
 * 1. Na função `gravarParametro` da sua controller, antes de chamar o método `ucGravarParametro.run()`, você pode 
 * verificar se existe um parâmetro com os mesmos valores de `prefixoDestino` e `comissaoDestino`. Se existir, você pode 
 * atualizar o campo `ativo` para "1" e adicionar as informações do usuário atual.
*/


async gravarParametro({ request, response, session }) {
  // ... código existente ...

  const ucGravarParametro = new UcGravarParametro(
    new ParametrosAlcadasRepository(),
    new ParamAlcadasIncluirFactory()
  );
  await ucGravarParametro.validate(usuario, dadosDosParametros);

  // Verificar se já existe um parâmetro com os mesmos valores
  const parametroExistente = await ParamAlcadas.query()
    .where("prefixoDestino", dadosDosParametros.prefixoDestino)
    .where("comissaoDestino", dadosDosParametros.comissaoDestino)
    .fetch();

  if (parametroExistente.rows.length > 0) {
    const registroExiste = parametroExistente.rows[0];

    if (registroExiste.ativo === "1") {
      throw new Error("Parâmetros já existem e estão ativos.");
    } else {
      // Atualizar o campo "ativo" para "1"
      registroExiste.ativo = "1";
      await registroExiste.save();

      // Adicionar informações do usuário atual
      registroExiste.matricula = usuario.matricula;
      registroExiste.nome_usuario = usuario.nome_usuario;

      const parametroGravado = await ucGravarParametro.run();

      response.ok(parametroGravado);
      return;
    }
  }

  const parametroGravado = await ucGravarParametro.run();

  response.ok(parametroGravado);
}

/**2. Na classe `UcGravarParametro`, você precisará fazer algumas alterações para capturar as informações atualizadas e 
 * tratá-las como uma reinclusão. 
 * 
 * - Adicione um novo parâmetro na função `validate` para receber as informações do parâmetro existente:
*/


async validate(usuario, novoParametro, parametroExistente) {
  this.novoParametro = novoParametro;
  this.usuario = usuario;
  this.parametroExistente = parametroExistente;
  this.validated = true;
}

- No método `run()`, verifique se o parâmetro existente está definido. Se estiver, atualize as informações e trate como uma reinclusão:


async run() {
  // ... código existente ...

  if (this.parametroExistente) {
    this.novoParametro.id = this.parametroExistente.id;
    this.novoParametro.ativo = "1";
    this.novoParametro.matricula = this.usuario.matricula;
    this.novoParametro.nome_usuario = this.usuario.nome_usuario;

    const dadosPreparados = await this.ParamAlcadasIncluirFactory.incluirParametro(
      this.novoParametro
    );
    const parametroGravado = await this.ParametrosAlcadasRepository.gravarParametro(
      dadosPreparados
    );

    return parametroGravado;
  }

  // ... código existente ...
}
