/**
 * Dessa forma, antes de enviar a requisição, estamos definindo explicitamente os valores dos demais tipos como "0" no objeto 
 * "dadosSuspensao". Assim, você garante que os demais campos do objeto terão o valor desejado ao serem enviados na requisição.
 * 
 * Para garantir que os valores dos demais tipos sejam gravados como "0", você pode ajustar a constante "dadosSuspensao" da 
 * seguinte maneira:
 */

function gravaSuspensao() {
  const dadosForm = form.getFieldsValue();

  const dadosSuspensao = {
    ...dadosForm,
    [tipoSelecionado]: dadosForm.tipo,
    tipo: undefined, // Para evitar que o campo "tipo" seja enviado na requisição
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
