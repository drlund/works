"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");
var fs = require("fs");
const Drive = use("Drive");
const Helpers = use("Helpers");

class UCDownloadArquivo extends AbstractUserCase {
  async _checks() {}

  async _action(id, response) {
    const { anexos } = this.repository;

    const dbanexo = await anexos.getAnexoById(id);

    let tmpFileName =
      Helpers.appRoot("/storage/flexibilizacao/") + dbanexo?.url;
    let bufferFile = new Buffer.from(anexo.base64, "base64");
    fs.writeFileSync(tmpFileName, bufferFile);
    response.attachment(tmpFileName);
    const exists = await Drive.exists(tmpFileName);

    if (exists) {
      await Drive.delete(tmpFileName);
    }
    return response;
  }
}

module.exports = UCDownloadArquivo;
