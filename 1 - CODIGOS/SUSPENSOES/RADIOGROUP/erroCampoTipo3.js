/**
 * Parece que o problema é que os valores "Vice Presidência," "Unid. Estratégica," "Unid. Tática" e "Comercial" estão sendo incluídos quando você seleciona 
 * essas opções no `Radio.Group`. Para resolver esse problema, você deve ajustar o nome dos valores nas opções do `Radio.Group` para corresponder aos valores 
 * esperados no `handleTipoChange` e na função `validarTipo`. Além disso, você também deve garantir que esses valores sejam reconhecidos corretamente. Aqui 
 * estão as modificações necessárias:
 * 
 * 1. Atualize as opções do `Radio.Group` para usar os valores esperados, como "cd_vicepres_juris," "cd_diretor_juris," etc.:
 */

<Radio.Group
  onChange={(e) => {
    if (e.target.value !== 'matricula') {
      form.setFieldsValue({ tipo: '' });
    }
    handleTipoChange(e);
    form.setFieldsValue({ tipo: e.target.value });
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

// 2. Atualize a função `validarTipo` para tratar esses valores corretamente:

function validarTipo(value, tipoSelecionado) {
  if (!tipoSelecionado) {
    return false;
  }

  if (tipoSelecionado === 'matricula') {
    const formatoMatricula = /^F\d{7}$/;
    return formatoMatricula.test(value);
  }

  const chaveJurisdicao = `${tipoSelecionado}Juris`;

  if (tipoSelecionado === 'cd_vicepres_juris' ||
      tipoSelecionado === 'cd_diretor_juris' ||
      tipoSelecionado === 'cd_super_juris' ||
      tipoSelecionado === 'cd_gerev_juris') {
    // Aqui você deve tratar os valores específicos como necessário
    // Por exemplo, validar se o valor está na lista correta
    // Substitua este comentário com a lógica adequada.
    return true; // Altere isso para a lógica real de validação
  }

  const dadosDaJurisdicao = dadosJurisdicoes[chaveJurisdicao];
  if (!dadosDaJurisdicao) {
    return false;
  }

  const valoresDaJurisdicao = dadosDaJurisdicao.map(
    (item) => Object.values(item)[0],
  );
  return valoresDaJurisdicao.includes(value);
}

/**
 * 3. Certifique-se de atualizar a lógica dentro da função `validarTipo` para tratar adequadamente os valores específicos "Vice Presidência," "Unid. 
 * Estratégica," "Unid. Tática" e "Comercial" de acordo com a sua necessidade.
 * 
 * Com essas modificações, você deve conseguir resolver o problema de inclusão indesejada desses valores e também o erro de validação. Certifique-se 
 * de ajustar a lógica de validação conforme necessário para essas opções específicas.
 */