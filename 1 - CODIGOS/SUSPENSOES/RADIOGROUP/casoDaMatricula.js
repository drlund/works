/**
 * Parece que, ao selecionar a opção "Matrícula", que tem um formato diferente, e começar a digitar, o componente não limpa automaticamente o valor da 
 * "Matrícula" quando você escolhe uma das outras opções. Para corrigir isso, você pode adicionar uma lógica ao `onChange` do `Radio.Group` para limpar 
 * o valor quando uma opção diferente for selecionada. Aqui está como você pode fazer isso:
 */

/**
 * Nesse trecho de código, adicionamos uma verificação para garantir que, se a opção selecionada não for "Matrícula", o valor do campo "Tipo" seja limpo 
 * usando `form.setFieldsValue({ tipo: '' })`. Isso garantirá que o valor seja apagado quando você escolher qualquer outra opção que não seja "Matrícula". 
 * Certifique-se de incluir isso no seu código para obter o comportamento desejado.
 */

<Radio.Group
  onChange={(e) => {
    if (e.target.value !== 'matricula') {
      // Limpar o valor se a opção selecionada não for "Matrícula"
      form.setFieldsValue({ tipo: '' });
    }
    handleTipoChange(e);
    form.setFieldsValue({ tipo: e.target.value });
  }}
  value={opcaoSelecionada}
>
  {/* Seus radios aqui */}
</Radio.Group>

