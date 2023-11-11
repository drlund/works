/**
 * Ao revisar novamente o código, notei que há um erro na linha onde está sendo chamada a função `tiposJurisdicoes.includes(valorSelecionado)`. 
 * O problema é que o valor selecionado (valorSelecionado) é uma string, mas a array tiposJurisdicoes contém objetos com propriedades id e 
 * mensagem. Dessa forma, a verificação utilizando `includes` não será bem-sucedida.
 * 
 * Com essa alteração, o código deve funcionar corretamente e não deverá mais exibir o erro "Valor selecionado não é válido!". Certifique-se 
 * de que o valor do campo "value" em cada opção do componente "Select.Option" corresponda ao id do tipo de jurisdição na tabela do banco de dados.
 * 
 * Para resolver isso, precisamos alterar a forma como os valores de `tiposJurisdicoes` estão sendo verificados. Vou assumir que o valor do 
 * campo "value" no componente "Select.Option" representa o id do tipo de jurisdição. Nesse caso, podemos verificar se o id corresponde ao 
 * valor selecionado. Caso a propriedade `id` no objeto seja a que indica a correspondência, a verificação deve ser realizada assim:
 */

const handleTipoChange = (/** @type {{ target: { value: any; }; }} */ e) => {
  const valorSelecionado = e.target.value;

  // Verifica se o valor selecionado existe nos dados de tiposJurisdicoes
  const isValidaValor = tiposJurisdicoes.some((tipo) => tipo.id === valorSelecionado);

  if (!isValidaValor) {
    // Mostra uma mensagem de erro ou trata o caso de valor inválido aqui
    message.error('Valor selecionado não é válido!');
    return;
  }

  // Restante do código igual ao anterior
};
