/**
 * Parece que o `id` do novo tipo de suspensão não está sendo recuperado corretamente após a criação e, em vez disso, 
 * está sendo enviado como `'novo_id'`. Para corrigir isso, você precisará garantir que o `id` correto seja obtido 
 * após a inserção do novo tipo de suspensão no banco de dados. Aqui estão as etapas que você pode seguir para resolver 
 * esse problema:
 * 
 * 1. **Atualize a função `handleSalvaNovoTipoDeSuspensao`**: Após a criação bem-sucedida do novo tipo de suspensão no 
 * banco de dados, você deve receber o `id` real desse novo tipo de suspensão da resposta da função `gravarTipoDeSuspensao`.
 *  Atualize sua função `handleSalvaNovoTipoDeSuspensao` para capturar o `id` correto da resposta e definir o estado 
 * `selecionaTipoSuspensao` com esse `id`. Algo semelhante a isso:
 */

const handleSalvaNovoTipoDeSuspensao = async () => {
  try {
    if (!novoTipoDeSuspensao.trim()) {
      message.error('Por favor, digite o novo tipo de suspensão.');
      return;
    }

    const novoTipo = await gravarTipoDeSuspensao(novoTipoDeSuspensao);

    setTiposSuspensao([
      ...tiposSuspensao,
      { id: novoTipo.id, mensagem: novoTipoDeSuspensao },
    ]);

    setNovoTipoDeSuspensao('');
    setModalVisible(false);

    setSelecionaTipoSuspensao(novoTipo.id);

    message.success('Nova mensagem de suspensão adicionada com sucesso!');
  } catch (error) {
    message.error(
      'Erro ao adicionar nova mensagem de suspensão:',
      error.message,
    );
  }
};

/**
 * Observe que agora estamos usando `novoTipo.id` da resposta da função `gravarTipoDeSuspensao` para definir 
 * `selecionaTipoSuspensao`.

/**
 * 2. **Verifique a função `gravarTipoDeSuspensao`**: Certifique-se de que a função `gravarTipoDeSuspensao` esteja 
 * retornando o `id` do novo tipo de suspensão após a inserção bem-sucedida.
 */

/**
 * 3. **Atualize a API do backend**: Certifique-se de que a API do backend esteja configurada para retornar o 
 * `id` do novo tipo de suspensão após a inserção bem-sucedida. A resposta da API deve incluir o `id` gerado para 
 * o novo tipo de suspensão.
 */

/**
 * Com essas alterações, seu código deve ser capaz de criar com sucesso um novo tipo de suspensão, obter o `id` 
 * correto desse novo tipo e usá-lo ao selecionar esse tipo no formulário de suspensão. Isso deve resolver o problema 
 * relacionado ao `'novo_id'`. Certifique-se de que todas as partes do código estejam atualizadas de acordo com essas 
 * alterações.
 */