/**
 * É possível implementar uma verificação adicional após a atualização dos dados para garantir que a condição desejada seja atendida antes de exibir 
 * a mensagem de sucesso ou erro. Você pode fazer isso fazendo uma consulta ou verificação após a atualização para garantir que os dados atualizados 
 * atendam à sua condição específica.
 * 
 * Aqui está uma sugestão de como você pode fazer isso:
 */

/**
 * Nesse exemplo, após a atualização bem-sucedida, você chama a função `verificaMinhaCondicao()` para verificar se a condição desejada é atendida. Se a 
 * condição não for atendida, você exibirá a mensagem de erro apropriada. Certifique-se de implementar `verificaMinhaCondicao()` para fazer a verificação 
 * específica que você precisa após a atualização dos dados.
 */


const editaSuspensao = async (dadosSuspensao) => {
  try {
    const { id, tipoSuspensao, validade, tipo, valor } = dadosSuspensao;
    const data = {
      id,
      tipo,
      valor,
      tipoSuspensao,
      validade: moment(validade).format('YYYY-MM-DD HH:mm:ss'),
    }

    const response = await patchSuspensao(data);

    if (response.status === 200) {
      // Após a atualização bem-sucedida, faça uma verificação adicional
      const verificaCondicao = await verificaMinhaCondicao(); // Implemente essa função

      if (verificaCondicao) {
        message.success('Dados da suspensão atualizados com sucesso!');
        history.goBack();
      } else {
        message.error('A condição não foi atendida após a atualização.');
      }
    } else {
      message.error('Erro ao atualizar os dados da suspensão.');
    }
  } catch (error) {
    message.error(`Erro ao atualizar os dados da suspensão: ${error}`);
  }
};
