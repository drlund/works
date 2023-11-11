/**
 * Nesse código, a função `snakeToCamel` converte uma string de snake_case para camelCase. A função `convertToCamelCase` 
 * recebe um objeto com propriedades em snake_case e retorna um novo objeto com propriedades em camelCase. Você pode 
 * usar essas funções nos seus exemplos `example` e `example2` para converter os nomes de propriedades conforme necessário.
 */

/**
 * Tenha em mente que essas funções são genéricas e podem ser usadas para converter qualquer objeto com nomes de 
 * propriedades em snake_case para camelCase. Certifique-se de ajustar as chamadas de função nos seus exemplos para 
 * corresponder às suas necessidades específicas.
 */

/**
 * Para resolver o problema de snake_case em JavaScript/Node.js, você pode utilizar uma função que converte os nomes de 
 * propriedades de objeto de snake_case para camelCase. Aqui estão duas funções que você pode usar para converter 
 * automaticamente os nomes de propriedades de objeto:
 */

// Função para converter snake_case em camelCase
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Função que cria um objeto com nomes de propriedades em camelCase
function convertToCamelCase(obj) {
  const newObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[snakeToCamel(key)] = obj[key];
    }
  }
  return newObj;
}

// Exemplo de uso para a primeira função
function example({ snake_case }) {
  const camelCaseObject = {
    snakeCase: snake_case,
  };
  return model.create(convertToCamelCase(camelCaseObject));
}

// Exemplo de uso para a segunda função
function example2() {
  const result = model.findall();
  return {
    snakeCase: result.snake_case,
  };
}

// Testando as funções
const inputObject = { snake_case: "example_input" };
const outputObject = convertToCamelCase(inputObject);
console.log(outputObject);
