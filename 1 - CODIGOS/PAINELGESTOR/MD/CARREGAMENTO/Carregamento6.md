Para incluir as alterações sugeridas e passar os valores de "page" e "pageSize" para o backend, você precisará fazer o seguinte:

1. **Frontend**:

   Nos seus componentes de tabela (LogAcessosTable e LogAtualizacoesTable), você já tem os estados `page` e `pageSize` definidos no início do componente. Você também já está usando esses valores para fazer a solicitação de dados.

   No seu código atual, você está chamando a função `getLogAcessos` ou `getLogAtualizacoes` sem passar os valores de `page` e `pageSize`. Para corrigir isso, você precisa atualizar essas chamadas para incluir esses valores.

   Por exemplo, no componente `LogAcessosTable`:

   ```javascript
   useEffect(() => {
     setIsLoading(true);
     getLogAcessos(id, page, pageSize) // Passando os valores de page e pageSize
       .then((data) => {
         setAtualizacoes(data);
       })
       .catch(() => 'Erro ao obter atualizações!')
       .finally(() => {
         setIsLoading(false);
       });
   }, [id, page, pageSize]); // Certifique-se de incluir page e pageSize como dependências
   ```

   Da mesma forma, no componente `LogAtualizacoesTable`:

   ```javascript
   useEffect(() => {
     setIsLoading(true);
     getLogAtualizacoes(id, page, pageSize) // Passando os valores de page e pageSize
       .then((data) => {
         setAtualizacoes(data);
       })
       .catch(() => 'Erro ao obter atualizações!')
       .finally(() => {
         setIsLoading(false);
       });
   }, [id, page, pageSize]); // Certifique-se de incluir page e pageSize como dependências
   ```

2. **Backend (AdonisJS)**:

   No seu backend (AdonisJS), você já configurou as funções `getLogAcessos` e `getLogAtualizacoes` para receber os valores de "page" e "pageSize" da solicitação. Eles estão configurados para usar esses valores para implementar a paginacão.

   Certifique-se de que esses parâmetros estejam sendo corretamente tratados nas funções do seu repositório, como você fez anteriormente:

   ```javascript
   async getLogAcessos(request) {
     const page = request.input('page', 1);
     const pageSize = request.input('pageSize', 10);
     const offset = (page - 1) * pageSize;

     // Resto do código para buscar os dados com paginação
   }

   async getLogAtualizacoes(request) {
     const page = request.input('page', 1);
     const pageSize = request.input('pageSize', 10);
     const offset = (page - 1) * pageSize;

     // Resto do código para buscar os dados com paginação
   }
   ```

Com essas alterações, o frontend deve passar corretamente os valores de "page" e "pageSize" para o backend, permitindo que você faça a paginacão dos dados no servidor. Certifique-se de atualizar ambos os componentes conforme mostrado acima para garantir que a paginacão funcione corretamente tanto para LogAcessos quanto para LogAtualizacoes.