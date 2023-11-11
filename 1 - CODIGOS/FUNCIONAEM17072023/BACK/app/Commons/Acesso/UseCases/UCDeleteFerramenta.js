'use strict'
const { AbstractUserCase } = use("App/Commons/AbstractUserCase");

class UCDeleteFerramenta extends AbstractUserCase {
  _checks({ id }) {
    if (!id) {
      throw new Error("Necessário informa o id a ser deletado.");
    }
  }

  async _action({ id }) {
    const {
      concessoesAcessos,
      permissoesFerramentas,
    } = this.repository;

    const {
      MongoTypes,
    } = this.functions;

    const listaUsuarios = await concessoesAcessos
      .findConcessoesWithSelect({ ferramenta: id }, { _id: 1 });

    const idsUsuarios = listaUsuarios.map((funci) => funci.id);

    const remocao = await concessoesAcessos.deletarVariosIds(idsUsuarios);

    if (!remocao.ok) {
      this._throwExpectedError(
        `Erro na exclusão dos usuarios da demanda ${id}.`,
        500,
      );
    }

    const permissaoExcluida = await permissoesFerramentas.removerFerramentaPorId(id);

    if (!permissaoExcluida) {
      this._throwExpectedError(
        `Erro na exclusão da demanda ${id}.`,
        500,
      );
    }

    return { id };
  }
}

module.exports = UCDeleteFerramenta;
