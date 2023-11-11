//Parece que minha sugestão anterior pode ter causado a remoção acidental do campo "tipo" do formulário quando `tipoSelecionado` não é "matricula".

/**
 * Para evitar que o campo "tipo" desapareça completamente do formulário, você pode renderizá-lo condicionalmente, mas ainda mantendo-o no DOM, mas 
 * apenas escondido. Isso permitirá que você o torne visível novamente quando necessário. Aqui está como você pode fazer isso:
 */

/**
 * Dessa forma, o campo "tipo" ainda estará presente no DOM, mas ficará oculto quando `tipoSelecionado` não for "matricula" e será exibido quando "matricula" 
 * for selecionado. Certifique-se de ajustar as regras de estilo de acordo com o CSS do seu projeto para garantir que o campo seja exibido e ocultado 
 * conforme desejado.
 */

// No método render do componente FormParamSuspensao
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
  style={{ display: tipoSelecionado === 'matricula' ? 'block' : 'none' }}
>
  {renderComponentesInput()}
</Form.Item>
