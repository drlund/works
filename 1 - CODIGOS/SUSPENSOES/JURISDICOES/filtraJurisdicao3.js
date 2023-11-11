/**
 * O erro ocorre porque, quando você seleciona um botão do "Radio.Group", a função "handleTipoChange" é acionada imediatamente antes 
 * dos dados de "tiposJurisdicoes" serem carregados corretamente, resultando no erro "Valor selecionado não é válido!".
 * 
 * Com essa alteração, a função "handleTipoChange" verificará se os dados de "tiposJurisdicoes" foram carregados corretamente antes de 
 * realizar a validação. Caso os dados ainda não tenham sido carregados, a função retornará sem fazer a validação, evitando assim o erro 
 * mencionado. Assim que os dados estiverem carregados, a função de validação será executada normalmente ao selecionar um botão do "Radio.Group".
 * 
 * Para evitar esse problema, você pode adicionar uma verificação simples antes de realizar a validação usando o "some()" no 
 * "handleTipoChange". Você pode verificar se os dados de "tiposJurisdicoes" estão carregados corretamente antes de realizar a validação.
 * 
 * Aqui está uma sugestão de como fazer isso:
 */

// ... (código existente)

function FormParamSuspensao({ location }) {
  // ... (código existente)

  // Novo estado para armazenar os dados obtidos de tiposJurisdicoes como um array de ids
  const [tiposJurisdicoes, setTiposJurisdicoes] = useState([]);
  const [tiposSuspensaoLoaded, setTiposSuspensaoLoaded] = useState(false);

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
        setTiposSuspensaoLoaded(true); // Indica que os dados foram carregados
      } catch (error) {
        message.error('Erro ao buscar os tipos de suspensão:', error);
      }
    };

    fetchData();
  }, []);

  // ... (código existente)

  const handleTipoChange = (e) => {
    if (!tiposSuspensaoLoaded) {
      // Se os dados de tiposJurisdicoes ainda não foram carregados, retorne sem fazer a validação
      return;
    }

    // Restante do código para realizar a validação
  };

  // ... (código existente)
}
