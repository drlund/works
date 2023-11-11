/**No contexto do JSDoc, você pode resolver o erro "Property 'idParametro' does not exist on type 'Number'" usando as anotações corretas para 
 * informar ao TypeScript sobre o tipo esperado. Aqui está um exemplo de como você pode fazer isso:
 * 
 * Neste exemplo, estamos usando a anotação `@param` para descrever o parâmetro `objeto` como um objeto que possui a propriedade `idParametro` 
 * como um número. Ao acessar `objeto.idParametro` dentro da função, o TypeScript entenderá que a propriedade está presente e é do tipo `number`. 
 * 
 * Certifique-se de adicionar as anotações adequadas para os parâmetros e variáveis relevantes no seu código, garantindo que o TypeScript 
 * entenda corretamente os tipos de dados. Isso ajudará a evitar erros de compilação e fornecerá recursos úteis de autocompletar e verificação 
 * de tipo durante o desenvolvimento.
 */


/**
 * @param {Object} objeto - O objeto que contém a propriedade 'idParametro'
 * @param {number} objeto.idParametro - O ID do parâmetro
 */
function minhaFuncao(objeto) {
  // Aqui você pode acessar a propriedade 'idParametro' do objeto
  const id = objeto.idParametro;
 
  // Resto da lógica da função...
}
