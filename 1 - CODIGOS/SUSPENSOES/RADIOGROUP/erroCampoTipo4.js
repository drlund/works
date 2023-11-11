/**
 * Se os valores desses campos devem estar no formato "0000", você pode ajustar a lógica de validação da seguinte forma:
 * 
 * 1. Atualize a função `validarTipo` para os campos específicos, como "Vice Presidência," "Unid. Estratégica," "Unid. Tática" e "Comercial," 
 * para validar se os valores estão no formato correto "0000":
 */

/**
 * Nesse código, a expressão regular `formatoCampoEspecifico` verifica se o valor tem quatro dígitos, como "0000". Certifique-se de ajustar essa 
 * expressão regular de acordo com o formato real esperado para esses campos específicos.
 * 
 * Com essa atualização na função `validarTipo`, os campos "Vice Presidência," "Unid. Estratégica," "Unid. Tática" e "Comercial" serão validados 
 * corretamente no formato "0000". Certifique-se de ajustar a expressão regular conforme necessário para atender aos requisitos específicos de 
 * validação do seu aplicativo.
 */

function validarTipo(value, tipoSelecionado) {
  if (!tipoSelecionado) {
    return false;
  }

  if (tipoSelecionado === 'matricula') {
    const formatoMatricula = /^F\d{7}$/;
    return formatoMatricula.test(value);
  }

  if (tipoSelecionado === 'cd_vicepres_juris' ||
      tipoSelecionado === 'cd_diretor_juris' ||
      tipoSelecionado === 'cd_super_juris' ||
      tipoSelecionado === 'cd_gerev_juris') {
    const formatoCampoEspecifico = /^\d{4}$/; // Formato "0000"
    return formatoCampoEspecifico.test(value);
  }

  const chaveJurisdicao = `${tipoSelecionado}Juris`;

  const dadosDaJurisdicao = dadosJurisdicoes[chaveJurisdicao];
  if (!dadosDaJurisdicao) {
    return false;
  }

  const valoresDaJurisdicao = dadosDaJurisdicao.map(
    (item) => Object.values(item)[0],
  );
  return valoresDaJurisdicao.includes(value);
}
