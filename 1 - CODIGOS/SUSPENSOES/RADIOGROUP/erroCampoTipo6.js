/**
 * Para evitar que os valores das opções do `<Radio.Group>` apareçam no campo ao fazer a seleção, você pode usar um valor diferente, como uma string 
 * vazia (''), para essas opções. Aqui está como você pode fazer isso:
 */

/**
 * Ao definir um valor vazio ('') para a opção "Matrícula," o campo `tipo` não será preenchido com "cd_vicepres_juris", "cd_diretor_juris", "cd_super_juris" 
 * ou "cd_gerev_juris" ao fazer a seleção. Certifique-se de que isso resolva o problema que você está enfrentando.
 */

<Radio.Group
  onChange={(e) => {
    handleTipoChange(e);
    form.setFieldsValue({ tipo: e.target.value }); // Configure o valor do campo 'tipo'
  }}
  value={opcaoSelecionada}
>
  <Radio value="vicePresi"> Vice Presidência </Radio>
  <Radio value="diretoria"> Unid. Estratégica </Radio>
  <Radio value="supers"> Unid. Tática </Radio>
  <Radio value="gerev"> Comercial </Radio>
  <Radio value="prefixo"> Prefixo </Radio>
  <Radio value=""> Matrícula </Radio> {/* Use uma string vazia para 'Matrícula' */}
</Radio.Group>
