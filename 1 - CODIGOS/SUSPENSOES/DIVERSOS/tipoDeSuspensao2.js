/**
 * Para implementar a atualização do ID do tipo de suspensão após a inclusão bem-sucedida no seu formulário, você pode 
 * seguir a abordagem que mencionei anteriormente. Aqui está como você pode fazer isso no seu código:
 */

// 1. Adicione um estado para armazenar o ID do novo tipo de suspensão após a inclusão:

const [novoTipoSuspensaoId, setNovoTipoSuspensaoId] = useState(null);

// 2. Atualize a função `handleSalvaNovoTipoDeSuspensao` para capturar o ID real após a inclusão:

const handleSalvaNovoTipoDeSuspensao = async () => {
  try {
    if (!novoTipoDeSuspensao.trim()) {
      message.error('Por favor, digite o novo tipo de suspensão.');
      return;
    }

    const response = await gravarTipoDeSuspensao(novoTipoDeSuspensao);
    if (response.ok) {
      const data = await response.json();
      const novoIdGerado = data.id;
      setNovoTipoSuspensaoId(novoIdGerado); // Atualiza o ID real

      // Limpa o campo de entrada
      setNovoTipoDeSuspensao('');
      setModalVisible(false);
      setSelecionaTipoSuspensao(novoTipoDeSuspensao);

      message.success('Nova mensagem de suspensão adicionada com sucesso!');
    } else {
      message.error('Erro ao adicionar nova mensagem de suspensão.');
    }
  } catch (error) {
    message.error('Erro ao adicionar nova mensagem de suspensão:', error.message);
  }
};

/** 
 * 3. No campo "Tipo de Suspensão" (`<Form.Item name="tipoSuspensao">`), atualize o valor de `selecionaTipoSuspensao` 
 * para usar `novoTipoSuspensaoId` se estiver disponível:
 */

<Select
  placeholder="Selecione o tipo de suspensão"
  onChange={(value) => {
    if (value === 'novo') {
      setModalVisible(true);
    }
  }}
  value={novoTipoSuspensaoId !== null ? novoTipoSuspensaoId : selecionaTipoSuspensao}
>
  {tiposSuspensao.map((tipo) => (
    <Select.Option key={tipo.id} value={tipo.id}>
      {tipo.mensagem}
    </Select.Option>
  ))}
  <Select.Option
    key="novo"
    value="novo"
    style={{ backgroundColor: 'blue', fontWeight: 'bold', color: 'white' }}
  >
    ** INCLUIR NOVO TIPO DE SUSPENSÃO **
  </Select.Option>
</Select>

/**
 * Agora, quando um novo tipo de suspensão for incluído com sucesso, o ID real será capturado e exibido no campo 
 * "Tipo de Suspensão" como o valor selecionado. Certifique-se de testar essa implementação para garantir que funcione 
 * conforme o esperado no seu aplicativo.
 */