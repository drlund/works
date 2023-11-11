/**
 * Se cada registro da tabela tem apenas um valor válido para os campos "vicePresi", "diretoria", "supers", "gerev", 
 * "prefixo" ou "matriculas", você precisa mapear o valor do campo "tipo" para o campo correspondente na tabela do 
 * banco de dados ao chamar a função `handleEdit`.

Aqui está como você pode fazer isso:

1. **Mapeie o Valor do Campo "tipo" para o Campo Correspondente:**

   Antes de redirecionar para a página de edição, mapeie o valor do campo "tipo" para o campo correspondente na tabela 
   do banco de dados. Você pode criar um objeto de mapeamento para facilitar isso.
   */

   const tipoToColumnMap = {
     'Vice Presidencia': 'vicePresi',
     'Unid. Estratégica': 'diretoria',
     'Unid. Tática': 'supers',
     Comercial: 'gerev',
     Prefixo: 'prefixo',
     Matrícula: 'matriculas',
   };

   // ...

   const handleEdit = (id, tipo) => {
     const column = tipoToColumnMap[tipo];
     
     history.push({
       pathname: `/movimentacoes/editar-suspensao/${id}`,
       state: { id: id, tipo: column, tipoSuspensao: record.tipoSuspensao, validade: record.validade },
     });
   };

/**
 * 2. **No Componente de Edição (`FormParamSuspensaoPatch`):**

   No componente de edição, você pode usar o valor do campo "tipo" passado no estado para determinar qual campo da tabela 
   do banco de dados você precisa buscar.
   */

   function FormParamSuspensaoPatch({ location }) {
     const { id, tipo } = location.state;
     const [suspensaoData, setSuspensaoData] = useState(null);

     useEffect(() => {
       if (id && tipo) {
         // Chamar a função para obter os dados da suspensão com base no ID e tipo
         getSuspensoes().then((data) => {
           const suspensao = data.find((item) => item.id === id);
           if (suspensao) {
             setSuspensaoData(suspensao);
           }
         });
       }
     }, [id, tipo]);

     // ...
   }

/**
 * Com essa abordagem, você está mapeando o valor do campo "tipo" para o campo correspondente na tabela do banco de dados 
 * e usando-o para buscar os dados corretos da suspensão. Certifique-se de adaptar essas alterações ao seu código existente.
 */