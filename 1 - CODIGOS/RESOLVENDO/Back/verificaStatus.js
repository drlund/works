/**Certifique-se de que você esteja usando um banco de dados adequado ao seu ambiente de execução JavaScript, como o MongoDB, 
 * MySQL ou PostgreSQL. Aqui está um exemplo de função JavaScript que verifica se uma chave existe no banco de dados e, se 
 * existir, atualiza a coluna "ativo" do "id" correspondente para "1":
 * 
 * Neste exemplo fictício, temos um banco de dados simulado com uma matriz de registros. A função `atualizarAtivo` recebe os 
 * valores do `prefixoDestino` e `comissaoDestino`. Em seguida, ela verifica se existe um registro com esses valores no banco 
 * de dados. Se o registro for encontrado, o campo `ativo` do registro correspondente é atualizado para `1`. Caso contrário, 
 * uma mensagem é exibida informando que o registro não foi encontrado. Lembre-se de adaptar essa função de acordo com o banco 
 * de dados real que você está usando, substituindo as operações de conexão, consulta e atualização do banco de dados pelos 
 * métodos apropriados da biblioteca ou driver que você está utilizando.
 */


function atualizarAtivo(prefixoDestino, comissaoDestino) {
  // Conexão com o banco de dados (exemplo fictício)
  const bancoDeDados = {
    registros: [
      { id: 1, prefixoDestino: 'ABC', comissaoDestino: 10, ativo: 0 },
      { id: 2, prefixoDestino: 'DEF', comissaoDestino: 20, ativo: 0 },
      { id: 3, prefixoDestino: 'GHI', comissaoDestino: 30, ativo: 0 }
    ]
  };

  // Verifica se a chave existe no banco de dados
  const registro = bancoDeDados.registros.find(
    registro =>
      registro.prefixoDestino === prefixoDestino &&
      registro.comissaoDestino === comissaoDestino
  );

  if (registro) {
    // Atualiza o campo "ativo" para 1
    registro.ativo = 1;
    console.log(`Registro atualizado: id ${registro.id}`);
  } else {
    console.log('Registro não encontrado.');
  }
}

// Exemplo de uso da função
atualizarAtivo('ABC', 10);

