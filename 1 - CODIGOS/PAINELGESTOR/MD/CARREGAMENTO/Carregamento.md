Para implementar o carregamento sob demanda (lazy loading) em suas tabelas no front-end, você pode fazer as seguintes alterações:

1. **Paginação dos Dados no Front-End**:

   Primeiro, você pode adicionar recursos de paginação à sua tabela para carregar um número limitado de registros por página. Isso ajudará a reduzir a quantidade de dados carregados de uma só vez. Você já tem a opção `pagination` configurada em suas tabelas, o que é ótimo. Certifique-se de que a opção `pagination` esteja configurada corretamente para controlar o número de itens por página.

   Exemplo de como você pode configurar a opção `pagination` para carregar 10 itens por página:

   ```javascript
   pagination={{
     showSizeChanger: true,
     pageSizeOptions: ['10', '20', '50'],
     defaultPageSize: 10, // Defina o número de itens por página aqui
   }}
   ```

2. **Carregamento Sob Demanda**:

   Para implementar o carregamento sob demanda, você pode adicionar um botão "Carregar Mais" ou usar o evento de rolagem (Infinite Scroll) para solicitar mais dados ao servidor à medida que o usuário navega pelas páginas ou rola para baixo na tabela.

   - **Botão "Carregar Mais"**:

     Adicione um botão "Carregar Mais" abaixo da tabela. Quando o usuário clicar nesse botão, você pode fazer uma nova solicitação ao servidor para buscar os próximos registros da próxima página. Adicione esses registros à tabela existente sem substituir os dados anteriores.

   - **Infinite Scroll (Rolagem Infinita)**:

     Implemente a lógica de rolagem infinita para detectar quando o usuário está se aproximando do final da página e, em seguida, faça uma solicitação ao servidor para buscar mais dados. Adicione esses dados à tabela existente conforme o usuário rola para baixo.

   Você pode usar bibliotecas como `react-infinite-scroll-component` para facilitar a implementação do Infinite Scroll.

3. **No Back-End**:

   No seu back-end (AdonisJS), você precisará atualizar as rotas e controladores para receber informações adicionais, como o número da página e o número de itens por página. Em seguida, ajuste suas consultas SQL para retornar apenas os registros relevantes com base nas informações fornecidas.

   Você pode usar parâmetros na URL para passar informações de paginação para o back-end, como `/api/getLogAcessos?page=2&pageSize=10`.

   No seu controlador, você pode usar esses parâmetros para calcular o deslocamento (offset) e limitar (limit) a quantidade de dados retornados pela consulta SQL.

   ```javascript
   const page = request.input('page', 1);
   const pageSize = request.input('pageSize', 10);
   const offset = (page - 1) * pageSize;

   const logAcessos = await LogAcessosPainel.query()
     .orderBy("id", "desc")
     .offset(offset)
     .limit(pageSize)
     .fetch();
   ```

Certifique-se de ajustar os métodos `getLogAcessos` e `getLogAtualizacoes` para aceitar esses parâmetros de paginação no seu repositório AdonisJS. Isso permitirá que você busque os dados de acordo com a página solicitada.

Com essas alterações, você poderá implementar a paginação de dados e o carregamento sob demanda em suas tabelas para lidar com grandes conjuntos de dados no seu aplicativo AdonisJS. Isso melhorará significativamente o desempenho e a experiência do usuário.