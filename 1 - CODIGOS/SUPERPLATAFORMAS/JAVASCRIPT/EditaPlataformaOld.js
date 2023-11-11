  const editarPlataforma = async (dadosPlataforma) => {
    try {
      const { id, nome, nomeResponsavel, matriculaResponsavel } =
        dadosPlataforma;
        console.log('Todos os dados: ', dadosPlataforma)
      const dados = {
        id,
        nome,
        nomeResponsavel,
        matriculaResponsavel,
      };

      const response = await patchPlataforma(dados);

      if (response.status === 200) {
        message.success('Dados da suspensão atualizados com sucesso!');
      }
    } catch (error) {
      message.error(`Erro ao atualizar os dados da suspensão: ${error}`);
    }
  };