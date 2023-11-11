"use strict";
const quorumModel = use("App/Models/Mysql/movimentacoes/ExcessoesQuorum");
const quorumHistoricoModel = use(
  "App/Models/Mysql/movimentacoes/ExcessoesQuorumHistorico"
);

class QuorumRepository {
  async recuperarQuorum(prefixo) {
    if (!prefixo) {
      const excessoes = await quorumModel.all();
      return excessoes.toJSON();
    }
    const excessoes = await quorumModel
      .query()
      .where("prefixo", prefixo)
      .first();
    return excessoes ? excessoes.toJSON() : {};
  }

  async criarQuorum(prefixo, quorum, matricula) {
    const quorumCriado = await quorumModel.create({ prefixo, quorum });

    if (quorumCriado) {
      await quorumHistoricoModel.create({
        prefixo,
        quorum,
        matricula,
        acao: "Criou",
      });
    }

    return;
  }

  async alterarQuorum(prefixo, quorum, matricula) {
    const qtdQuorunsAlterados = await quorumModel
      .query()
      .where("prefixo", prefixo)
      .update({ quorum });
    if (qtdQuorunsAlterados >= 1) {
      await quorumHistoricoModel.create({
        prefixo,
        quorum,
        matricula,
        acao: "Alterou",
      });
    }
    return;
  }

  async excluirQuorum(prefixo, matricula) {
    const qtdLinhasExcluidas = await quorumModel
      .query()
      .where("prefixo", prefixo)
      .delete();

    if (qtdLinhasExcluidas >= 1) {
      await quorumHistoricoModel.create({
        prefixo,
        matricula,
        acao: "Deletou",
      });
    }
    return;
  }
}

module.exports = QuorumRepository;
