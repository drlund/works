/**
 * O problema parece estar relacionado à forma como você está manipulando os estados `tipoSelecionado` e `tipoInputValue`. Aqui estão algumas sugestões 
 * para corrigir isso:
 * 
 * 1. Em `handleTipoChange`, defina `tipoSelecionado` com base no valor selecionado, mas apenas se for diferente de "Matrícula". Se for "Matrícula", defina 
 * `tipoSelecionado` como vazio. Além disso, limpe o campo `tipo`:
 */

const handleTipoChange = (e) => {
  const valorSelecionado = e.target.value;

  if (valorSelecionado !== 'matricula') {
    setTipoSelecionado(tipoJurisdicoesMap[valorSelecionado]);
    form.setFieldsValue({ tipo: '' }); // Limpar o campo "tipo"
  } else {
    setTipoSelecionado('');
  }

  // Restante do seu código
};

/**
 * 2. No seu componente `InputFunciSuspensao`, verifique se o valor de `tipoSelecionado` é "matricula" antes de renderizar o campo. Se não for, retorne `null` 
 * para não renderizar o componente:
 */

const InputFunciSuspensao = ({ value, tipoSelecionado }) => {
  if (tipoSelecionado !== 'matricula') {
    return null; // Não renderizar o componente
  }

  // Restante do seu código para renderizar o componente InputFunciSuspensao
};

/**
 * Essas mudanças devem ajudar a garantir que o campo "tipo" seja limpo quando uma opção diferente de "Matrícula" for selecionada e que o componente `InputFunciSuspensao` 
 * não seja renderizado quando "Matrícula" não estiver selecionada. Certifique-se de ajustar o restante do seu código conforme necessário.
 */