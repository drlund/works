/**
 * Para modificar a função `handleEdit` e redirecionar o usuário para o formulário de edição, você precisa realizar 
 * algumas etapas. Vou te guiar através delas:

1. Importe o `useHistory` do `react-router-dom`:
   No início do seu arquivo, importe o `useHistory` para que você possa usar o histórico de navegação.
   */

   import { useHistory } from 'react-router-dom';

/**
 * 2. Use o `useHistory` para redirecionar o usuário:
   Dentro da função `handleEdit`, utilize o `useHistory` para redirecionar o usuário para a rota de edição. Certifique-se 
   de passar os dados do registro selecionado como estado.
   */

   const history = useHistory();
   
   // Dentro da função handleEdit
   const handleEdit = (id) => {
     // ...
     
     // Redirecionar para o formulário de edição
     history.push({
       pathname: `/movimentacoes/editar-suspensao/${id}`,
       state: { id: id },
     });
   };

/**
 * 3. Configurar a Rota de Edição:
   No componente que gerencia as rotas (provavelmente onde você tem as configurações do `react-router-dom`), certifique-se 
   de ter uma rota configurada para o formulário de edição.
   */

   import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
   
   // ...
   
   <Router>
     <Switch>
       {/* ... suas outras rotas */}
       <Route path="/movimentacoes/editar-suspensao/:id" component={FormParamSuspensaoPatch} />
     </Switch>
   </Router>

/**
 * Agora, quando você chamar a função `handleEdit` passando o ID do registro, o usuário será redirecionado para o formulário 
 * de edição com os dados desse registro. No componente `FormParamSuspensaoPatch`, você pode acessar o estado da localização 
 * (usando o `useLocation`) para recuperar o ID do registro e, em seguida, usar esse ID para buscar os dados necessários 
 * para preencher o formulário de edição.
 */