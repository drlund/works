"use strict";

const getBrindesByGestor = use('App/Commons/Encantar/Brindes/getBrindesByGestor');
const BrindesEstoque = use('App/Models/Mysql/Encantar/BrindesEstoque');
const BrindesEstoqueLancamentos = use('App/Models/Mysql/Encantar/BrindesEstoqueLancamentos');
const BrindesEstoquePermissao = use('App/Models/Mysql/Encantar/BrindesEstoquePermissao');
const Dependencia = use('App/Models/Mysql/Dependencia');
const exception = use("App/Exceptions/Handler");
const { EncantarConsts } = use('Constants');
const { TIPOS_LANCAMENTOS } = EncantarConsts;


class EncantarEstoqueController {

  async brindesPorPrefixo({ request, response, transform, session }) {
    try {
      const usuarioLogado = session.get("currentUserAccount");
      const prefixo = usuarioLogado.prefixo;
      const brindes = await getBrindesByGestor([prefixo], {});

      const brindesTransformados = await transform.collection(
        brindes.toJSON(),
        "Encantar/BrindesTransformer.estoque"
      );

      response.send(brindesTransformados);
    } catch (error) {
      throw new exception(error, 500);
    }
  }

  async mudarStatusBrinde({request, response, session}) {
    const { idEstoque, ativo } = request.allParams();
    const usuarioLogado = session.get("currentUserAccount");
    const prefixo = usuarioLogado.prefixo;

    const brindeAtual = await BrindesEstoque.query()
    .where('id', idEstoque)
    .where('prefixo', prefixo)
    .first();
    
    if (!brindeAtual) {
      throw new exception("Brinde não encontrado para o seu prefixo!", 400);
    }
    
    try {
      brindeAtual.ativo = ativo; 
      await brindeAtual.save();
      response.ok();
    } catch (error) {
      throw new exception(error, 500);
    }
  }

  async removerBrindeEstoque({ request, response }) {
    const { idEstoque } = request.allParams();

    let saldos = await BrindesEstoque.find(idEstoque);
    let { estoque, reserva } = saldos.toJSON();
    
    if (estoque > 0) {
      throw new exception("Remoção não permitida. Brinde possui estoque cadastrado.", 400);
    } else if (reserva > 0) {
      throw new exception("Remoção não permitida. Brinde possui reserva pendente de entrega.", 400);
    }      
    
    try {
      await BrindesEstoque.query()
        .where('id', idEstoque)
        .delete();

      response.ok();
    } catch (error) {
      throw new exception(error, 500);
    }
  }

  async alterarQuantidadeEstoque({request, response, session}) {
    const { idEstoque, quantidade, tipoOperacao, justificativa } = request.allParams();

    if (!idEstoque) {
      throw new exception("Identificador não informado!", 400)
    }

    let isAdicionar = tipoOperacao === "Adicionar";

    if (!isAdicionar) {
      if (!justificativa) {
        throw new exception("Necessária a justificativa!", 400)
      }
    }

    let saldos = await BrindesEstoque.find(idEstoque);
    let { estoque, reserva } = saldos.toJSON();

    if (!isAdicionar) {
      if (quantidade > (estoque - reserva)) {
        throw new exception("Remoção de quantidade não permitida. Valor maior que o saldo final do estoque!", 400);
      }
    }

    try {
      let brinde = await BrindesEstoque.find(idEstoque);

      if (isAdicionar) {
        brinde.estoque = estoque + quantidade; 
      } else {
        brinde.estoque = estoque - quantidade;
      } 

      await brinde.save();
      const usuarioLogado = session.get("currentUserAccount");

      //adicionar o lancamento do valor
      let dadosLancamento = {
        idBrindesEstoque: idEstoque,
        idTipoLancamentos: isAdicionar ? TIPOS_LANCAMENTOS.CREDITO : TIPOS_LANCAMENTOS.DEBITO,
        quantidade,
        matricula: usuarioLogado.chave,
        observacao: isAdicionar ? "Adicionada quantidade no estoque." : justificativa
      }

      await BrindesEstoqueLancamentos.create(dadosLancamento);
      response.ok();
    } catch (error) {
      throw new exception(error, 500);
    }
  }

  async incluirBrindesEstoque({request, response, session}) {
    let { brindes } = request.allParams();

    if (!brindes) {
      throw new exception("Lista de brindes a adicionar não informada!", 400)
    }

    try {
      const usuarioLogado = session.get("currentUserAccount");
      const prefixo = usuarioLogado.prefixo;
      const notIncluded = [];  

      for (let idBrinde of brindes) {
        let tmpBrinde = await BrindesEstoque.query()
          .where('idBrinde', idBrinde)
          .where('prefixo', prefixo)
          .first();

        if (tmpBrinde) {
          notIncluded.push(idBrinde);
          continue;
        } else {
          //adicionando o brinde no prefixo
          const dados = {
            prefixo,
            idBrinde,
            estoque: 0,
            reserva: 0,
            ativo: 1
          }

          await BrindesEstoque.create(dados);
        }

        if (notIncluded.length) {
          response.send("Atenção! Inclusão realizada com sucesso! Mas " + notIncluded.length + " brindes não foram adicionados por estar duplicados.")
        } else {
          response.send("Brindes adicionados com sucesso!")
        }
      }
    } catch(error) {
      throw new exception(error, 500)
    }

  }

  async getDetentoresEstoque({response}) {
    try {
      let listaDetentores = await BrindesEstoquePermissao.query()
        .setHidden(['createdAt', 'updatedAt'])
        .fetch();

      listaDetentores = listaDetentores.toJSON();

      for (let item of listaDetentores) {
        item.global = item.global === 1 ? "Sim" : "Não"
      }

      response.send(listaDetentores);
    } catch(error) {
      throw new exception(error, 500)
    }
  }

  async deleteDetentorEstoque({request, response}) {
    let { id } = request.allParams();

    if (!id) {
      throw new exception("Identificador do detentor de estoque não informado!", 400)
    }

    try {
      await BrindesEstoquePermissao.query().where('id', id).delete();
      response.ok();
    } catch (error) {
      throw new exception("Exclusão não permitida. Dependência possui brindes cadastrados em estoque!", 500)
    }
  }

  async createDetentorEstoque({ request, response, session }) {
    let { prefixo, global } = request.all();

    if (!prefixo) {
      throw new exception("Prefixo do detentor não informado!", 400)
    }

    let duplicated = await BrindesEstoquePermissao.query()
      .where('prefixo', prefixo)
      .first();

    if (duplicated) {
      throw new exception("Já exisite um detentor de estoque com esse prefixo!", 400)
    }

    try {
      const usuarioLogado = session.get("currentUserAccount");
      let dadosPrefixo = await Dependencia.query().setVisible(['nome']).where('prefixo', prefixo).first();

      let dadosInclusao = {
        prefixo,
        nomePrefixo: dadosPrefixo ? dadosPrefixo.nome : "Nome não encontrado na base",
        global,
        matriculaInclusao: usuarioLogado.chave
      }

      await BrindesEstoquePermissao.create(dadosInclusao);
      response.ok();
    } catch (error) {
      throw new exception(error);
    }
  }

}

module.exports = EncantarEstoqueController;
