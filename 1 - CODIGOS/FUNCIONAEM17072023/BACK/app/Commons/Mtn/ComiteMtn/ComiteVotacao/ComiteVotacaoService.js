"use strict";

const exception = use("App/Exceptions/Handler");
const Database = use("Database");
const { getOneFunci } = use("App/Commons/Arh");

class ComiteVotacaoService {
  constructor({ comiteVotacaoRepository }) {
    this.comiteVotacaoRepository = comiteVotacaoRepository;
  }

  async getComiteVotacao() {
    return this.comiteVotacaoRepository
      .getMembrosComiteExpandido()
      .catch(err => {
        throw new exception(err, 500);
      })
  }

  async _retornarFunci({ matricula }) {
    const funci = await getOneFunci(matricula);
    if (!funci) throw new exception('Matricula informada é inválida', 400);
    return funci;
  }

  async incluirMembroComite({
    matricula,
    data_expiracao,
  }) {
    const { nome, prefixoLotacao: prefixo } = await this._retornarFunci({ matricula });

    const trx = await Database.connection("pgMtn").beginTransaction();

    try {
      const result = await this.comiteVotacaoRepository
        .incluirMembroComite({
          matricula,
          nome,
          prefixo,
          data_expiracao,
        }, trx);

      await trx.commit();

      return result;
    } catch (err) {
      await trx.rollback();
      throw new exception(err, 500);
    }
  }

  async alterarMembroComite({
    matricula,
    data_expiracao,
  }) {
    const { prefixoLotacao: prefixo } = await this._retornarFunci({ matricula });

    const trx = await Database.connection("pgMtn").beginTransaction();

    try {
      const result = await this.comiteVotacaoRepository
        .alterarMembroComite({
          matricula,
          prefixo,
          data_expiracao,
        }, trx);

      await trx.commit();

      return result;
    } catch (err) {
      await trx.rollback();
      throw new exception(err, 500);
    }
  }

  async excluirMembroComite({ matricula }) {
    const trx = await Database.connection("pgMtn").beginTransaction();

    try {
      const result = await this.comiteVotacaoRepository
        .excluirMembroComite({ matricula }, trx);

      await trx.commit();

      return result;
    } catch (err) {
      await trx.rollback();
      throw new exception(err, 500);
    }
  }
}

module.exports = ComiteVotacaoService;
