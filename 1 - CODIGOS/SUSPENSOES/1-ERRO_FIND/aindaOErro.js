//Para integrar a função `onFinish` dentro da função `editaSuspensao` e usá-la dentro do `Form` com `onFinish={editaSuspensao}`, você pode fazer o seguinte:

const editaSuspensao = async (dadosSuspensao) => {
  try {
    const { id, tipoSuspensao, validade, tipo } = dadosSuspensao;
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
    } else {
      message.error('Erro ao atualizar os dados da suspensão.');
    }
  } catch (error) {
    message.error(`Erro ao atualizar os dados da suspensão: ${error}`);
  }
};

const onFinish = (dadosSuspensao) => {
  const { tipoSuspensao, validade, tipo } = dadosSuspensao;

  const validadeDate = moment(validade);

  const dados = {
    id, // Certifique-se de que a variável id está definida no escopo correto.
    tipo,
    tipoSuspensao,
    validade: validadeDate.isValid() ? validadeDate.format('YYYY-MM-DD') : null,
  };

  editaSuspensao(dados);
};

Certifique-se de que a variável `id` esteja definida no escopo correto e que corresponda ao ID que você deseja atualizar. Além disso, certifique-se de que a estrutura do seu componente `Form` esteja configurada corretamente com `onFinish={onFinish}`. Com essas configurações, a função `editaSuspensao` será chamada quando o formulário for submetido.