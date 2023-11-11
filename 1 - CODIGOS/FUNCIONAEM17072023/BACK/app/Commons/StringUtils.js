const exception = use('App/Exceptions/Handler');

/**
 *
 *    Classe que fornece serviços relacionados a Strings
 *
 */

module.exports = {
  /**
   *
   *   Transforma o nome recebido, colocando as primeiras letras de cada parte do nome em maiúsculo.
   *   Ex.: joão da silva -> João da Silva
   */
  capitalize: (name) => {

    if (typeof name !== "string") {
      throw new exception("Valor recebido ser uma string", 400);
    }

    let textParts = name.toLowerCase().split(" ");
    let result = [];
    const preposicoes = ["dos", "das"];

    for (const word of textParts) {
      if (word.length > 3) {
        result.push(word.replace(/^\w/, c => c.toUpperCase()));
      } else {
        if (word.length === 3 && !preposicoes.includes(word)) {
          result.push(word.replace(/^\w/, c => c.toUpperCase()));
        } else {
          result.push(word);
        }
      }
    }

    return result.join(" ");
  },

  /**
   *    Função que recebe uma string e um array de variáveis, transformando essa string substituindo as ocorrências do tipo '{<indiceNoArrayDeVariaveis>}'
   *    pela respectiva ocorrência no array variáveis.
   *
   *    A substituição irá seguir a ordem posicional do array de variáveis, sendo que a posição 0 do array equivale a {1} da string
   *
   *    Ex.:
   *      stringOriginal = "Esta é um string exemplo. Criada por {1} no dia {2}"
   *      variaveis = [ "Fulano de tal" , "01/01/1900" ]
   *
   *      let stringTransformada = replaceVariables(strinExemplo, variaveis)
   *      console.log(stringTransformada) // Exibirá: Esta é um string exemplo. Criada por Fulano de Tal no dia 01/01/1900
   *
   * @param {string} string  String a ser transformada
   * @param {Array} variaveis Array contendo as variaveis que irão substituir as ocorrências na string original
   *
   * @return {string} String com as substituições
   *
   */

  replaceVariable: (string, variaveis) => {

    if (typeof string !== "string") {
      throw new exception("Valor recebido deve ser uma string", 400);
    }

    let i = 1;

    for (const variavel of variaveis){
      let regex = new RegExp('\{['+i+']\}', 'ig');
      string = string.replace(regex, variavel);
      i++;
    }

    return string;
  },

  /**
   *    Função que recebe uma string, identifica se o seu conteúdo corresponde a um dos tipos abaixo e converte para o valor correspondente.
   *
   *     - Numérico (inteiro, float, positivos e negativos)
   *     - Booleano (true ou false)
   *
   *   Caso o valor da string não seja nenhum dos acima, será considerada uma string
   *
   *   @param {string} string String contendo o valor a ser avaliado
   *   @return {(number|boolean|string)} Retorna o valor a ser avaliado
   *
   */

  evalType: string => {
    // Caso o valor da seja "true", "false" ou um valor numérico, será convertido para o valor correspondente
    const evaluated =
      string === "true" ||
      string === "false" ||
      string.match(/^[+-]?([0-9]*[.])?[0-9]+$/)
        ? eval(string)
        : string;

    return evaluated;
  }
};
