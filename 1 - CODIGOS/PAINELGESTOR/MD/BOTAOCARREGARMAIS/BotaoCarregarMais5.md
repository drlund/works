O problema que você está enfrentando, onde apenas 10 registros estão sendo retornados, pode estar relacionado à maneira como a lógica de paginação está implementada no seu backend. As rotas do seu backend parecem estar definidas corretamente, mas você precisa verificar a implementação dos métodos no seu `PainelGestorController`, especialmente os métodos `getAcessos` e `getAtualizacoes`.

Aqui estão algumas etapas que você pode seguir para verificar e atualizar sua implementação no backend:

1. **PainelGestorController.js:** Abra o seu arquivo `PainelGestorController.js` onde você implementou os métodos `getAcessos` e `getAtualizacoes`.

2. **Verifique os Parâmetros:** Certifique-se de que os métodos `getAcessos` e `getAtualizacoes` estão recebendo corretamente os parâmetros `page` e `pageSize` da solicitação. Você deve usar esses parâmetros para determinar o limite e o deslocamento dos registros.

3. **Verifique a Consulta ao Banco de Dados:** Verifique a consulta real que está sendo feita ao banco de dados dentro desses métodos. Certifique-se de que não existe uma limitação rígida ou um valor fixo sendo usado para limitar o número de registros retornados.

4. **Calcule o Limite e o Deslocamento:** Use os valores dos parâmetros `page` e `pageSize` para calcular o limite e o deslocamento apropriados para a consulta. O limite deve ser igual a `pageSize`, e o deslocamento deve ser igual a `(page - 1) * pageSize`.

5. **Atualize a Consulta ao Banco de Dados:** Certifique-se de que a consulta ao banco de dados está usando os valores calculados para o limite e o deslocamento. Algo semelhante a:

   ```javascript
   const limit = pageSize;
   const offset = (page - 1) * pageSize;

   const logAcessos = await LogAcessosPainel.query()
     .orderBy('id', 'desc')
     .offset(offset)
     .limit(limit)
     .fetch();
   ```

6. **Teste no Insomnia:** Após fazer essas atualizações, teste novamente sua rota no Insomnia, garantindo que você esteja passando os parâmetros `page` e `pageSize` corretamente e que a consulta retorne o número esperado de registros.

Certifique-se de que o código no `PainelGestorController` esteja implementado para usar os parâmetros de paginação corretamente ao consultar o banco de dados. Se o problema persistir após verificar e atualizar sua implementação no backend, você pode precisar depurar mais detalhadamente o código para identificar a causa do problema.