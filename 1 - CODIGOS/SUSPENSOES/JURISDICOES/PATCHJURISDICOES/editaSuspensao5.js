/**Parece que o problema está relacionado ao componente `ParamSuspensaoTable`, que não está passando corretamente os dados 
 * para o formulário ou não está lidando com a exibição do formulário de edição após o clique no ícone de edição.
 * 
 * Vou fornecer algumas orientações sobre como você pode abordar isso:

1. **Modificar a Função `handleEdit`:**
   A função `handleEdit` deve ser modificada para redirecionar o usuário para o formulário de edição e passar os dados do 
   registro selecionado como estado para a próxima rota. Atualmente, a função está tentando acessar `props.handleEdit
   (record.id)`, mas isso não parece estar conectado ao componente de formulário de edição.

2. **Criar Rota de Edição:**
   Crie uma rota no seu aplicativo para a edição da suspensão. Certifique-se de passar os parâmetros necessários, como o ID 
   do registro, para que o componente de edição possa recuperar os dados corretos. Por exemplo:
   */

   history.push({
     pathname: `/movimentacoes/editar-suspensao/${record.id}`,
     state: { id: record.id },
   });

/**
 * 3. **Componente de Edição:**
   No componente de edição (`FormParamSuspensaoPatch`), você precisará acessar o estado da localização para obter os 
   parâmetros passados da rota. Use o `useLocation` do `react-router-dom` para acessar os parâmetros da rota.
   */

   import { useLocation } from 'react-router-dom';
   
   // ...
   
   const location = useLocation();
   const id = location.state.id;
   // Agora você pode usar o ID para buscar os dados do registro para edição
   
   // ...

Certifique-se de fazer essas modificações em seu código para garantir que os dados sejam passados corretamente do componente `ParamSuspensaoTable` para o formulário de edição (`FormParamSuspensaoPatch`). Além disso, verifique se as rotas estão configuradas corretamente para permitir a navegação para o formulário de edição.