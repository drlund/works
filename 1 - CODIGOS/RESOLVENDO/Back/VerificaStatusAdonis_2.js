/**O framework AdonisJS 4.1 não possui uma estrutura de repositório padrão. No entanto, você pode criar um arquivo 
 * de serviço para encapsular a lógica de acesso ao banco de dados. Aqui está um exemplo:
*/

/**
 * Lembre-se de atualizar os caminhos dos arquivos de acordo com a estrutura do seu projeto. Essa abordagem permite 
 * encapsular a lógica de acesso ao banco de dados em um serviço e reutilizá-la em várias partes do código, como no 
 * caso de uso.
 */

// Service (Repository):

const SeuModel = use('App/Models/SeuModel');

class SeuService {
  async buscarRegistro(comissaoDestino, prefixoDestino) {
    try {
      // Executar a consulta no banco de dados para verificar se o registro existe
      const registro = await SeuModel.findBy('prefixoDestino_comissaoDestino', `${prefixoDestino}_${comissaoDestino}`);

      return registro;
    } catch (error) {
      // Lidar com erros
      throw new Error('Ocorreu um erro ao buscar o registro');
    }
  }

  async atualizarStatus(comissaoDestino, prefixoDestino, novoStatus) {
    try {
      // Executar a atualização no banco de dados para alterar o status do registro
      const registro = await SeuModel.findBy('prefixoDestino_comissaoDestino', `${prefixoDestino}_${comissaoDestino}`);
     
      if (registro) {
        registro.ativo = novoStatus;
        await registro.save();
      } else {
        // Criar um novo registro se necessário
        await SeuModel.create({ prefixoDestino_comissaoDestino: `${prefixoDestino}_${comissaoDestino}`, ativo: novoStatus });
      }
    } catch (error) {
      // Lidar com erros
      throw new Error('Ocorreu um erro ao atualizar o status do registro');
    }
  }
}

module.exports = SeuService;


// Agora, você pode usar esse serviço no seu caso de uso:

// Usecase:

const SeuService = use('App/Services/SeuService');

class SeuUsecase {
  constructor() {
    this.seuService = new SeuService();
  }

  async atualizarStatusRegistro(comissaoDestino, prefixoDestino) {
    try {
      // Verificar se o registro já existe no banco de dados
      const registroExistente = await this.seuService.buscarRegistro(comissaoDestino, prefixoDestino);

      if (registroExistente) {
        // O registro existe, então atualizar o status para 1
        await this.seuService.atualizarStatus(comissaoDestino, prefixoDestino, 1);
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
