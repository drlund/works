/**
 * Parece que o problema está relacionado ao carregamento dos dados da suspensão a partir da função `getSuspensoes` 
 * quando você clica no ícone de edição do `dataTable`. Certifique-se de que a função `getSuspensoes` seja chamada 
 * e os dados sejam carregados corretamente quando você navega para o formulário de edição.

Para garantir que os dados sejam carregados corretamente, você pode fazer o seguinte:

1. **Passar Dados para o Componente de Edição:**

   No momento em que você redireciona o usuário para o formulário de edição usando a função `handleEdit`, passe os dados 
   da suspensão selecionada como estado:
   */

   const handleEdit = (id) => {
     // ...
     
     history.push({
       pathname: `/movimentacoes/editar-suspensao/${id}`,
       state: { id: id, ...otherData }, // Passe os dados relevantes da suspensão aqui
     });
   };

/**
 * 2. **No Componente de Edição (`FormParamSuspensaoPatch`):**

   No componente de edição, você deve acessar os dados da suspensão a partir do estado da localização. Certifique-se de 
   fazer uma chamada à função `getSuspensoes` para obter os dados completos da suspensão com base no ID passado.
   */

   import { useLocation } from 'react-router-dom';
   
   // ...
   
   function FormParamSuspensaoPatch() {
     const location = useLocation();
     const id = location.state.id;
     
     const [suspensaoData, setSuspensaoData] = useState(null);
     
     useEffect(() => {
       if (id) {
         // Chamar a função para obter os dados da suspensão com base no ID
         getSuspensoes().then((data) => {
           const suspensao = data.find((item) => item.id === id);
           if (suspensao) {
             setSuspensaoData(suspensao);
           }
         });
       }
     }, [id]);
     
     // ...
   }

3. **Preencher o Formulário:**

   Use os dados da suspensão carregados do estado para preencher o formulário de edição.

   function FormParamSuspensaoPatch() {
     // ...
     
     return (
       // ...
       <Form
         form={form}
         // ...
         initialValues={{
           tipo: suspensaoData ? suspensaoData.valor : '',
           // Preencha os outros campos do formulário de acordo com os dados da suspensão
         }}
       >
         {/* ... */}
       </Form>
       // ...
     );
   }

Certifique-se de adaptar essas alterações ao seu código atual e garantir que a função `getSuspensoes` seja chamada corretamente para obter os dados da suspensão com base no ID passado. Isso deve permitir que você carregue os dados corretos no formulário de edição quando clicar no ícone de edição no `dataTable`.