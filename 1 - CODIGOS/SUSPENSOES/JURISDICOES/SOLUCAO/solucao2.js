/**
 * A mensagem de erro está sendo exibida para todas as opções porque a verificação está sendo feita apenas com base 
 * no valor digitado no campo "tipo" e não considerando a relação entre o valor digitado e o valor selecionado no botão 
 * "Radio".
 * 
 * Nesta correção, adicionamos a função `isValidTipoValue`, que é responsável por verificar se o valor digitado no campo "
 * tipo" está de acordo com o formato esperado para cada opção selecionada no botão "Radio". As expressões regulares 
 * utilizadas nos casos do switch correspondem aos formatos esperados para cada tipo.
 * 
 * Agora, a verificação é feita corretamente, e a mensagem de erro só será exibida quando o valor digitado não corresponder 
 * ao valor selecionado no botão "Radio" ou quando o formato do valor digitado não estiver de acordo com o tipo selecionado.
 * 
 * Vamos corrigir o código para fazer essa verificação de forma adequada. Precisamos comparar o valor digitado no campo 
 * "tipo" com o formato esperado com base na opção selecionada no botão "Radio". Para isso, podemos utilizar uma função 
 * auxiliar para validar o formato do valor digitado.
 * 
 * Aqui está o código corrigido:
 */

function FormParamSuspensao() {
  // ... outros estados e código ...

  function isValidTipoValue(value, tipoSelecionado) {
    switch (tipoSelecionado) {
      case 'vicePresi':
        return /^\d{4}$/.test(value);
      case 'diretoria':
        return /^\d{4}$/.test(value);
      case 'super':
        return /^\d{4}$/.test(value);
      case 'gerev':
        return /^\d{4}$/.test(value);
      case 'prefixo':
        return /^\d{4}$/.test(value);
      case 'matricula':
        return /^F\d{7}$/.test(value);
      default:
        return false;
    }
  }

  function incluirSuspensao() {
    const dadosForm = form.getFieldsValue();
    const tipoSelecionadoNoRadio = tipoJurisdicoesMap[tipoSelecionado];

    if (dadosForm.tipo !== tipoSelecionadoNoRadio) {
      message.error('O valor digitado não corresponde ao valor selecionado no botão "Radio"!');
      return;
    }

    if (!isValidTipoValue(dadosForm.tipo, tipoSelecionado)) {
      message.error('Valor digitado inválido para o tipo selecionado!');
      return;
    }

    if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
      return gravarSuspensao(dadosForm);
    }

    return incluirSuspensao();
  }

  // ... restante do seu código ...
}
