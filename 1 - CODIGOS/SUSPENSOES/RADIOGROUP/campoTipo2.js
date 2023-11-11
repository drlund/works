/**
 * Entendi agora que o campo "tipo" é o mesmo para todas as opções, exceto "matricula", e você está alternando entre os componentes `InputPrefixoAlcada` 
 * e `InputFunciSuspensao` com base na seleção de "matricula". Para resolver o problema, você pode condicionar a renderização do componente `InputFunciSuspensao` 
 * apenas quando "matricula" estiver selecionada.
 * 
 * Neste código, o componente `InputFunciSuspensao` só será renderizado quando `tipoSelecionado` for "matricula", caso contrário, o componente `InputPrefixoAlcada` 
 * será renderizado. Isso deve resolver o problema de renderização condicional do campo "tipo" com base na seleção de "matricula". Certifique-se de ajustar os 
 * props conforme necessário para que o componente `InputFunciSuspensao` funcione corretamente quando renderizado.
 * 
 * Aqui está como você pode fazer isso:
 */


<Form.Item
  name="tipo"
  label="Tipo"
  rules={[
    {
      required: true,
      message: mostrarMensagemValidacao
        ? 'Por favor, selecione um tipo!'
        : '',
    },
    // ... outras regras de validação ...
  ]}
>
  {tipoSelecionado === 'matricula' ? (
    <InputFunciSuspensao
      value={tipoInputValue}
      tipoSelecionado={tipoSelecionado}
    />
  ) : (
    <InputPrefixoAlcada
      value={tipoInputValue}
      tipoSelecionado={tipoSelecionado}
      ref={tipoInputRef}
    />
  )}
</Form.Item>
