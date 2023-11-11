/** 
 * No contexto do JSDoc, você pode corrigir o problema usando a anotação correta para informar ao TypeScript o tipo esperado. 
 * No seu caso, você está tentando desestruturar um número e atribuí-lo a uma propriedade `idParametro`, mas os números não possuem essa propriedade.
 * Você pode resolver o problema adicionando uma anotação de tipo para `location.state.id` no JSDoc. Aqui está um exemplo de como fazer isso:
 * 
 * Neste exemplo, criamos um typedef chamado `LocationState` que descreve a estrutura do objeto `location.state`. Ele possui uma propriedade 
 * `idParametro` do tipo `number`. Em seguida, na função `FormParamAlcadas`, usamos essa anotação de tipo para informar ao TypeScript que 
 * `location.state` deve ter o formato `LocationState`. 
 * 
 * Além disso, adicionamos a anotação de tipo `@type {number}` para a constante `idParametro` para indicar explicitamente que ela é do tipo `number`. 
 * Ao usar as anotações corretas, o TypeScript será capaz de inferir os tipos corretos e o erro "Property 'idParametro' does not exist on type 
 * 'Number'" será resolvido. Certifique-se de atualizar seu código com as anotações apropriadas.
*/


/**
 * @typedef {Object} LocationState
 * @property {number} idParametro - O ID do parâmetro
 */

/**
 * @param {Object} props
 * @param {LocationState} props.location.state - O estado da localização
 */
function FormParamAlcadas({ location }) {
  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);

  /** @type {number} */
  const idParametro = parseInt(location.state.id, 10);

  // Resto do código...
}
