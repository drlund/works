Parece que você está tendo um problema com a variável `nomeResponsavel` que está retornando "undefined" quando você faz o console.log. Aqui estão algumas coisas que você pode verificar:

1. Verifique se a requisição está sendo feita corretamente. Certifique-se de que o corpo da requisição contém o campo `nomeResponsavel`.

2. Verifique se o campo `nomeResponsavel` está definido no corpo da requisição. Você pode fazer isso usando `console.log(request.all())` para ver todos os dados da requisição e garantir que o campo esteja lá.

3. Certifique-se de que o campo `nomeResponsavel` não tenha erros de digitação. Verifique se o nome do campo corresponde exatamente ao que você está tentando acessar.

4. Verifique se o middleware de análise de corpo da requisição (por exemplo, `express.json()` se você estiver usando Express.js) está configurado corretamente. Certifique-se de que ele está sendo usado antes das rotas que estão lidando com a requisição.

Se todas essas verificações não resolverem o problema, pode ser útil fornecer mais informações sobre como a requisição é feita e qual é a estrutura do corpo da requisição para que eu possa ajudar melhor.