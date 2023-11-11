/**
 * O erro ocorre porque a regra de validação para o campo "Tipo" está sendo aplicada a todas as opções do `Radio.Group`, incluindo aquelas que não deveriam ser validadas. Vamos ajustar a lógica para que a regra de validação seja aplicada apenas quando "Matrícula" estiver selecionada. Aqui está o trecho corrigido:

```jsx
<Form.Item
  name="tipo"
  label="Tipo"
  rules={
    selectedTipo === 'matricula'
      ? [
          {
            required: true,
            message: 'Por favor, selecione um tipo!',
          },
          // ... (outras regras de validação)
        ]
      : undefined // Não aplicar regra de validação para outras opções
}
>
  {/* Renderiza o componente apropriado com base no tipo selecionado */}
  {renderInputComponent()}
</Form.Item>

//Substitua o trecho relevante do seu código pelo acima. Com essa modificação, a regra de validação será aplicada apenas quando "Matrícula" estiver selecionada no `Radio.Group`, e para as outras opções não será aplicada nenhuma regra de validação. Isso deve resolver o problema de receber a mensagem de validação para as outras opções.