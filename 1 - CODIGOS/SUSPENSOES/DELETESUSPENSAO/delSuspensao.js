/**
 * Para atualizar a data em um dia a partir da data atual, você pode usar o JavaScript para calcular a nova data e, em seguida, atualizar 
 * o registro no banco de dados. Aqui está um exemplo de como você pode implementar isso na sua função:
 */

/**
 * Neste exemplo, primeiro obtemos a data atual, subtraímos um dia e formatamos a nova data no formato apropriado para o seu banco de dados. 
 * Em seguida, atualizamos o registro no banco de dados com a nova data. Certifique-se de substituir `'data'` pelo nome correto do campo em 
 * sua tabela de suspensão.
 */

async deleteSuspensao(idSuspensao) {
  // Obtenha a data atual
  const dataAtual = new Date();

  // Subtraia 1 dia da data atual
  dataAtual.setDate(dataAtual.getDate() - 1);

  // Converta a data de volta para um formato adequado para o banco de dados (por exemplo, SQL)
  const dataFormatada = dataAtual.toISOString();

  // Atualize o registro no banco de dados com a nova data
  const excluiSuspensao = await ParamSuspensao.query()
    .where("id", parseInt(idSuspensao))
    .update({ data: dataFormatada }); // Substitua 'data' pelo nome correto do campo em seu banco de dados

  return excluiSuspensao;
}
