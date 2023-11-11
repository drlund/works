/**
 * Você está correto, e peço desculpas pela confusão. Se você incluir "mostrarMensagemValidacao" diretamente nas regras de validação, isso afetará a validação. 
 * Para condicionar a validação apenas ao enviar o formulário, você pode seguir uma abordagem um pouco diferente.
 * 
 * Aqui está como você pode fazer isso:
 * 
 * 1. Remova a validação condicional das regras do campo "tipo" no `Form.Item`.
 */

    <Form.Item
    name="tipo"
    label="Tipo"
    rules={[
        {
        required: true,
        message: 'Por favor, selecione um tipo!',
        },
        {
        validator: (_, value) => {
            if (!value) return Promise.resolve(); // Não valida se o campo está vazio
            if (!tipoSelecionado) return Promise.resolve(); // Não valida se tipoSelecionado estiver vazio

            const chaveJurisdicao = tipoSelecionado;
            const isValid = validarTipo(value, chaveJurisdicao);

            if (isValid) {
            return Promise.resolve();
            }

            return Promise.reject(
            new Error(
                `O campo não é válido para o tipo de ${chaveJurisdicao} selecionado!`,
            ),
            );
        },
        },
    ]}
    >
        </Form.Item>

/**
 * 2. Adicione a validação condicional diretamente ao tratar o envio do formulário. Você pode verificar se o campo "tipo" não está vazio e `mostrarMensagemValidacao` 
 * está habilitado antes de chamar `form.validateFields()`.
 * 
 * Aqui está como você pode fazer isso:
 */


const gravaSuspensao = () => {
  const dadosForm = form.getFieldsValue();

  // Adicione a validação condicional aqui
  if (!dadosForm.tipo && mostrarMensagemValidacao) {
    form.validateFields().then(() => {
      gravarSuspensao({ ...dadosSuspensao, idSuspensao })
        .then((dadosSuspensaoForm) => {
          setDadosSuspensaoForm(dadosSuspensaoForm);
          history.goBack();
        })
        .catch(() => message.error('Falha ao gravar suspensão! Verifique!'));
    });
  } else {
    gravarSuspensao({ ...dadosSuspensao, idSuspensao })
      .then((dadosSuspensaoForm) => {
        setDadosSuspensaoForm(dadosSuspensaoForm);
        history.goBack();
      })
      .catch(() => message.error('Falha ao gravar suspensão! Verifique!'));
  }
};

/**
 * Dessa forma, a validação será executada apenas quando o campo "tipo" não estiver vazio e `mostrarMensagemValidacao` estiver habilitado, que é o comportamento 
 * desejado. Certifique-se de ajustar essa lógica de acordo com suas necessidades específicas.
 */