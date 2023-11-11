/**
 * Consolidar as duas funções `editaSuspensao` e `onFinish` em uma única função que pode ser usada diretamente como `onFinish={editaSuspensao}`. 
 * Nesse caso, você pode fazer o seguinte:
 */

const editaSuspensao = async (dadosSuspensao) => {
  try {
    const { id, tipoSuspensao, validade, tipo } = dadosSuspensao;
    const validadeDate = moment(validade);

    const data = {
      id, // Certifique-se de que a variável id está definida no escopo correto.
      tipo,
      tipoSuspensao,
      validade: validadeDate.isValid() ? validadeDate.format('YYYY-MM-DD HH:mm:ss') : null,
    }

    const response = await patchSuspensao(data);

    if (response.status === 200) {
      message.success('Dados da suspensão atualizados com sucesso!');
      history.goBack();
    } else {
      message.error('Erro ao atualizar os dados da suspensão.');
    }
  } catch (error) {
    message.error(`Erro ao atualizar os dados da suspensão: ${error}`);
  }
};

Agora, você pode usar `onFinish={editaSuspensao}` diretamente no seu componente `Form`. Certifique-se de que a variável `id` esteja definida no escopo correto e corresponda ao ID que você deseja atualizar. Esta única função executará todas as ações necessárias quando o formulário for submetido.