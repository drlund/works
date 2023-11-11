"use strict";

const Imagens = use("App/Models/Mysql/Ambiencia/Imagem.js");
const Env = use("Env");
const Drive = use("Drive");
const path = use("path");
class ImagensRepository {
  async getImagemByPrefixoSubordTipo(prefixo, subord, tipo) {
    const imagemData = await Imagens.query()
      .where({ prefixo, cd_subord: subord, tipo })
      .whereHas('ambiente', builder => {
        builder.whereNot('confidencial', 1)
      })
      .orderBy('data_update', 'desc')
      .first();

    return imagemData ? imagemData.toJSON() : imagemData;
  }

  async getCaminhoAbsoluto(caminhoRelativo) {
    // o replace é para remover a sujeira da string que vem da tabela
    return Env.get('FILE_SRC_APACHE')+caminhoRelativo.replace('\r', '');
  }

  async isImagemExistente(caminho) {
    // path.sep é equivalente ao directory_separator do php
    // const caminhoBySO = caminho.replace("/\//g", path.sep);
    const caminhoBySO = path.normalize(path.resolve(caminho));
    return await Drive.exists(caminhoBySO);
  }
}

module.exports = ImagensRepository;
