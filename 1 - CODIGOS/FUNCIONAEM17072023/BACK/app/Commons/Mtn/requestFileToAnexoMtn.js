"use strict";
const { arquivoParaBase64 } = use("App/Commons/FileUtils");
const md5 = require("md5");
const moment = require("moment");

const requestFileToAnexoMtn = (arquivo, matriculaInclusao, tipoAnexo) => {
  const dadosArquivo = {
    fileName: `${md5(arquivo.clientName + moment().toString())}.${
      arquivo.extname
    }`,
    fileSize: arquivo.size,
    fileExtension: arquivo.extname,
    originalName: arquivo.clientName,
    mimeType: `${arquivo.type}/${arquivo.subtype}`,
  };

  const base64 = arquivoParaBase64(arquivo.tmpPath);

  return {
    nome_arquivo: dadosArquivo.fileName,
    tipo: tipoAnexo,
    incluido_por: matriculaInclusao,
    base64: base64,
    extensao: dadosArquivo.fileExtension,
    mime_type: dadosArquivo.mimeType,
    nome_original: dadosArquivo.originalName,
  };
};

module.exports = requestFileToAnexoMtn;
