/**Claro! Aqui está um exemplo de como você pode abordar o problema usando o framework AdonisJS 4.1:
*/

// Controller: (na verdade isso seria o REPOSITORY)

const Database = use('Database');
const SeuModel = use('App/Models/SeuModel');

class SeuController {
  async seuEndpoint({ request, response }) {
    try {
      // Extrair os dados do formulário do frontend
      const { comissaoDestino, prefixoDestino } = request.post();

      // Chamar a usecase para atualizar o status do registro
      await Database.transaction(async (trx) => {
        await SeuModel.query(trx)
          .where({ prefixoDestino_comissaoDestino: `${prefixoDestino}_${comissaoDestino}` })
          .update({ ativo: 1 });
      });

      // Responder com sucesso
      response.status(200).json({ message: 'Status atualizado com sucesso' });
    } catch (error) {
      // Lidar com erros
      console.error(error);
      response.status(500).json({ message: 'Ocorreu um erro ao atualizar o status do registro' });
    }
  }
}

module.exports = SeuController;

// Usecase:

const SeuModel = use('App/Models/SeuModel');

class SeuUsecase {
  async atualizarStatusRegistro(comissaoDestino, prefixoDestino) {
    try {
      // Verificar se o registro já existe no banco de dados
      const registroExistente = await SeuModel.findBy('prefixoDestino_comissaoDestino', `${prefixoDestino}_${comissaoDestino}`);

      if (registroExistente) {
        // O registro existe, então atualizar o status para 1
        registroExistente.ativo = 1;
        await registroExistente.save();
      } else {
        // O registro não existe, pode executar alguma lógica adicional se necessário
        // ...
      }
    } catch (error) {
      // Lidar com erros
      throw new Error('Ocorreu um erro ao atualizar o status do registro');
    }
  }
}

module.exports = SeuUsecase;

// Model:

const Model = use('Model');

class SeuModel extends Model {
  static get table() {
    return 'sua_tabela';
  }
}

module.exports = SeuModel;
