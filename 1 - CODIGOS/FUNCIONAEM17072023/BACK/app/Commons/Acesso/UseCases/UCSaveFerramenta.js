'use strict'
const { AbstractUserCase } = use("App/Commons/AbstractUserCase");

class UCSaveFerramenta extends AbstractUserCase {
  async _checks({ id, nomeFerramenta, listaPermissoes }) {
    const { validate } = this.functions;
    const schema = {
      id: "string",
      nomeFerramenta: "required|string",
      listaPermissoes: "array|min:1",
    };

    const validation = await validate(
      {
        id,
        nomeFerramenta,
        listaPermissoes,
      },
      schema
    );

    if (validation.fails()) {
      throw new Error(
        "Função salvar ferramenta não recebeu todos os parâmetros obrigatórios."
      );
    }
  }

  async _action({ id, nomeFerramenta, listaPermissoes }) {
    const { permissoesFerramentas } = this.repository;

    let permissoes;

    const payloadData = { nomeFerramenta, listaPermissoes };

    if (!id) {
      permissoes = await permissoesFerramentas.inserir(payloadData);
      if (!permissoes) {
        this._throwExpectedError(
          "Erro ao salvar ferramenta no banco de dados.",
          500
        );
      }
    } else {
      permissoes = await permissoesFerramentas.localizarEAtualizar(
        id,
        payloadData
      );
      if (!permissoes) {
        this._throwExpectedError(
          "Erro ao salvar ferramenta no banco de dados.",
          500
        );
      }
    }

    return { id: permissoes.id };
  }
}

module.exports = UCSaveFerramenta;
