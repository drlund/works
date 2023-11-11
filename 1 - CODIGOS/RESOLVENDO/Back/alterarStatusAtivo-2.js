/**
 * Se a verificação de existência do parâmetro com os mesmos valores já foi realizada no repositório, então você pode fazer 
 * algumas alterações para obter o parâmetro existente na classe `UcGravarParametro` e tratar a alteração como uma reinclusão. 
 * Aqui está uma sugestão de como você pode fazer isso:
 * 
 * Com essas alterações, quando você chamar a função `gravarParametro` e o parâmetro existente for passado para a classe 
 * `UcGravarParametro`, o código irá atualizar o campo `ativo` para "1" e adicionar as informações do usuário atual antes 
 * de chamar a função `run()`. Dessa forma, ele tratará a alteração como uma reinclusão e persistirá as informações atualizadas. 
 * 
 * 1. Na classe `UcGravarParametro`, modifique o método `validate` para receber o parâmetro existente como um argumento adicional:
*/


async validate(usuario, novoParametro, parametroExistente) {
  this.novoParametro = novoParametro;
  this.usuario = usuario;
  this.parametroExistente = parametroExistente;
  this.validated = true;
}

/**
 * 2. No método `run()`, verifique se o parâmetro existente está definido. Se estiver, atualize as informações e trate como 
 * uma reinclusão:
 */

async run() {
  // ... código existente ...

  if (this.parametroExistente) {
    this.parametroExistente.ativo = "1";
    this.parametroExistente.matricula = this.usuario.matricula;
    this.parametroExistente.nome_usuario = this.usuario.nome_usuario;

    const dadosPreparados = await this.ParamAlcadasIncluirFactory.incluirParametro(
      this.parametroExistente
    );
    const parametroGravado = await this.ParametrosAlcadasRepository.gravarParametro(
      dadosPreparados
    );

    return parametroGravado;
  }

  // ... código existente ...
}
