
const moment = require("moment");
const { replaceVariable } = require("../../StringUtils");

const { DATABASE_DATETIME_OUTPUT } = use("App/Commons/Designacao/Constants");

const concessoesAcessos = use("App/Models/Mongo/ConcessoesAcessos");
const tiposAcesso = use("App/Models/Mongo/TiposAcesso");
const permissoesFerramentas = use("App/Models/Mongo/PermissoesFerramentas");

const { MongoTypes } = use("App/Models/Mongo/FactoryModelMongo");

const {
  MENSAGENS_LOG,
  ESTADOS
} = use("App/Commons/Acesso/Constants");

class ConcessoesAcessosRepository {
  async findConcessoes({ listaIdentificadores, ativo = ESTADOS.ATIVO }) {
    const consulta = await concessoesAcessos
      .find({ identificador: { $in: listaIdentificadores }, ativo })
      .populate({ path: "ferramenta", model: permissoesFerramentas })
      .populate({ path: "tipo", model: tiposAcesso });

    return consulta;
  }

  async findConcessoesAtivas(listaIdentificadores) {
    const consulta = await concessoesAcessos.find({
      identificador: { $in: listaIdentificadores },
      ativo: ESTADOS.ATIVO
    })
      .populate({ path: "tipo", model: tiposAcesso })
      .populate({ path: "ferramenta", model: permissoesFerramentas });

    return consulta;
  }

  async findListaConcessoes(query) {
    const consulta = await concessoesAcessos.find({
      ...query
    })
      .populate({ path: "tipo", model: tiposAcesso })
      .populate({ path: "ferramenta", model: permissoesFerramentas });

    return consulta;
  }

  async findConcessoesWithSelect(query, select) {
    const consulta = await concessoesAcessos
      .find({
        ...query
      })
      .select({
        ...select
      });

    return consulta;
  }

  async localizarUm(query) {
    const consulta = await concessoesAcessos.findOne({
      ...query
    });

    return consulta;
  }

  async inserir(dados) {
    const concessoes = new concessoesAcessos(dados);
    await concessoes.save();

    return concessoes;
  }

  async atualizarPorId({ id, update }) {
    const consulta = await concessoesAcessos.findByIdAndUpdate(
      id,
      update,
      {
        new: true,
        returnDocument: 'after'
      }
    )

    return consulta;
  }

  async deletarConcessaoAcesso({ id, usuario }) {
    const dadosMensagem = [
      moment().format(DATABASE_DATETIME_OUTPUT),
      usuario.chave,
      usuario.nome
    ];
    const mensagem = replaceVariable(MENSAGENS_LOG.REVOGACAO, dadosMensagem);

    const consulta = await concessoesAcessos.findByIdAndUpdate(
      id,
      {
        $set: {
          ativo: ESTADOS.INATIVO,
        },
        $push: {
          "log": mensagem,
        }
      },
      {
        new: true,
        returnDocument: 'after'
      }
    )

    return consulta;
  }

  async deletarVariosIds(ids) {
    const consulta = await concessoesAcessos.deleteMany({
      _id: { $in: ids.map((id) => MongoTypes.ObjectId(id)) },
    });

    return consulta;
  }
}

module.exports = ConcessoesAcessosRepository;
