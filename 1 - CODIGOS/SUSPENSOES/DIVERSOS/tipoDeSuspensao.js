/**
 * Para implementar a resposta com o ID do novo tipo de suspensão na sua API do backend, você precisará fazer algumas 
 * modificações na factory `IncluirTipoDeSuspensaoFactory`, na usecase `UcGravarTipoDeSuspensao`, na controller e no 
 * repository. Vou orientá-lo passo a passo.
 */

 // 1. **Atualize a Factory para Retornar o ID**:

 /**
  * Na `IncluirTipoDeSuspensaoFactory`, você precisa ajustá-la para que, após criar um novo tipo de suspensão no banco 
  * de dados, ela retorne o ID gerado. Você pode fazer isso usando o método `save` do modelo e, em seguida, acessar o ID 
  * gerado. Veja como pode ficar:
  */

   const IncluirTipoDeSuspensao = use("App/Models/Mysql/movimentacoes/ParamTipoSuspensao");

   class IncluirTipoDeSuspensaoFactory {
     async incluirTipoDeSuspensao(novoTipoDeSuspensao) {
       const gravarTipoDeSuspensao = new IncluirTipoDeSuspensao();
       gravarTipoDeSuspensao.mensagem = novoTipoDeSuspensao.mensagem;

       await gravarTipoDeSuspensao.save();

       return gravarTipoDeSuspensao.id; // Retorna o ID do novo tipo de suspensão
     }
   }

   module.exports = IncluirTipoDeSuspensaoFactory;

// 2. **Atualize a Usecase para Tratar o ID**:

   /**
    * Na `UcGravarTipoDeSuspensao`, você deve ajustar a lógica para receber o ID do novo tipo de suspensão da factory. 
    * Modifique o método `run` para que ele retorne o ID em vez do modelo completo:
    */

   class UcGravarTipoDeSuspensao {
     // ...

     async run() {
       if (this.validated === false) {
         throw new exception(
           `O método validate() deve ser chamado antes do run()`,
           500
         );
       }

       const dados = { ...this.novoTipoDeSuspensao };
       const novoTipoDeSuspensaoId = await this.IncluirTipoDeSuspensaoFactory.incluirTipoDeSuspensao(
         dados
       );

       return novoTipoDeSuspensaoId; // Retorna o ID do novo tipo de suspensão
     }
   }

   module.exports = UcGravarTipoDeSuspensao;

// 3. **Modifique a Controller para Responder com o ID**:

   /**
    * Na controller, você deve ajustar a resposta para retornar o ID do novo tipo de suspensão em vez do modelo completo. 
    * Altere a linha `response.ok(gravado);` para `response.ok({ id: gravado });`:
    */

   async gravarTipoDeSuspensao({ request, response }) {
     const mensagen = request.allParams();
     const ucGravarTipoDeSuspensao = new UcGravarTipoDeSuspensao(
       new ParametroSuspensaoRepository(),
       new IncluirTipoDeSuspensaoFactory()
     );
     await ucGravarTipoDeSuspensao.validate(mensagen);
     const gravado = await ucGravarTipoDeSuspensao.run();

     response.ok({ id: gravado }); // Retorna o ID do novo tipo de suspensão
   }

// 4. **Atualize o Frontend**:

   /**
    * No frontend, após fazer a chamada para a API de criação do novo tipo de suspensão, você deve acessar o ID retornado 
    * na resposta da API para usá-lo conforme necessário no seu aplicativo frontend.
    */

/**
 * Com essas modificações, sua API agora retornará o ID do novo tipo de suspensão após a criação bem-sucedida, e seu 
 * frontend poderá utilizá-lo conforme necessário. Certifique-se de que o código do frontend esteja configurado para 
 * tratar corretamente essa resposta.
 */