/**
 * Agora, você pode utilizar o parâmetro existente no método `gravarParametro`, pois o mesmo será retornado corretamente 
 * pelo método `buscarParametroExistente` da sua `ParametrosAlcadasRepository`. Verifique se essa mudança resolve o 
 * problema que você estava enfrentando.
 * 
 * Vamos adicionar o método `buscarParametroExistente(dadosDosParametros)` à `ParametrosAlcadasRepository` para buscar 
 * o parâmetro existente com base nos dados fornecidos.
 */

// **ParametrosAlcadasRepository.js**:


const moment = require("moment");
const ParamAlcadas = use("App/Models/Mysql/movimentacoes/ParamAlcadas");

class ParametrosAlcadasRepository {
  // ... outros métodos existentes ...

  /**
   * Busca o parâmetro existente com base nos dados fornecidos.
   * @param {Object} dadosDosParametros - Dados do novo parâmetro que está sendo gravado.
   * @returns {Promise<Object | null>} - Retorna o parâmetro existente ou null caso não seja encontrado.
   */
  async buscarParametroExistente(dadosDosParametros) {
    const parametroExistente = await ParamAlcadas.query()
      .where("prefixoDestino", dadosDosParametros.prefixoDestino)
      .where("comissaoDestino", dadosDosParametros.comissaoDestino)
      .first();

    return parametroExistente ? parametroExistente.toJSON() : null;
  }
}

module.exports = ParametrosAlcadasRepository;


/**
 * Agora, a `ParametrosAlcadasRepository` possui o método `buscarParametroExistente(dadosDosParametros)` que recebe os 
 * dados do novo parâmetro a ser gravado e busca se já existe um parâmetro com o mesmo `prefixoDestino` e `comissaoDestino` 
 * no banco de dados. Caso o parâmetro exista, ele é retornado; caso contrário, é retornado `null`. 
 * 
 * Com essa adição, a controller deve ser ajustada para chamar esse método para obter o parâmetro existente antes de 
 * gravar o novo parâmetro:
*/

// **SuaController.js**:

const moment = require("moment");
const UcGravarParametro = require("./UcGravarParametro"); // Substitua pelo caminho correto para o arquivo da sua use case
const ParametrosAlcadasRepository = require("./ParametrosAlcadasRepository"); // Substitua pelo caminho correto para o arquivo da sua repository
const ParamAlcadasIncluirFactory = require("./ParamAlcadasIncluirFactory"); // Substitua pelo caminho correto para o arquivo da sua factory

class SuaController {
  async gravarParametro({ request, response, session }) {
    const dadosDosParametros = request.allParams();
    const usuario = session.get("currentUserAccount");

    // Instancia a sua repository
    const parametrosAlcadasRepository = new ParametrosAlcadasRepository();

    // Busca o parâmetro existente com base nos dados fornecidos
    const parametroExistente = await parametrosAlcadasRepository.buscarParametroExistente(dadosDosParametros);

    // Restante do código aqui...
  }
}

module.exports = SuaController;
