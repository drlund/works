/**
 * Os dados estão sendo repetidos no console e, provavelmente, isso está afetando a exibição correta no navegador. A 
 * repetição pode estar acontecendo porque a função `getTipoSuspensao` é chamada em mais de um lugar ou em momentos 
 * diferentes, resultando na duplicação dos dados. Para evitar essa repetição, é necessário ajustar o código para 
 * garantir que a função seja chamada apenas uma vez e que os dados sejam armazenados corretamente.
 * 
 * Com essa correção, a função `getTipoSuspensao` será chamada apenas uma vez na montagem do componente, garantindo que 
 * os dados sejam buscados corretamente e evitando a duplicação dos registros.
 * 
 * Além disso, é importante verificar o lado do servidor também. Certifique-se de que o backend está retornando corretamente 
 * os dados da API `getTipoSuspensao` sem duplicações. Verifique o código do backend para garantir que não esteja havendo 
 * repetição no momento de buscar os dados do tipoSuspensao.
 * 
 * Vamos revisar o código novamente e fazer algumas correções:
 * 
 * 1. Certifique-se de chamar a função `getTipoSuspensao` apenas uma vez na montagem do componente usando o `useEffect`.
 * 2. Adicione uma condição para verificar se os dados já foram buscados antes de chamar a função novamente.
 * 
 * Aqui está a correção:
 */

// ... (imports existentes)
import { getTipoSuspensao } from './apiCalls/apiParamSuspensao';

// ... (código existente)
function ParamSuspensaoTable({ ...props }) {
  // ... (código existente)

  const [tipoSuspensaoDados, setTipoSuspensaoDados] = useState([]);

  useEffect(() => {
    // Verificar se os dados já foram buscados antes de chamar a função novamente.
    if (tipoSuspensaoDados.length === 0) {
      // Buscar os dados da getTipoSuspensao e armazená-los na variável de estado.
      getTipoSuspensao()
        .then((tipoSuspensaoDados) => {
          setTipoSuspensaoDados(tipoSuspensaoDados);
        })
        .catch((error) => {
          console.error('Erro ao buscar os dados do tipoSuspensao:', error);
        });
    }
  }, []);

  // ... (código existente)
}
