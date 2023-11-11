/**
 * Para que o campo de seleção "Tipo de Suspensão" mostre automaticamente o valor recém-gravado "novoTipoDeSuspensao" 
 * após o usuário clicar em "Ok" para gravar, você precisa atualizar o estado do `novoTipoDeSuspensao` após a gravação 
 * bem-sucedida e configurar o valor selecionado no `<Select>` com base nesse estado atualizado. Aqui está como você 
 * pode fazer isso:
 * 
 * 1. Adicione um novo estado para rastrear o valor selecionado no `<Select>`.
 */

const [selecionaTipoSuspensao, setSelecionaTipoSuspensao] = useState('');

/**
 * 2. Após a gravação bem-sucedida do "novoTipoDeSuspensao", atualize o estado `novoTipoDeSuspensao` e `selecionaTipoSuspensao`
 *  com o novo valor.
 */

const handleSalvaNovoTipoDeSuspensao = async () => {
  try {
    if (!novoTipoDeSuspensao.trim()) {
      message.error('Por favor, digite o novo tipo de suspensão.');
      return;
    }

    await gravarTipoDeSuspensao(novoTipoDeSuspensao);

    setTiposSuspensao([
      ...tiposSuspensao,
      { id: 'novo_id', mensagem: novoTipoDeSuspensao },
    ]);

    setNovoTipoDeSuspensao('');
    setModalVisible(false);
   
    // Defina o novo valor selecionado após a gravação bem-sucedida
    setSelecionaTipoSuspensao(novoTipoDeSuspensao);

    message.success('Nova mensagem de suspensão adicionada com sucesso!');
  } catch (error) {
    message.error(
      'Erro ao adicionar nova mensagem de suspensão:',
      error.message,
    );
  }
};

// 3. No componente `<Select>`, configure a propriedade `value` com base no estado `selectedTipoSuspensao`.

<Select
  placeholder="Selecione o tipo de suspensão"
  onChange={(value) => {
    if (value === 'novo') {
      setModalVisible(true);
    }
  }}
  value={selecionaTipoSuspensao} // Defina o valor selecionado com base no estado
>
  {/* ...opções do Select... */}
</Select>

/**
 * Agora, quando o usuário clicar em "Ok" para gravar o "novoTipoDeSuspensao", o campo de seleção "Tipo de Suspensão" 
 * mostrará automaticamente o valor recém-gravado. Certifique-se de que o valor de `selectedTipoSuspensao` seja atualizado 
 * apenas após uma gravação bem-sucedida.
 */