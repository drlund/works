/**
 * Vou fornecer uma sugestão revisada para garantir que os dados do usuário sejam gravados corretamente.
 * 
 * Na classe `UcGravarParametro`, você precisa modificar o método `run()` para incluir as informações do 
 * usuário e a data atual nos parâmetros existentes antes de chamá-los para gravação no banco de dados.
 * 
 * Certifique-se de ter o pacote `moment` instalado no seu projeto. Esta solução usa o `moment()` para obter 
 * a data atual no formato desejado. 
 * 
 * Após essas modificações, o código deve gravar corretamente as informações do usuário e a data atual, 
 * além do parâmetro de reativação, ao gravar os dados no banco de dados.
 */


const moment = require("moment");

// ...

async run() {
  if (this.validated === false) {
    throw new Error(
      "O método validate() deve ser chamado antes do run()"
    );
  }

  if (this.parametroExistente) {
    this.parametroExistente.ativo = "1";
    this.parametroExistente.matricula = this.usuario.matricula;
    this.parametroExistente.nome_usuario = this.usuario.nome_usuario;
    this.parametroExistente.observacao = `Matrícula: ${this.usuario.matricula} - Data: ${moment().format("YYYY-MM-DD HH:mm:ss")} - Ação: Reinclusão - ${this.parametroExistente.observacao}`;

    const parametroGravado = await this.ParametrosAlcadasRepository.gravarParametro(
      this.parametroExistente
    );

    return parametroGravado;
  }

  const novoParametro = {
    ...this.novoParametro,
    matricula: this.usuario.matricula,
    nome_usuario: this.usuario.nome_usuario,
    observacao: `Matrícula: ${this.usuario.matricula} - Data: ${moment().format("YYYY-MM-DD HH:mm:ss")} - Ação: Inclusão - ${this.novoParametro.observacao}`,
  };

  const dadosPreparados = await this.ParamAlcadasIncluirFactory.incluirParametro(
    novoParametro
  );
  const parametroGravado = await this.ParametrosAlcadasRepository.gravarParametro(
    dadosPreparados
  );

  return parametroGravado;
}
