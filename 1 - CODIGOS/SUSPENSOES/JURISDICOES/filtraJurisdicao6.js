/**
 * Com essas modificações, agora estamos utilizando a propriedade "length" de "tiposJurisdicoes" no método handleTipoChange 
 * para garantir que o array está vazio ou não antes de realizar a verificação com o método "includes". Isso deve resolver 
 * o erro que estava ocorrendo.
 * 
 * Método completo do useEffect e também o método handleTipoChange, utilizando a propriedade "length" de "tiposJurisdicoes".
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

  // ... (código existente)

  const handleTipoChange = (e) => {
    const valorSelecionado = e.target.value;

    // Verifica se o valor selecionado existe nos dados de tiposJurisdicoes
    const isValidValue = tiposJurisdicoes.length > 0 && tiposJurisdicoes.includes(valorSelecionado);

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
