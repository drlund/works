/**
 * Para adicionar a propriedade "ativo" ao modelo "ParamAlcadas", você pode fazer o seguinte:
 * 
*/
// 1. Abra o arquivo do modelo "ParamAlcadas.js" no seu editor de código.
// 2. Logo após a linha `class ParamAlcadas extends Model {`, adicione a seguinte linha:


  static get computed() {
    return ["ativo"];
  }


//,3. Abaixo do método `castDates`, adicione o seguinte método:


  getAtivo() {
    // Lógica para determinar se o item está ativo ou não
    // Por exemplo, se a propriedade "status" for igual a "ativo", retorne true, caso contrário, retorne false.
    return this.status === "ativo";
  }


// 4. Salve o arquivo.

/**
 * Agora você adicionou um campo computado chamado "ativo" ao modelo "ParamAlcadas". O campo "ativo" é definido pelo 
 * método `getAtivo()`, onde você pode implementar a lógica personalizada para determinar se o item está ativo ou não.
 */