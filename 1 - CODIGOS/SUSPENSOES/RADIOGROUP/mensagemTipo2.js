/**
 * Ao remover a propriedade `rules`, o campo "Tipo" não exibirá a mensagem "'Por favor, selecione um tipo!'" quando uma opção for selecionada no Radio.Group, 
 * mas ainda aplicará regras de validação quando o formulário é submetido.
 * 
 * Esta alteração deve garantir que a mensagem de erro seja mostrada apenas quando o campo “Tipo” estiver vazio e o formulário for submetido.
 * 
 * Para mostrar a mensagem "'Por favor, selecione um tipo!'" somente se uma opção não estiver selecionada e passar para o próximo campo quando uma opção for 
 * selecionada no Radio.Group, você pode fazer as seguintes alterações em seu código:

 1. Remova o estado `mostrarMensagemValidacao`, pois ele não parece ser usado em seu código.

 2. Modifique o `Form.Item` do campo "Tipo" (Radio.Group) para remover a propriedade `rules` e a mensagem de erro associada.

 Aqui está o código modificado para o campo “Tipo”:
*/


<Form.Item label="Tipo">
  <Radio.Group
    onChange={(e) => {
      handleTipoChange(e);
      if (e.target.value !== 'matricula') {
        form.setFieldsValue({ tipo: undefined });
      } else {
        form.setFieldsValue({ tipo: e.target.value });
      }
    }}
    value={opcaoSelecionada}
  >
    <Radio value="cd_vicepres_juris"> Vice Presidência </Radio>
    <Radio value="cd_diretor_juris"> Unid. Estratégica </Radio>
    <Radio value="cd_super_juris"> Unid. Tática </Radio>
    <Radio value="cd_gerev_juris"> Comercial </Radio>
    <Radio value="prefixo"> Prefixo </Radio>
    <Radio value="matricula"> Matrícula </Radio>
  </Radio.Group>
</Form.Item>
