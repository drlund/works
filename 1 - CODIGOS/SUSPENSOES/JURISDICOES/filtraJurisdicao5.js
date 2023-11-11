/**
 * Com essas modificações, o componente agora irá verificar se os dados de "tiposJurisdicoes" foram carregados corretamente 
 * antes de realizar a validação no `handleTipoChange`. Se os dados ainda estiverem sendo carregados, a validação não será 
 * executada, evitando o erro mencionado. Assim que os dados estiverem carregados (`loading` for `false`), a validação será 
 * feita normalmente ao selecionar um botão do "Radio.Group".
 * 
 * Métodos completos do `useEffect` e do `handleTipoChange` para garantir que a validação seja realizada corretamente. Vamos 
 * também adicionar uma variável de estado `loading` para controlar o carregamento dos dados.
 */

// ... (código existente)

function FormParamSuspensao({ location }) {
  // ... (código existente)

  const [tiposJurisdicoes, setTiposJurisdicoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tiposSuspensaoData = await getTipoSuspensao();
        const tiposJurisdicoesData = await getTiposJurisdicoes();

        setTiposSuspensao(tiposSuspensaoData);

        // Converta o objeto tiposJurisdicoesData em um array de ids
        const idsTiposJurisdicoes = Object.values(tiposJurisdicoesData);

        setTiposJurisdicoes(idsTiposJurisdicoes);
        setLoading(false); // Marca os dados como carregados
      } catch (error) {
        message.error('Erro ao buscar os tipos de suspensão:', error);
      }
    };

    fetchData();
  }, []);

  const handleTipoChange = (e) => {
    const valorSelecionado = e.target.value;

    // Verifica se os dados de tiposJurisdicoes foram carregados corretamente
    if (!loading) {
      // Verifica se o valor selecionado existe nos dados de tiposJurisdicoes
      const isValidaValor = tiposJurisdicoes.includes(valorSelecionado);

      if (!isValidaValor) {
        // Mostra uma mensagem de erro ou trata o caso de valor inválido aqui
        message.error('Valor selecionado não é válido!');
        return;
      }

      // Restante do código para atualizar o estado tipoSelecionado e formatoInput
      setTipoSelecionado(valorSelecionado);

      let formatoInput = '';
      switch (valorSelecionado) {
        // ... (casos existentes)
        default:
          formatoInput = 'Escolha um tipo de entrada!';
          break;
      }

      form.setFieldsValue({ tipo: '' });
      form.setFields([{ name: 'tipo', value: '' }]);
      setTipoInputValue(formatoInput);
    }
  };

  // ... (código existente)
}
