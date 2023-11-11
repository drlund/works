/**
 * Para exibir as mensagens no lugar do "id" no campo "tipoSuspensao", você precisa buscar os dados da chamada da API 
 * "getTipoSuspensao" e mapeá-los para o "id" correspondente em seu estado "suspensoes".  Os dados da chamada API 
 * "getTipoSuspensao" conterão as mensagens relacionadas ao "id" dos dados "suspensoes".
 * 
 *  Veja como você pode conseguir isso:
 *  - Importe a função "getTipoSuspensao" do arquivo "apiParamSuspensao".
 *  - Buscar os dados de "getTipoSuspensao" e armazená-los em uma variável de estado (por exemplo, "tipoSuspensaoDados").
 *  - Modifique a definição de "colunas" no componente "ParamSuspensaoTable" para exibir as mensagens ao invés do "id" 
 *    no campo "tipoSuspensao".
 * 
 *  Passo 1: Importar a função "getTipoSuspensao" do arquivo "apiParamSuspensao".
*/


// ... (imports existentes)
import { getTipoSuspensao } from './apiCalls/apiParamSuspensao';

// ... (código existente)


// Passo 2: Buscar os dados da "getTipoSuspensao" e armazená-los em uma variável de estado.


// ... (código existente)

function ParamSuspensaoTable({ ...props }) {
  // ... (código existente)

  const [tipoSuspensaoDados, setTipoSuspensaoDados] = useState([]);

  useEffect(() => {
    // Buscar os dados da getTipoSuspensao e armazená-los na variável de estado.
    getTipoSuspensao().then((tipoSuspensaoDados) => {
      setTipoSuspensaoDados(tipoSuspensaoDados);
    });
  }, []);

  // ... (código existente)

  const columns = [
    {
      title: 'Tipo',
      dataIndex: 'tipo',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
    },
    {
      title: 'Tipo Suspensão',
      dataIndex: 'tipoSuspensao',
      // Modificar a função de renderização para mostrar as mensagens em vez do id.
      render: (data) => {
        const tipoSuspensaoItem = tipoSuspensaoDados.find((item) => item.id === data);
        return tipoSuspensaoItem ? tipoSuspensaoItem.message : '';
      },
    },
    // ... (outras colunas)
  ];

  // ... (código existente)
}


/**
 * Agora, o campo "tipoSuspensao" na tabela irá exibir as mensagens buscadas na chamada da API "getTipoSuspensao" em vez do "id". 
 * 
 * Certifique-se de que a função "getTipoSuspensao" retorna os dados em um formato de array de objetos, onde cada objeto contém 
 * as propriedades "id" e "message". Por exemplo:
*/

// Dados de exemplo da chamada da API getTipoSuspensao
[
  { id: 1, message: 'Mensagem 1' },
  { id: 2, message: 'Mensagem 2' },
  // ...
]
