/**
 * Com essa modificação, estamos adicionando a "matrícula" do usuário, obtida da constante "dadosDoUsuario", ao 
 * objeto "dadosSuspensao" como "matriculaResponsavel". Dessa forma, você poderá gravar essa informação no banco 
 * de dados como necessário.
 * 
 * Para incluir "matrícula" como "matriculaResponsavel" dentro de "dadosSuspensao", você pode fazer a seguinte 
 * alteração na constante "dadosSuspensao":
 */

function gravaSuspensao() {
  const dadosForm = form.getFieldsValue();

  const dadosSuspensao = {
    ...dadosForm,
    [tipoSelecionado]: dadosForm.tipo,
    tipo: undefined, // Para evitar que o campo "tipo" seja enviado na requisição
    matriculaResponsavel: dadosDoUsuario.matricula, // Incluindo a matrícula como matriculaResponsavel
  };

  // Definir os demais tipos como "0"
  const tipos = ['vicePresi', 'diretoria', 'supers', 'gerev', 'prefixo', 'matricula'];
  for (const tipo of tipos) {
    if (tipo !== tipoSelecionado) {
      dadosSuspensao[tipo] = '0';
    }
  }

  // Restante do código...
}
