/** 
 * Se o campo da tabela tiver o nome "ativo" e aceitar os valores "0" ou "1", você pode adicionar a propriedade "ativo" 
 * ao modelo "ParamAlcadas" da seguinte forma:
 */

// 1. Abra o arquivo do modelo "ParamAlcadas.js" no seu editor de código.
// 2. Abaixo do método `castDates`, adicione o seguinte código:

  /**
   * @override
   */
  static get hidden() {
    return ["ativo"];
  }

  /**
   * @override
   */
  static get computed() {
    return ["isAtivo"];
  }

  /**
   * @override
   */
  getIsAtivo() {
    return this.ativo === "1";
  }

// 3. Salve o arquivo.

/** Agora você adicionou a propriedade "isAtivo" ao modelo "ParamAlcadas". O campo "ativo" é ocultado usando o método `hidden` 
 * para evitar que seja retornado nas consultas. Em vez disso, você adicionou um campo computado chamado "isAtivo" que retorna 
 * true se o valor de "ativo" for "1" e false caso contrário. 
 * 
 * Dessa forma, você pode acessar a propriedade "isAtivo" nos objetos do modelo "ParamAlcadas" para verificar se o item está 
 * ativo ou não.
*/