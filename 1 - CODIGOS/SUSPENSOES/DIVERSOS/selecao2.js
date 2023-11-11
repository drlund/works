/**
 * Pré-selecionar uma opção em um componente `<Select>` do Ant Design com base na variável de estado `novoTipoDeSuspensao`. 
 * Para fazer isso, você pode usar a propriedade `value` do componente `<Select>` e defini-la como o valor que você deseja 
 * que seja selecionado. Eis como você pode fazer isso:
 */

/**
 * Ao definir `value={novoTipoDeSuspensao}`, o componente `<Select>` exibirá a opção cujo valor corresponde à variável de 
 * estado `novoTipoDeSuspensao` como a opção selecionada quando o componente for renderizado. Se você alterar o valor de 
 * `novoTipoDeSuspensao` no seu estado, a opção selecionada no `<Select>` também será atualizada de acordo.
 */

<Select
  placeholder="Selecione o tipo de suspensão"
  onChange={(value) => {
    if (value === 'novo') {
      setModalVisible(true);
    }
  }}
  value={novoTipoDeSuspensao} // Defina o valor selecionado aqui
>
  {tiposSuspensao.map((tipo) => (
    <Select.Option key={tipo.id} value={tipo.id}>
      {tipo.mensagem}
    </Select.Option>
  ))}
  <Select.Option
    key="novo"
    value="novo"
    style={{ fontWeight: 'bold', color: 'green' }}
  >
    ** INCLUIR NOVO TIPO DE SUSPENSÃO **
  </Select.Option>
</Select>
