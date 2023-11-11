'use strict'
const Brindes = use('App/Models/Mysql/Encantar/Brindes');
const BrindesEstoque = use('App/Models/Mysql/Encantar/BrindesEstoque');
const BrindesImagens = use('App/Models/Mysql/Encantar/BrindesImagens');
const Imagens = use('App/Models/Mysql/Encantar/Imagens');
const BrindeImagensTransformer = use("App/Transformers/Encantar/BrindeImagensTransformer");
const exception = use("App/Exceptions/Handler");
const moment = use("App/Commons/MomentZoneBR");
const baseMoment = require('moment-timezone');
const md5 = require('md5');

class CatalogoController {

  async findAllBrindes({response, transform}) {
    let catalogoQuery = await Brindes.query()
      .where('excluido', 0)
      .with('imagens', builder => {
        builder.setVisible(['id', 'etag'])
      })
      .setHidden(['createdAt', 'updatedAt'])
      .fetch();

    let transfomedData = await transform.collection(catalogoQuery.toJSON(), BrindeImagensTransformer);
    response.send(transfomedData);
  }

  async findBrinde({request, response, transform}) {
    let { id } = request.allParams();

    if (!id) {
      throw new exception("Identificador do brinde não informado.", 400);
    }

    const brinde = await Brindes.query()
      .where('excluido', 0)
      .where('id', id)
      .with('imagens', builder => {
        builder.setVisible(['id', 'etag'])
      })
      .setHidden(['createdAt', 'updatedAt'])
      .first();

    if (!brinde) {
      throw new exception("Brinde não encontrado!", 400);
    }

    let transfomedData = await transform.item(brinde.toJSON(), BrindeImagensTransformer);
    response.send(transfomedData);
  }

  async deleteBrinde({request, response, session}) {
    let { id } = request.allParams();

    if (!id) {
      throw new exception("Identificador do brinde não informado.", 400);
    }

    //verifica se o brinde nao possui nenhum saldo em estoque/reserva
    let resumoSaldos = await BrindesEstoque.query()
      .sum('estoque as totalEstoque')
      .sum('reserva as totalReserva')
      .where('idBrinde', id);

    let { totalEstoque, totalReserva } = resumoSaldos[0];

    if (totalEstoque > 0) {
      throw new exception("Remoção não permitida. Brinde possui estoque cadastrado.", 400);
    } else if (totalReserva > 0) {
      throw new exception("Remoção não permitida. Brinde possui reserva pendente de entrega.", 400);
    }

    try {
      const dadosUsuario = session.get('currentUserAccount');
      //apenas marca o flag de excluido, mantem as imagens ainda na base. 
      await Brindes.query().where('id', id).update({ excluido: 1, matriculaExclusao: dadosUsuario.chave});
      response.ok();
    } catch(error) {
      throw new exception("Falha ao remover este brinde. Contate o administrador do portal.", 400);
    }
  }

  async storeBrinde({request, response}) {
    let params = request.allParams();
    let imagens = params.files;
    let imagensExcluir = params.imagensExcluir;
    let dados = {
      nome: params.nome,
      descricao: params.descricao,
      encantamento: params.encantamento ? params.encantamento : null,
      valorEstimado: params.valorEstimado.replace(".", "").replace(",", "."),
      permiteMultiplos: params.permiteMultiplos,
      limiteMinimo: parseInt(params.permiteMultiplos) === 1 ? params.limiteMinimo : 1,
      limiteMaximo: parseInt(params.permiteMultiplos) === 1 ? params.limiteMaximo : 1,
      fatorIncremento: parseInt(params.permiteMultiplos) === 1 ? params.fatorIncremento : 1,
      tipo: params.tipo,
      validade: params.validade && params.validade !== "null" ? baseMoment.utc(moment(params.validade, "DD/MM/YYYY", true)) : null
    };

    try {
      let idBrinde = params.id;

      if (!idBrinde) {
        //novo brinde
        const novoBrinde = await Brindes.create(dados);
        idBrinde = novoBrinde.id;
      } else {
        //edicao de brinde existente
        const brindeAtual = await Brindes.find(idBrinde);
        brindeAtual.merge(dados);
        await brindeAtual.save();
      }

      if (imagens) {
        //criacao de novas imagens
        for (let imagem of imagens) {
          //criando primeiro a imagem
          const newImagem = await Imagens.create({base64: imagem, etag: md5(imagem)});
          await BrindesImagens.create({idImagem: newImagem.id, idBrinde})
        }
      }

      if (imagensExcluir) {
        //remocao de imagens
        for (let idExcluir of imagensExcluir) {
          //remove a relacao
          await BrindesImagens.query()
            .where('idImagem', idExcluir)
            .where('idBrinde', idBrinde)
            .delete();

          //remove a imagem
          await Imagens.query()
            .where('id', idExcluir)
            .delete();
        }
      }

      response.ok();
    } catch (error) {
      throw new exception(error, 400);
    }
  }

}

module.exports = CatalogoController
