/**
 * Se você deseja evitar que a função `editaSuspensao` rode novamente após realizar a alteração dos dados, você pode adicionar uma variável de 
 * controle para garantir que a função só seja executada uma vez. Aqui está um exemplo de como fazer isso:
 */

/**
 * Neste exemplo, a variável `isEdicaoRealizada` é inicialmente definida como `false`. Após uma edição bem-sucedida, ela é definida como `true`, 
 * o que impede que a função `editaSuspensao` seja executada novamente. Certifique-se de que esta variável seja definida no escopo apropriado para 
 * funcionar corretamente.
 */

let isEdicaoRealizada = false; // Variável de controle

const editaSuspensao = async (dadosSuspensao) => {
  try {
    if (isEdicaoRealizada) {
      return; // Se a edição já foi realizada, saia da função.
    }

    const { id, tipoSuspensao, validade, tipo} = dadosSuspensao;
    const dados = {
      id,
      tipo,
      tipoSuspensao,
      validade: moment(validade).format('YYYY-MM-DD HH:mm:ss'),
    }

    const response = await patchSuspensao(dados);

    if (response.status === 200) {
      message.success('Dados da suspensão atualizados com sucesso!');
      history.goBack();
      isEdicaoRealizada = true; // Marca que a edição foi realizada com sucesso.
    } else {
      message.error('Erro ao atualizar os dados da suspensão.');
    }
  } catch (error) {
    message.error(`Erro ao atualizar os dados da suspensão: ${error}`);
  }
};
