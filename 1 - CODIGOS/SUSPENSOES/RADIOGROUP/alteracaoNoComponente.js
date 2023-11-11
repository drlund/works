/**
 * Para resolver o problema no seu componente `InputFunciSuspensao`, você pode incluir a verificação de `tipoSelecionado` na função `render` para 
 * decidir se o componente deve ser renderizado ou não. Você pode fazer isso da seguinte maneira:
 */

//Certifique-se de que você passa `tipoSelecionado` como uma prop para o componente `InputFunciSuspensao` quando o utiliza no componente `FormParamSuspensao`.

/**
 * Essa verificação garantirá que o componente `InputFunciSuspensao` não seja renderizado quando `tipoSelecionado` não for "matricula", de acordo com 
 * a lógica que você deseja implementar.
 */

render() {
  const { tipoSelecionado } = this.props;

  // Verifique se tipoSelecionado é "matricula"
  if (tipoSelecionado !== 'matricula') {
    return null; // Não renderizar o componente
  }

  // Restante do seu código de renderização do componente InputFunciSuspensao
}
