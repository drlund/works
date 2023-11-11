/**
 * No código acima, a função `example` recebe um objeto com a propriedade `snakeCase` e a utiliza diretamente ao criar 
 * um objeto no formato `snake_case`. Na função `example2`, após obter o resultado do modelo, é criado um novo objeto 
 * `camelCaseResult` que contém a propriedade `snakeCase` com o valor correspondente da consulta ao banco de dados. Esta 
 * abordagem permite manter os nomes de colunas em `snake_case` no banco de dados e usar nomes em `camelCase` no código 
 * do frontend. Certifique-se de que as propriedades no frontend estejam corretamente mapeadas para os nomes em `camelCase` 
 * que você espera.
 * 
 * Para resolver o problema de conversão de nomes de colunas de `snake_case` para `camelCase`, você pode utilizar uma 
 * função de conversão dentro das funções `example` e `example2`. Aqui está como você pode fazer isso:
 */

function example({ snakeCase }) {
  return model.create({
    snake_case: snakeCase,
  });
}

function example2() {
  const result = model.findall();
  const camelCaseResult = {
    snakeCase: result.snake_case,
  };
  return camelCaseResult;
}
