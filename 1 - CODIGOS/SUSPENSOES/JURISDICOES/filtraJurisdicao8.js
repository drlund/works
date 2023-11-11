/**
 * O erro ocorre porque o componente "Radio.Group" está retornando a string da opção selecionada (por exemplo, "vicePresi" ou "diretoria"), 
 * mas o array "tiposJurisdicoes" contém objetos com a propriedade "id". Portanto, quando você usa `some` para verificar se o valor selecionado 
 * existe no array "tiposJurisdicoes", o resultado não é bem-sucedido, já que eles são tipos de dados diferentes.
 * 
 *  Certifique-se de que os valores do campo "value" em cada opção do componente "Radio" correspondam ao id do tipo de jurisdição na tabela 
 * do banco de dados, conforme definido na variável "tiposJurisdicoes".
 * 
 * Para resolver o problema, você pode usar o valor retornado pelo "Radio.Group" para obter o objeto correspondente no array "tiposJurisdicoes" 
 * e, em seguida, verificar se esse objeto existe. Vou fornecer um exemplo de como fazer isso:
 */


const handleTipoChange = (/** @type {{ target: { value: any; }; }} */ e) => {
  const valorSelecionado = e.target.value;

  // Busca o objeto no array tiposJurisdicoes que corresponde ao valor selecionado
  const tipoSelecionado = tiposJurisdicoes.find((tipo) => tipo.id === valorSelecionado);

  // Verifica se o objeto foi encontrado, ou seja, se o valor selecionado é válido
  if (!tipoSelecionado) {
    // Mostra uma mensagem de erro ou trata o caso de valor inválido aqui
    message.error('Valor selecionado não é válido!');
    return;
  }

  // Restante do código igual ao anterior
  setTipoSelecionado(valorSelecionado);

  // ... o restante do seu código aqui
};
