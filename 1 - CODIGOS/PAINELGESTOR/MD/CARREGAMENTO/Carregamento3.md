Entendi a estrutura do seu código. Para implementar o carregamento sob demanda em seus casos de uso (useCases), você pode seguir as etapas a seguir:

1. **Modificar o Repository**:

   No seu repositório `AcessoRepository`, você não precisa passar o objeto `request` como argumento para os métodos `getLogAcessos` e `getLogAtualizacoes`, pois esses métodos não dependem diretamente do objeto `request`. Portanto, você pode removê-lo. O repositório deve ficar assim:

   ```javascript
   'use strict';

   const LogAcessosPainel = use('App/Models/Mysql/PainelGestor/LogAcessos');
   const LogAtualizacoesPainel = use('App/Models/Mysql/PainelGestor/FatoPainelLog');

   class AcessoRepository {
     async pilotoVigente() {
       // Implementação do método pilotoVigente
     }

     async isParticipantePiloto(prefixo) {
       // Implementação do método isParticipantePiloto
     }

     async getLogAcessos(page, pageSize) {
       const offset = (page - 1) * pageSize;
       const logAcessos = await LogAcessosPainel.query()
         .orderBy('id', 'desc')
         .offset(offset)
         .limit(pageSize)
         .fetch();

       const busca = logAcessos ? logAcessos.toJSON() : [];

       return busca;
     }

     async getLogAtualizacoes(page, pageSize) {
       const offset = (page - 1) * pageSize;
       const logAtualizacoes = await LogAtualizacoesPainel.query()
         .orderBy('id', 'desc')
         .offset(offset)
         .limit(pageSize)
         .fetch();

       const busca = logAtualizacoes ? logAtualizacoes.toJSON() : [];

       return busca;
     }
   }

   module.exports = AcessoRepository;
   ```

2. **Modificar os UseCases**:

   Nos seus casos de uso (`UCAcesso` e `UCLogAtualizacoes`), você também precisa fazer algumas modificações para que eles recebam informações de paginação e os parâmetros corretos:

   - Em `UCAcesso`:

   ```javascript
   'use strict';

   const { AbstractUserCase } = use(
     'App/Commons/AbstractUserCase/AbstractUserCase.js',
   );

   class UCAcesso extends AbstractUserCase {
     async _action({ page, pageSize }) {
       const getLogAcessos = await this.repository.getLogAcessos(page, pageSize);
       if (getLogAcessos) {
         return getLogAcessos;
       }
       return true;
     }
   }

   module.exports = UCAcesso;
   ```

   - Em `UCLogAtualizacoes`:

   ```javascript
   'use strict';

   const { AbstractUserCase } = use(
     'App/Commons/AbstractUserCase/AbstractUserCase.js',
   );

   class UCLogAtualizacoes extends AbstractUserCase {
     async _action({ page, pageSize }) {
       const getLogAtualizacoes = await this.repository.getLogAtualizacoes(
         page,
         pageSize
       );
       if (getLogAtualizacoes) {
         return getLogAtualizacoes;
       }
       return true;
     }
   }

   module.exports = UCLogAtualizacoes;
   ```

3. **Modificar o Controlador**:

   No seu controlador `PainelGestorController`, você precisará ajustar as chamadas para passar os parâmetros de paginação corretamente para seus casos de uso. Isso envolve passar um objeto com `page` e `pageSize` como argumento para os métodos `run`.

   - Em `getAcessos` e `getAtualizacoes`:

   ```javascript
   async getAcessos({ request, response, session }) {
     const usuario = session.get('currentUserAccount');
     const { id, page, pageSize } = request.all();

     const ucLogAcessos = new UCLogAcessos({
       repository: new AcessoRepository(),
     });
     const { error, payload } = await ucLogAcessos.run({ page, pageSize, id, usuario });
     handleAbstractUserCaseError(error);

     response.ok(payload);
   }

   async getAtualizacoes({ request, response, session }) {
     const usuario = session.get('currentUserAccount');
     const { id, page, pageSize } = request.all();

     const ucLogAtualizacoes = new UCLogAtualizacoes({
       repository: new AcessoRepository(),
     });
     const { error, payload } = await ucLogAtualizacoes.run({ page, pageSize, id, usuario });
     handleAbstractUserCaseError(error);

     response.ok(payload);
   }
   ```

   Com essas alterações, você deve ser capaz de passar os parâmetros de paginação corretamente para seus casos de uso e obter o carregamento sob demanda dos dados de log. Certifique-se de que as rotas também estejam configuradas para incluir os parâmetros `page` e `pageSize` quando você chamar esses endpoints no seu front-end.