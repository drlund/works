/**
 * Parece que o parâmetro "modoEdicao" não estava sendo usado corretamente nas alterações que sugeri. Vamos revisitar 
 * o código e fazer as correções necessárias.
 * 
 * 1. No componente `FormParamSuspensao`, você precisa usar o estado `modoEdicao` para controlar quando os campos "tipo" 
 * e opções do `Radio.Group` devem estar desabilitados. Certifique-se de usar `modoEdicao` nas partes relevantes do código.
 * 
 * 2. Quando você chama o formulário de edição a partir do ícone da tabela, você deve passar o objeto `record` como 
 * parte do estado na chamada `history.push`. Além disso, defina `modoEdicao` como `true` para indicar que o formulário 
 * está em modo de edição.
 * 
 * Aqui está uma versão revisada das etapas:
 */

// Dentro do componente `FormParamSuspensao`:

// ... (código anterior)

useEffect(() => {
  const fetchTiposSuspensao = async () => {
    try {
      const data = await getTipoSuspensao();
      // Restante do código...

      if (location.state && location.state.id) {
        const suspensaoEditar = suspensoes.find(s => s.id === location.state.id);
        if (suspensaoEditar) {
          setModoEdicao(true); // Defina o modo de edição como verdadeiro
          setTipoSelecionado(suspensaoEditar.tipoSuspensao);
          setTipoSelecionadoTemp(suspensaoEditar.tipoSuspensao);
          setTipoInputValue(suspensaoEditar[suspensaoEditar.tipoSuspensao]);
          // Defina outros campos do formulário conforme necessário
        }
      }
    } catch (error) {
      message.error('Erro ao buscar os tipos de suspensão:', error);
    }
  };

  fetchTiposSuspensao();
}, []);

// ... (restante do código)

// Agora, dentro da renderização dos campos do formulário:

<>
    // ... (restante do código)
    // Agora, dentro da renderização dos campos do formulário:
    <Form.Item label="Tipo">
        <Radio.Group
            onChange={(e) => {
                if (!modoEdicao) {
                    handleTipoChange(e);
                    setTipoSelecionadoValidator(e.target.value);
                }
            } }
            disabled={modoEdicao}
        >
            {/* Restante do código... */}
        </Radio.Group>
    </Form.Item><Form.Item
        name="tipo"
        label="Tipo"
        rules={[
            // Restante do código...
        ]}
    >
        {modoEdicao ? (
            <Input disabled value={tipoInputValue} />
        ) : (
            renderComponentesInput()
        )}
    </Form.Item>

    // A chamada para o formulário de edição a partir do ícone da tabela:

    <Tooltip title="Editar">
        <EditOutlined
            className="link-color link-cursor"
            onClick={() => history.push({
                pathname: '/movimentacoes/editar-suspensao/',
                state: { id: record.id }, // Passe o objeto 'record' como estado
            })} />
    </Tooltip></>

// Certifique-se de que `record` contém todas as informações necessárias para preencher o formulário corretamente.

/**
 * Com essas modificações, o componente deve agora funcionar corretamente, permitindo que o formulário seja aberto 
 * em modo de edição a partir do ícone da tabela e em modo de inclusão quando necessário. Certifique-se de verificar 
 * se todas as partes relevantes do código foram atualizadas de acordo.
 */