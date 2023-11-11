/**
 * Para validar se o valor selecionado em "vicePresi" existe em uma tabela do banco de dados, você precisará fazer essa verificação no lado do 
 * frontend usando os dados obtidos pela função "getTiposJurisdicoes". Aqui está um exemplo de como você pode fazer isso:
 * 
 * 1. Modifique o useEffect que busca "getTipoSuspensao" para também buscar "getTiposJurisdicoes" e armazenar os dados em uma variável de estado, 
 * vamos chamá-la de "tiposJurisdicoes".
 * 
 * 2. Use a variável de estado "tiposJurisdicoes" para realizar a validação dentro da função "handleTipoChange".
 * 
 * 3. Na função "handleTipoChange", depois de definir o "valorSelecionado", verifique se ele existe nos dados de "tiposJurisdicoes". Você pode 
 * usar o método "some()" do JavaScript para fazer essa verificação.
 * 
 * 4. Se o valor selecionado existir nos dados de "tiposJurisdicoes", continue definindo o estado "tipoSelecionado" e atualizando o "formatoInput". 
 * Se ele não existir, mostre uma mensagem de erro ao usuário indicando que o valor não é válido.
 * 
 * Aqui está um exemplo de como o componente "FormParamSuspensao" pode ficar com essas modificações:
 */

// ... (código existente)

import {
  // ... (importações existentes)
  // Adicione a importação para getTiposJurisdicoes
  getTiposJurisdicoes,
} from '../../apiCalls/apiParamSuspensao';

// ... (código existente)

function FormParamSuspensao({ location }) {
  // ... (código existente)

  // Novo estado para armazenar os dados obtidos de tiposJurisdicoes
  const [tiposJurisdicoes, setTiposJurisdicoes] = useState([]);

  // ... (código existente)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tiposSuspensaoData = await getTipoSuspensao();
        const tiposJurisdicoesData = await getTiposJurisdicoes();

        setTiposSuspensao(tiposSuspensaoData);
        setTiposJurisdicoes(tiposJurisdicoesData);
      } catch (error) {
        message.error('Erro ao buscar os tipos de suspensão:', error);
      }
    };

    fetchData();
  }, []);

  // ... (código existente)

  const handleTipoChange = (e) => {
    const valorSelecionado = e.target.value;

    // Verifica se o valor selecionado existe nos dados de tiposJurisdicoes
    const isValidValue = tiposJurisdicoes.some(
      (jurisdicao) => jurisdicao === valorSelecionado
    );

    if (!isValidValue) {
      // Mostra uma mensagem de erro ou trata o caso de valor inválido aqui
      message.error('Valor selecionado não é válido!');
      return;
    }

    // Continua definindo o estado tipoSelecionado e atualizando o formatoInput
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
  };

  // ... (código existente)
}
