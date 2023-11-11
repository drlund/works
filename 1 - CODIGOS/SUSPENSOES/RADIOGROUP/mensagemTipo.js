/**
 * Para mostrar a mensagem "'Por favor, selecione um tipo!'" somente quando uma opção de radio button for selecionada, você deve atualizar a lógica de validação 
 * no `<Form.Item>` que envolve o campo "Tipo".  Atualmente, você tem o conjunto de regras `required`, que faz com que a mensagem seja exibida imediatamente quando 
 * o formulário é carregado.
 * 
 * Esta alteração verifica se o `opcaoSelecionada` (botão de opção selecionado) é 'matricula' e se o campo 'tipo' está vazio, e só então mostra a mensagem de validação.  
 * Caso contrário, permite prosseguir sem mostrar a mensagem imediatamente.
 * 
 * Veja como você pode modificá-lo:
 * 
 *  Substitua esta parte:
 */

<Form.Item
  name="tipo"
  label="Tipo"
  rules={[
    {
      required: true,
      message: 'Por favor, selecione um tipo!',
    },
    () => ({
      validator(_, value) {
        if (!value) {
          return Promise.resolve();
        }

        if (!tipoSelecionado) {
          return Promise.resolve();
        }

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
    }),
  ]}
>

// Com este código atualizado:

<Form.Item
  name="tipo"
  label="Tipo"
  rules={[
    () => ({
      validator(_, value) {
        if (opcaoSelecionada === 'matricula' && !value) {
          return Promise.reject(new Error('Por favor, selecione um tipo!'));
        }

        if (!tipoSelecionado) {
          return Promise.resolve();
        }

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
    }),
  ]}
>
