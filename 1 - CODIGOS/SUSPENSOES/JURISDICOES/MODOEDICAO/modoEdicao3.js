/**
 * Obrigado por fornecer o código do seu formulário e do seu dataTable. Vou analisar as partes relevantes do código para 
 * tentar identificar a razão pela qual os efeitos esperados não estão acontecendo ao clicar em "Editar".
 * 
 * Primeiramente, verifiquei o trecho onde você redireciona para o formulário de edição a partir do ícone de edição no 
 * dataTable. Parece que você está passando o ID do registro para o estado de localização, o que é um bom começo. Aqui 
 * está o trecho relevante:
 */

<>/**
 * Obrigado por fornecer o código do seu formulário e do seu dataTable. Vou analisar as partes relevantes do código para
 * tentar identificar a razão pela qual os efeitos esperados não estão acontecendo ao clicar em "Editar".
 *
 * Primeiramente, verifiquei o trecho onde você redireciona para o formulário de edição a partir do ícone de edição no
 * dataTable. Parece que você está passando o ID do registro para o estado de localização, o que é um bom começo. Aqui
 * está o trecho relevante:
 */
    <EditOutlined
        className="link-color link-cursor"
        onClick={() => history.push({
            pathname: '/movimentacoes/editar-suspensao/',
            state: { id: record.id },
        })} />
    /** Agora, vamos dar uma olhada no seu componente `FormParamSuspensao`. No entanto, percebo que há um pequeno erro na
     * extração do ID do estado de localização. Você está usando `parseInt(location.id, 10);`, mas o ID está na propriedade
     * `state` do objeto `location`, portanto, você deve usar `location.state.id` para extrair o ID corretamente. Além disso,
     * você não está passando o estado corretamente para o componente `FormParamSuspensao` na sua rota. Vamos fazer algumas
     * modificações para corrigir isso:
     */
    // No componente ParamSuspensaoTable, ao redirecionar para o formulário de edição
    <EditOutlined
        className="link-color link-cursor"
        onClick={() => history.push({
            pathname: '/movimentacoes/editar-suspensao/',
            state: { id: record.id },
        })} />
    // No componente de rota, você precisa passar o estado corretamente para o FormParamSuspensao
    <Route
        path="/movimentacoes/editar-suspensao/"
        render={(props) => <FormParamSuspensao {...props} />} /></>


/**
 * Agora, dentro do seu componente `FormParamSuspensao`, certifique-se de que está usando o ID correto do estado de 
 * localização e que está definindo o modo de edição corretamente:
 */

const FormParamSuspensao = ({ location }) => {
  // ... (resto do código)

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
  }, [location.state]); // Certifique-se de adicionar location.state como dependência

  // ... (resto do código)
};

/**
 * Lembre-se de que os efeitos de redirecionamento e atualização do estado podem ter várias causas, então essas são 
 * apenas algumas áreas onde podem ocorrer problemas. Certifique-se de seguir as etapas detalhadas, atualize seu 
 * código conforme necessário e depure qualquer erro que possa ocorrer para identificar a causa raiz do problema.
 */