/**
 * Parece que o erro está ocorrendo porque o formato esperado para a "matrícula" é diferente dos outros tipos. Para resolver isso, você pode adicionar 
 * uma lógica para validar o formato da "matrícula" e evitar que a validação ocorra se o tipo selecionado for "matrícula". Aqui está uma modificação na 
 * função `validarTipo` para tratar esse caso:
 */

/**
 * Nesse código, estamos verificando se o tipo selecionado é "matrícula" e, se for, aplicamos uma lógica personalizada de validação com uma expressão regular 
 * (formatoMatricula). Você deve substituir a expressão regular pela que corresponde ao formato correto da matrícula na sua aplicação.
 * 
 * Dessa forma, o erro não deve mais ocorrer quando você digitar o valor da matrícula no campo correspondente. Certifique-se de que a expressão regular 
 * corresponda ao formato esperado da matrícula na sua aplicação.
 */

function validarTipo(value, tipoSelecionado) {
  if (!tipoSelecionado) {
    return false;
  }

  if (tipoSelecionado === 'matricula') {
    // Lógica para validar o formato da matrícula aqui
    // Por exemplo, você pode usar expressões regulares para verificar o formato
    // Se o formato for válido, retorne true; caso contrário, retorne false
    // Substitua a expressão regular abaixo pela que corresponde ao formato da matrícula
    const formatoMatricula = /^F\d{7}$/;
    return formatoMatricula.test(value);
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
