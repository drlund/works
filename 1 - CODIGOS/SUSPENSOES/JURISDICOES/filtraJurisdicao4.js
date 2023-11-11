/**
 * O erro ainda persiste porque, mesmo que você esteja verificando se os dados de "tiposJurisdicoes" foram carregados, o estado não está sendo 
 * atualizado corretamente. Vamos ajustar a lógica para garantir que o estado seja atualizado corretamente quando os dados forem carregados.
 * 
 * Com esta correção, agora estamos usando dois useEffects para garantir que a validação ocorra somente quando os dados de "tiposJurisdicoes" 
 * estiverem carregados. O primeiro useEffect é usado para buscar os dados e atualizar o estado "tiposJurisdicoes", e o segundo useEffect é 
 * usado para executar a validação quando esse estado for atualizado corretamente. Dessa forma, você evita o erro mencionado e a validação será 
 * feita apenas quando os dados estiverem prontos.
 * 
 * Aqui está a correção:
 */

// ... (código existente)

function FormParamSuspensao({ location }) {
  // ... (código existente)

  // Novo estado para armazenar os dados obtidos de tiposJurisdicoes como um array de ids
  const [tiposJurisdicoes, setTiposJurisdicoes] = useState([]);

  // ... (código existente)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tiposSuspensaoData = await getTipoSuspensao();
        const tiposJurisdicoesData = await getTiposJurisdicoes();

        setTiposSuspensao(tiposSuspensaoData);

        // Converta o objeto tiposJurisdicoesData em um array de ids
        const idsTiposJurisdicoes = Object.values(tiposJurisdicoesData);

        setTiposJurisdicoes(idsTiposJurisdicoes);
      } catch (error) {
        message.error('Erro ao buscar os tipos de suspensão:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Verifica se os dados de tiposJurisdicoes foram carregados antes de fazer a validação
    if (tiposJurisdicoes.length > 0) {
      // Restante do código para realizar a validação
    }
  }, [tiposJurisdicoes]); // Executa esse useEffect toda vez que tiposJurisdicoes for atualizado

  // ... (código existente)

  const handleTipoChange = (e) => {
    // Verifica novamente se os dados de tiposJurisdicoes foram carregados
    if (tiposJurisdicoes.length > 0) {
      // Restante do código para realizar a validação
    }
  };

  // ... (código existente)
}
