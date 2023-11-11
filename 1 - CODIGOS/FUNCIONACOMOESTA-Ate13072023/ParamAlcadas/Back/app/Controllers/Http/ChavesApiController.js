'use strict'
const apiKeysModel = use('App/Models/Mysql/ChavesApi');
const exception = use('App/Exceptions/Handler');
const { validate } = use("Validator");
const { v4: uuidv4 } = require('uuid');

class ChavesApiController {
  async generateNewKey({ request, response, session }) {
    const { nomeFerramenta, responsavel } = request.allParams();

    const schema = {
      nomeFerramenta: "required|string",
      responsavel: "required|string",
    };

    const validation = await validate(
      {
        nomeFerramenta,
        responsavel,
      },
      schema
    );

    if (validation.fails()) {
      throw new exception("Falha ao gerar uma nova chave de API. Necessário todos os parâmetros obrigatórios", 400);
    }

    let dadosUsuario = session.get("currentUserAccount");

    try {
      let dadosNovaChave = new apiKeysModel();
      dadosNovaChave.chave = uuidv4();
      dadosNovaChave.ferramenta = nomeFerramenta;
      dadosNovaChave.responsavel = responsavel;
      dadosNovaChave.matriculaGerador = dadosUsuario.chave;
      await dadosNovaChave.save();
      response.ok();
    } catch (err) {
      throw new exception("Falha ao inserir nova chave na base de dados!", 400);
    }
  }

  async findAll({response}) {
    let allKeys = await apiKeysModel.all();
    allKeys = allKeys.toJSON();
    allKeys = allKeys.map(elem => { return {...elem, key: elem.chave}})
    response.send(allKeys);
  }

  async removeKeys({request, response}) {
    const {selectedKeys} = request.allParams();
    try {
      await apiKeysModel.query().whereIn('chave', selectedKeys).delete();
      response.ok();
    } catch (err) {
      throw new exception("Falha ao remove a(s) chaves(s) selecionada(s)!", 400);
    }
  }
}

module.exports = ChavesApiController
