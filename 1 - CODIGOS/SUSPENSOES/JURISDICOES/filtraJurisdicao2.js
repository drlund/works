/**
 * O erro ocorre porque a variável "tiposJurisdicoes" não é um array, o que torna impossível chamar o método "some()" nele. Para resolver esse problema, 
 * você deve garantir que os dados de "tiposJurisdicoes" sejam armazenados como um array.
 * 
 * Com esta modificação, você deve receber os dados de "tiposJurisdicoes" como um array de ids, permitindo o uso do método "some()" para a validação. 
 * Se a função "getTiposJurisdicoes" retorna os dados de uma forma diferente, você pode ajustar a conversão para garantir que "tiposJurisdicoes" seja 
 * um array de ids.
 * 
 * Você pode modificar a função "getTiposJurisdicoes" para retornar os dados em um array ou ajustar o formato de "tiposJurisdicoes" após receber os dados. 
 * Vou assumir que a função "getTiposJurisdicoes" retorna um objeto com os tipos de jurisdições como propriedades e os valores sendo os ids, então você 
 * pode converter esse objeto em um array de ids antes de armazená-lo na variável "tiposJurisdicoes".
 * 
 * Aqui está uma sugestão de como fazer isso:
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
    // Restante do código igual ao anterior
  };

  // ... (código existente)
}
