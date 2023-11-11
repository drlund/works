/**
 * A função `incluirSuspensao` não está fazendo a verificação dos valores corretamente. Vamos corrigir o código para 
 * garantir que esses valores sejam verificados corretamente antes de salvar a suspensão.
 * 
 * Nesta correção, adicionamos a verificação para o caso em que o valor selecionado no botão "Radio" não possui um 
 * mapeamento válido em `tipoJurisdicoesMap`. Também corrigimos o uso da variável `tipoSelecionadoNoRadio` na função 
 * `isValidTipoValue`.
 * 
 * Agora, a função `incluirSuspensao` deve fazer a verificação correta para o tipo selecionado e os valores de 
 * "cd_vicepres_juris: 'vicePresi'", "cd_diretor_juris: 'diretoria'", "cd_super_juris: 'super'", "cd_gerev_juris: 
 * 'gerev'" e "cd_redeage_juris: 'prefixo'" serão devidamente considerados.
 * 
 * Aqui está o código corrigido:
 */

function FormParamSuspensao() {
  // ... outros estados e código ...

  function isValidTipoValue(value, tipoSelecionado) {
    switch (tipoSelecionado) {
      case 'vicePresi':
      case 'diretoria':
      case 'super':
      case 'gerev':
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

    if (!tipoSelecionadoNoRadio) {
      message.error('Opção de tipo selecionada inválida!');
      return;
    }

    if (dadosForm.tipo !== tipoSelecionadoNoRadio) {
      message.error('O valor digitado não corresponde ao valor selecionado no botão "Radio"!');
      return;
    }

    if (!isValidTipoValue(dadosForm.tipo, tipoSelecionadoNoRadio)) {
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
