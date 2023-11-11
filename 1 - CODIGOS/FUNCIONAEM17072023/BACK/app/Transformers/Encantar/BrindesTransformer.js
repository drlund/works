"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const md5 = require("md5");

const Env = use("Env");

const BACKEND_URL = Env.get("BACKEND_URL", "http://localhost:3333");
const IMAGE_PATH = `${BACKEND_URL}/get-image/encantar/`;

/**
 * BrindesTransformer class
 *
 * @class BrindesTransformer
 * @constructor
 */
class BrindesTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      ...model,
    };
  }

  transformEstoque(model) {
    const { brinde, dadosPrefixo } = model;
    if (brinde.imagens) {
      brinde.imagens = brinde.imagens.map((imagem) => {
        return { id: imagem.id, urlData: IMAGE_PATH + imagem.etag };
      });
    }

    return {
      ...brinde,
      id: model.id,
      idBrinde: brinde.id,
      imagens: brinde.imagens,
      quantidadeSelecionada: model.quantidadeSelecionada,
      dadosPrefixo: dadosPrefixo
        ? {
            nome: dadosPrefixo.nome,
            cnpj: dadosPrefixo.cnpj,
            endereco: `${dadosPrefixo.logradouro} - ${dadosPrefixo.compl_logradouro}`,
            bairro: dadosPrefixo.bairro,
            cidade: `${dadosPrefixo.municipio} - ${dadosPrefixo.nm_uf}`,
            cep: dadosPrefixo.cep,
            prefixo: dadosPrefixo.prefixo,
          }
        : null,
      dadosEstoque: {
        id: model.id,
        ativo: model.ativo,
        estoque: model.estoque,
        reserva: model.reserva,
        prefixo: model.prefixo,
      },
    };
  }
}

module.exports = BrindesTransformer;
