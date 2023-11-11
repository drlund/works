// 14/07/2023

/**
 * Parece haver um problema na passagem dos parâmetros `registroExiste` e `ativo` para a função `gravarParametro`.
 * 
 * Com essas modificações, os parâmetros `registroExiste` e `ativo` serão passados corretamente para a função 
 * `gravarParametro` na use case, permitindo a alteração da observação conforme necessário.
 * 
 * Aqui está uma sugestão de como modificar o código para garantir que esses parâmetros sejam passados corretamente:
 * 
 * 1. Na função `gravarParametro` da sua controller, certifique-se de que `registroExiste` e `ativo` sejam passados 
 * corretamente como argumentos ao chamar a função `gravarParametro` na use case `UcGravarParametro`.
 */

async gravarParametro({ request, response, session, registroExiste, ativo }) {
  const dadosDosParametros = request.allParams();
  const usuario = session.get("currentUserAccount");
  const acao = "Inclusão";
  const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
  dadosDosParametros.observacao = `Matrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - ${dadosDosParametros.observacao}`;

  const ucGravarParametro = new UcGravarParametro(
    new ParametrosAlcadasRepository(),
    new ParamAlcadasIncluirFactory()
  );
 
  if (registroExiste && ativo === "1") {
    const usuario = session.get("currentUserAccount");
    const acao = "Reinclusão";
    const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
    dadosDosParametros.observacao = `Matrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - ${dadosDosParametros.observacao}`;
  }

  await ucGravarParametro.validate(usuario, dadosDosParametros, registroExiste);
  const parametroGravado = await ucGravarParametro.run();

  response.ok(parametroGravado);
}


/**
 * 2. Na classe `UcGravarParametro`, modifique a função `validate` para receber o parâmetro `registroExistente`:
 */

async validate(usuario, novoParametro, parametroExistente) {
  this.novoParametro = novoParametro;
  this.usuario = usuario;
  this.parametroExistente = parametroExistente;
  this.validated = true;
}


/**
 * 3. Na função `run()` da classe `UcGravarParametro`, modifique a chamada para a função `gravarParametro` na sua 
 * repository, passando o parâmetro `this.parametroExistente`:
 */

async run() {
  if (this.validated === false) {
    throw new Error("O método validate() deve ser chamado antes do run()");
  }

  const dados = {
    ...this.novoParametro,
    matricula: this.usuario.matricula,
    nome_usuario: this.usuario.nome_usuario,
    parametroExistente: this.parametroExistente
  };

  const dadosPreparados = await this.ParamAlcadasIncluirFactory.incluirParametro(dados);
  const parametroGravado = await this.ParametrosAlcadasRepository.gravarParametro(
    dadosPreparados,
    this.parametroExistente
  );

  return parametroGravado;
}


/** 
 * 4. Por fim, na sua repository `ParametrosAlcadasRepository`, certifique-se de receber o parâmetro `registroExistente` corretamente e utilize-o para atualizar a observação, se necessário.
 */
