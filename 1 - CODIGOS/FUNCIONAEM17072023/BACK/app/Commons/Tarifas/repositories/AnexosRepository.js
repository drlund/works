"use strict";

const exception = use("App/Exceptions/Handler");
const Helpers = use("Helpers");
const md5 = require("md5");
const moment = require("moment");
const { arquivoParaBase64 } = use("App/Commons/FileUtils");
var fs = require("fs");

const caminhosTipoAnexo = {
  pagamento: "tarifas/comprovantes_pagamento/",
};

const publicPath = "public/uploads/";

class AnexosRepository {
  constructor(tipo, { anexos, idPagamento }, trx = null) {
    if (Object.keys(caminhosTipoAnexo).includes(tipo)) {
      this.tipoAnexo = tipo;
      this.anexos = anexos;
      this.idPagamento = idPagamento;
      this.caminhoAnexos = publicPath + caminhosTipoAnexo[tipo];
    } else {
      throw new exception(`Tipo de anexo ${tipo} não implementado`, 500);
    }
  }

  async salvarAnexos(trx) {
    fs.mkdirSync(Helpers.appRoot(this.caminhoAnexos), { recursive: true });
    for (const anexo of this.anexos) {
      const base64 = arquivoParaBase64(anexo.tmpPath);
      const nomeAnexo = `${this.idPagamento}_${md5(base64)}.${anexo.extname}`;
      const dadosArquivo = {
        filePath: `${this.caminhoAnexos}${nomeAnexo}`,
        fileName: nomeAnexo,
        fileSize: anexo.size,
        fileExtension: anexo.extname,
        originalName: anexo.clientName,
        mimeType: `${anexo.type}/${anexo.subtype}`,
      };
      await anexo.move(this.caminhoAnexos);
    }
  }

  salvarArquivosLogicos(model) {}
}

module.exports = AnexosRepository;
