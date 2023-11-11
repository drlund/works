"use strict";

const { getComposicaoComite } = use("App/Commons/Arh");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const MtnComiteExpandido = use("App/Models/Postgres/MtnComiteExpandido");
/** @type {typeof import('moment')} */
const moment = use("moment");
const { PREFIXO_SUPERADM, COD_COMITE_ADM } = use(
  "App/Commons/Mtn/ComiteMtn/Constants"
);

class ComiteVotacaoRepository {
  async getMembrosComiteExpandido() {
    const membrosComiteExpandido = await MtnComiteExpandido.query()
      .where("data_expiracao", ">=", moment().format("YYYY-MM-DD"))
      .where("ativo", 1)
      .fetch();

    return membrosComiteExpandido.toJSON();
  }

  async getMembrosComiteAdministracao() {
    const membrosComiteAdm = await getComposicaoComite(
      PREFIXO_SUPERADM,
      COD_COMITE_ADM
    );

    return membrosComiteAdm.map((membroComite) => {
      return {
        matricula: membroComite.CD_FUN,
        tipoVotacao: membroComite.CD_TIP_VOT,
        codigoComite: membroComite.CD_ETR_DCS
      };
    });
  }

  async getMembrosComiteMtn() {
    const [membrosComiteAdm, membrosComiteExpandido] = await Promise.all(
      [this.getMembrosComiteAdministracao(), this.getMembrosComiteExpandido()]
    );

    return {
      membrosComiteAdm,
      membrosComiteExpandido,
    };
  }

  async incluirMembroComite({
    matricula,
    nome,
    prefixo,
    data_expiracao,
  }, trx) {
    const membro = await MtnComiteExpandido
      .findOrNew(
        { matricula },
        { matricula, nome, prefixo, data_expiracao }
      );
    await membro.merge({ nome, prefixo, data_expiracao, ativo: 1 });
    await membro.save(trx);

    return membro;
  }

  async alterarMembroComite({ matricula, prefixo, data_expiracao }, trx) {
    return MtnComiteExpandido
      .query()
      .where("matricula", matricula)
      .transacting(trx)
      .update({ data_expiracao, prefixo, ativo: 1 })
  }

  async excluirMembroComite({ matricula }, trx) {
    return MtnComiteExpandido
      .query()
      .where("matricula", matricula)
      .transacting(trx)
      .update({ ativo: 0 });
  }
}

module.exports = ComiteVotacaoRepository;
