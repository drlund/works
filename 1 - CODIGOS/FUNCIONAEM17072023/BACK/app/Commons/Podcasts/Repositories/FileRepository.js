const fs = require('fs');
const Helpers = use('Helpers');
const { getFilesFromRequest, salvaArquivosDiretorioPrivado } = require('../../FileUtils');
const { v4: uuidv4 } = require('uuid');

class FileRepository {
  #arquivo;
  DIRETORIO_MULTIMIDIA = 'public/uploads/multimidia/podcast/';

  constructor(request) {
    this.#arquivo = getFilesFromRequest(request);
    if (this.hasArquivo) {
      this.#arquivo[0].clientName = `${uuidv4()}.${this.#arquivo[0].extname}`;
    }
  }

  get arquivo() {
    return this.#arquivo;
  }

  get hasArquivo() {
    return this.#arquivo.length > 0;
  }

  get nomeArquivo() {
    return this.#arquivo[0].clientName;
  }

  get formatoValidoCapa() {
    return ['jpg', 'png'].includes(this.#arquivo[0].extname);
  }

  get formatoValidoEpisodio() {
    return ['mp4', 'webm'].includes(this.#arquivo[0].extname);
  }

  async isSalvo() {
    return fs.existsSync(Helpers.appRoot(`${this.DIRETORIO_MULTIMIDIA}${this.nomeArquivo}`));
  }

  async salvarArquivo() {
    return salvaArquivosDiretorioPrivado(this.#arquivo, this.DIRETORIO_MULTIMIDIA, false);
  }

}

module.exports = FileRepository;
