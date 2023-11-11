/**
 * Para pré-selecionar o valor "novoTipoDeSuspensao" no campo de entrada correspondente, você pode usar a prop `
 * defaultValue` ou `initialValue` do componente `Input`.  No seu caso, você pode definir o `initialValue` do 
 * componente `Input` para o valor de `novoTipoDeSuspensao`.  Veja como você pode fazer isso:
 */

/**
 * Ao adicionar `initialValue={novoTipoDeSuspensao}`, o campo de entrada será pré-preenchido com o valor de 
 * `novoTipoDeSuspensao` quando o componente for renderizado.  Se você alterar o valor de `novoTipoDeSuspensao` 
 * em seu estado, o campo de entrada também será atualizado de acordo.
 * 
 * Certifique-se de ter a versão mais recente da biblioteca `antd`, pois a propriedade `initialValue` pode não 
 * estar disponível em versões mais antigas.  Se encontrar algum problema, você também pode usar `defaultValue` 
 * em vez de `initialValue`.
 */

<Input
  value={novoTipoDeSuspensao}
  onChange={handleNovoTipoDeSuspensaoChange}
  placeholder="Digite o novo tipo de suspensão"
  initialValue={novoTipoDeSuspensao} // Add this line
/>
