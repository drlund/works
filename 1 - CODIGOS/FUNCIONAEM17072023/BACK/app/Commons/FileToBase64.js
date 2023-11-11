"use strict";

var fs = require("fs");

/**
 *  Recebe o caminho para um arquivo e retorna o mesmo codificado em base64
 *
 *  @param caminhoArquivo
 */

var FileToBase64 = function (caminhoArquivo) {
  var arquivoLido = fs.readFileSync(caminhoArquivo);
  let base64 = new Buffer.from(arquivoLido).toString("base64");

  return base64;
};

module.exports = FileToBase64;
