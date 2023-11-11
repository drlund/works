/**
 * Parece que você deseja reutilizar o mesmo formulário de inclusão em duas situações diferentes: quando o usuário
 * clica no ícone de edição em uma linha da tabela e quando deseja criar uma nova suspensão.
 *
 * Para alcançar isso, você pode fazer o seguinte:
 *
 * 1. Crie um novo estado no componente `FormParamSuspensao` para controlar se o formulário está em modo de edição
 * ou de inclusão.
 */

const [modoEdicao, setModoEdicao] = useState(false);

/**
 * 2. Modifique o componente `FormParamSuspensao` para carregar os dados da linha correspondente da tabela quando
 * estiver em modo de edição. Isso pode ser feito dentro do `useEffect` que busca os tipos de suspensão. Verifique
 * se há algum estado ou propriedade que você possa usar para determinar se você está em modo de edição ou inclusão.
 */

useEffect(() => {
  const fetchTiposSuspensao = async () => {
    try {
      const data = await getTipoSuspensao();
      // Restante do código...

      if (location.state && location.state.id) {
        // Você está em modo de edição, carregue os dados da suspensão a ser editada
        const suspensaoEditar = suspensoes.find(
          (s) => s.id === location.state.id
        );
        if (suspensaoEditar) {
          setModoEdicao(true);
          setTipoSelecionado(suspensaoEditar.tipoSuspensao);
          setTipoSelecionadoTemp(suspensaoEditar.tipoSuspensao);
          setTipoInputValue(suspensaoEditar[suspensaoEditar.tipoSuspensao]);
          // Defina outros campos do formulário conforme necessário
        }
      }
    } catch (error) {
      message.error("Erro ao buscar os tipos de suspensão:", error);
    }
  };

  fetchTiposSuspensao();
}, []);

/**
 * 3. Dentro do `FormParamSuspensao`, modifique a renderização dos campos de input para verificar se está em modo
 * de edição. Se estiver, desabilite os campos "tipo" e as opções do `Radio.Group`.
 */

<>
  /** * 3. Dentro do `FormParamSuspensao`, modifique a renderização dos campos
  de input para verificar se está em modo * de edição. Se estiver, desabilite os
  campos "tipo" e as opções do `Radio.Group`. */
  <Form.Item label="Tipo">
    <Radio.Group
      onChange={(e) => {
        if (!modoEdicao) {
          // Permita a mudança de tipo apenas se não estiver em modo de edição
          handleTipoChange(e);
          setTipoSelecionadoValidator(e.target.value);
        }
      }}
      disabled={modoEdicao} // Desabilite o Radio.Group se estiver em modo de edição
    >
      {/* Restante do código... */}
    </Radio.Group>
  </Form.Item>
  <Form.Item
    name="tipo"
    label="Tipo"
    rules={
      [
        // Restante do código...
      ]
    }
  >
    {modoEdicao ? (
      <Input disabled value={tipoInputValue} />
    ) : (
      renderComponentesInput()
    )}
  </Form.Item>
</>;

/**
 * 4. Agora, quando você chamar o formulário de edição a partir da tabela, passe o objeto `record` como parte do estado
 * na chamada `history.push`, similar ao que você já faz no ícone de edição na tabela. Certifique-se de que o objeto
 * `record` contenha as informações necessárias para preencher o formulário.
 */
