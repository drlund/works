// Data: 14/07/2023

/**
 * Parece que há um problema na implementação da gravação dos dados de data e do usuário no banco de dados. Vou destacar 
 * algumas áreas em que as modificações devem ser feitas para resolver esse problema.
 * 
 * Após fazer essas modificações, o código deve persistir corretamente os dados de data e do usuário no banco de dados 
 * durante a gravação do parâmetro.
 * 
 * 1. Na função `gravarParametro` da sua controller, modifique a linha onde você adiciona as informações do usuário e a 
 * data para `dadosDosParametros`. Certifique-se de que a propriedade correta para a observação seja utilizada, conforme 
 * sua estrutura de dados:
*/


dadosDosParametros.observacao = `Matrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - ${dadosDosParametros.observacao}`;

/**
 * 2. Na classe `UcGravarParametro`, no método `run()`, certifique-se de que você está passando corretamente as informações 
 * para a função `incluirParametro` da fábrica `ParamAlcadasIncluirFactory`. Verifique se você está passando o objeto 
 * `this.novoParametro` ou `this.parametroExistente` conforme apropriado:
 */


if (this.parametroExistente) {
  const dadosPreparados = await this.ParamAlcadasIncluirFactory.incluirParametro(this.parametroExistente);
  const parametroGravado = await this.ParametrosAlcadasRepository.gravarParametro(dadosPreparados);
  return parametroGravado;
}

const dados = {...this.novoParametro, matricula: this.usuario.matricula, nome_usuario: this.usuario.nome_usuario};
const dadosPreparados = await this.ParamAlcadasIncluirFactory.incluirParametro(dados);
const parametroGravado = await this.ParametrosAlcadasRepository.gravarParametro(dadosPreparados);

return parametroGravado;

/**
 * 3. Verifique também a implementação da função `gravarParametro` no seu repositório `ParametrosAlcadasRepository`. Certifique-se de que os dados corretos estão sendo gravados no banco de dados.
 */
