/**
 * Para evitar que o campo seja preenchido automaticamente ao selecionar uma opção no `<Radio.Group>` e evitar que uma opção seja selecionada por padrão, 
 * você pode usar o atributo `defaultValue` no `<Radio.Group>` e configurá-lo como `undefined` para que nenhuma opção seja selecionada por padrão. Além 
 * disso, defina os valores que deseja atribuir ao campo `tipo` diretamente no `form.setFieldsValue` dentro da função `onChange` do `<Radio.Group>`. Aqui 
 * está um exemplo de como fazer isso:
 */

/**
 * Dessa forma, o campo `tipo` não será preenchido automaticamente, e nenhuma opção será selecionada por padrão quando o usuário abrir o formulário. 
 * Certifique-se de testar essa abordagem para ver se ela atende às suas necessidades.
 */

<Radio.Group
  onChange={(e) => {
    handleTipoChange(e);
    if (e.target.value !== 'matricula') {
      form.setFieldsValue({ tipo: undefined }); // Define como undefined para não preencher o campo
    } else {
      form.setFieldsValue({ tipo: e.target.value }); // Configure o valor do campo 'tipo'
    }
  }}
  value={opcaoSelecionada}
>
  <Radio value="vicePresi"> Vice Presidência </Radio>
  <Radio value="diretoria"> Unid. Estratégica </Radio>
  <Radio value="supers"> Unid. Tática </Radio>
  <Radio value="gerev"> Comercial </Radio>
  <Radio value="prefixo"> Prefixo </Radio>
  <Radio value="matricula"> Matrícula </Radio>
</Radio.Group>
