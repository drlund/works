// ... (imports existentes)
import { getTipoSuspensao } from './apiCalls/apiParamSuspensao';

// ... (código existente)
function ParamSuspensaoTable({ ...props }) {
  // ... (código existente)

  const [tipoSuspensaoData, setTipoSuspensaoData] = useState([]);

  useEffect(() => {
    // Verificar se os dados já foram buscados antes de chamar a função novamente.
    if (tipoSuspensaoData.length === 0) {
      // Buscar os dados da getTipoSuspensao e armazená-los na variável de estado.
      getTipoSuspensao()
        .then((tipoSuspensaoData) => {
          console.log('Dados retornados da API getTipoSuspensao:', tipoSuspensaoData); // Adicione esta linha para verificar os dados retornados
          setTipoSuspensaoData(tipoSuspensaoData);
        })
        .catch((error) => {
          console.error('Erro ao buscar os dados do tipoSuspensao:', error);
        });
    }
  }, []);

  // ... (código existente)
}