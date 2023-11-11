Parece que estou presumindo que você está passando os valores de "page" e "pageSize" nas solicitações, mas essa configuração pode variar dependendo do seu frontend.

Se você estiver usando um componente de tabela ou um componente de paginação, você precisará configurar a passagem dos valores "page" e "pageSize" a partir do frontend para o backend. A forma exata de fazer isso depende da estrutura do seu aplicativo e das bibliotecas que você está usando no frontend.

Aqui estão algumas diretrizes gerais sobre como definir esses valores:

1. **Paginação no Frontend**:

   Em seu componente de frontend que exibe a tabela, normalmente você terá uma interface de usuário que permite ao usuário navegar entre páginas ou escolher o número de itens por página. Nesse componente, você precisa configurar a passagem desses valores para as chamadas de API que recuperam os dados.

   Por exemplo, se você estiver usando React, você pode definir estados para "page" e "pageSize" e atualizá-los com base nas ações do usuário. Em seguida, você passaria esses valores quando fizer a solicitação para obter os dados da página atual.

   ```javascript
   const [page, setPage] = useState(1);
   const [pageSize, setPageSize] = useState(10);

   // ...

   useEffect(() => {
     // Faça a solicitação para obter os dados da página atual
     getLogAcessos({ page, pageSize })
       .then((data) => {
         setAcessos(data);
       })
       .catch(() => 'Erro ao obter acessos!')
       .finally(() => {});
   }, [page, pageSize]);
   ```

2. **Chamadas de API no Frontend**:

   Certifique-se de que as chamadas de API que você está fazendo no frontend incluam os parâmetros "page" e "pageSize" na solicitação. Você deve enviar esses valores para o servidor para que o backend saiba qual página e quantos itens por página você deseja.

   Por exemplo, em sua chamada para `getLogAcessos`, você pode configurar os parâmetros da seguinte forma:

   ```javascript
   getLogAcessos(id, page, pageSize)
     .then((data) => {
       setAcessos(data);
     })
     .catch(() => 'Erro ao obter acessos!')
     .finally(() => {});
   ```

3. **No Backend**:

   Certifique-se de que o backend (AdonisJS) esteja configurado para aceitar os parâmetros "page" e "pageSize" nas rotas e usá-los nas consultas SQL, como você fez anteriormente nas funções `getLogAcessos` e `getLogAtualizacoes`.

Verifique a estrutura do seu componente de tabela e como você está fazendo as chamadas de API no frontend para garantir que os valores de "page" e "pageSize" sejam definidos corretamente e passados para o backend. Se ainda tiver problemas, compartilhe mais detalhes sobre como o componente de tabela e as chamadas de API estão configurados no seu frontend, para que eu possa fornecer orientações mais específicas.