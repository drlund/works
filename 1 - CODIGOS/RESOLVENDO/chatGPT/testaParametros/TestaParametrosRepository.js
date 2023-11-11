'use strict'

const ParamAlcadas = use("App/Models/Mysql/movimentacoes/ParamAlcadas");

class TestaParametrosRepository {
  // ...outros métodos...


  async patchParametros(idParametro, novoParametro) {
    const editaParametro = await ParamAlcadas.query()
      .where("id", parseInt(idParametro))
      .first();

    editaParametro.prefixoDestino = novoParametro.prefixoDestino;
    editaParametro.nomePrefixo = novoParametro.nomePrefixo;
    editaParametro.comissaoDestino = novoParametro.comissaoDestino;
    editaParametro.nomeComissaoDestino = novoParametro.nomeComissaoDestino;
    editaParametro.comite = novoParametro.comite;
    editaParametro.nomeComite = novoParametro.nomeComite;

    await editaParametro.save();
  }
//*************** */
  async patchParametros(idParametro, novoParametro) {
    const editaParametro = await ParamAlcadas.find(idParametro);
  
    if (!editaParametro) {
      throw new Error("Parâmetro não encontrado");
    }
  
    editaParametro.merge({
      comite: novoParametro.comite,
      nomeComite: novoParametro.nomeComite
    });
  
    await editaParametro.save();
  }

  async patchParametrosObservacao(idParametro, novoTextoObservacao) {
    const editaParametro = await ParamAlcadas.find(idParametro);
  
    if (!editaParametro) {
      throw new Error("Parâmetro não encontrado");
    }
  
    editaParametro.observacao += '\n' + novoTextoObservacao;
  
    await editaParametro.save();
  }
//**************** */
  async patchParametrosObservacao(idParametro, novoTextoObservacao) {
    const editaParametro = await ParamAlcadas.query()
      .where("id", parseInt(idParametro))
      .first();

    editaParametro.observacao += '\n' + novoTextoObservacao;

    await editaParametro.save();
  }

  // ...outros métodos...
}

module.exports = TestaParametrosRepository;