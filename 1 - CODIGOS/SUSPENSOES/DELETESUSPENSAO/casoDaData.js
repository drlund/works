/**
 * Desejo que a data esteja no formato "YYYY-MM-DD HH:mm:ss" para atualizar o registro no banco de dados. O erro que você está enfrentando ocorre porque 
 * o formato da data atual não é aceito pelo banco de dados.
 * 
 * Você pode usar o método `toISOString()` para obter uma string de data no formato ISO 8601, e então formatar essa string para o formato desejado. Aqui 
 * está um exemplo de como fazer isso:
 */

/**
 * Neste código, usamos `toISOString()` para obter a data no formato ISO 8601 e, em seguida, manipulamos a string resultante para obter o formato desejado. 
 * Certifique-se de substituir `'validade'` pelo nome correto do campo em sua tabela de suspensão. Isso deve resolver o problema do formato da data.
 */

async deleteSuspensao(idSuspensao) {
  // Obtenha a data atual
  const dataAtual = new Date();

  // Subtraia 1 dia da data atual
  dataAtual.setDate(dataAtual.getDate() - 1);

  // Formate a nova data no formato "YYYY-MM-DD HH:mm:ss"
  const dataFormatada = dataAtual.toISOString().slice(0, 19).replace('T', ' ');

  // Atualize o registro no banco de dados com a nova data
  const excluiSuspensao = await ParamSuspensao.query()
    .where("id", parseInt(idSuspensao))
    .update({ validade: dataFormatada }); // Substitua 'validade' pelo nome correto do campo em seu banco de dados

  return excluiSuspensao;
}
