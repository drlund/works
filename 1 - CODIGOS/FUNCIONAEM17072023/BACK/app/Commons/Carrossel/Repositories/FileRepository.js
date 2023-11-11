const fs = require('fs');
const { getFilesFromRequest, salvaArquivosDiretorioPrivado } = require('../../FileUtils');
const Helpers = use('Helpers');

class FileRepository {
  #video;

  constructor(request) {
    this.#video = getFilesFromRequest(request);
  }

  get video() {
    return this.#video;
  }

  get formatoValido() {
    return ['mp4', 'webm'].includes(this.#video[0].extname);
  }

  get url() {
    return `painelComunicacao/${this.#video[0].clientName}`;
  }

  async isSalvo() {
    return fs.existsSync(Helpers.appRoot(`uploads/${this.url}`));
  }

  async salvarArquivo() {
    return salvaArquivosDiretorioPrivado(this.#video, 'uploads/painelComunicacao/', false);
  }
}

module.exports = FileRepository;
