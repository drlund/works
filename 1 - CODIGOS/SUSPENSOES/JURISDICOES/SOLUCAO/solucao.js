/**
 * Para confirmar se o valor digitado no campo "tipo" está dentro do valor correspondente selecionado no botão "Radio", 
 * você pode fazer uma verificação no evento de envio do formulário (no método `incluirSuspensao`) ou no evento de mudança 
 * do campo "tipo" (no método `handleTipoChange`). Vou demonstrar como realizar a verificação no evento de envio do formulário.
 * 
 * No trecho abaixo, ao enviar o formulário, a função `incluirSuspensao` é chamada, e antes de gravar os dados, é feita a 
 * verificação para confirmar se o valor digitado no campo "tipo" corresponde ao valor selecionado no botão "Radio". Caso 
 * não correspondam, uma mensagem de erro é exibida. Essa verificação garante que o valor digitado esteja de acordo com a 
 * opção selecionada no "Radio.Group".
 * 
 * Neste exemplo, assumirei que o valor digitado no campo "tipo" corresponde a uma das chaves do objeto `tipoJurisdicoesMap`:
 */

function FormParamSuspensao() {
  // ... outros estados e código ...

  function incluirSuspensao() {
    const dadosForm = form.getFieldsValue();
    const tipoSelecionadoNoRadio = tipoJurisdicoesMap[tipoSelecionado];

    if (dadosForm.tipo !== tipoSelecionadoNoRadio) {
      // Mostra uma mensagem de erro ou trata o caso de valor inválido aqui
      message.error('O valor digitado não corresponde ao valor selecionado no botão "Radio"!');
      return;
    }

    if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
      return gravarSuspensao(dadosForm);
    }

    return incluirSuspensao();
  }

  // ... restante do seu código ...
}
