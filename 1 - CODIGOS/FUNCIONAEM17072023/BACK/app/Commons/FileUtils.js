const fs = use("fs");
const Helpers = use('Helpers');
/**
 *  Recebe uma instância do request enviado aos controllers e devolve uma array dos arquivos existentes
 *  Os arquivos devem ser enviados em um formData, se não for informado a chave ele presume a chave 'files'
 *
 * @param {*} request
 */

const getFilesFromRequest = (request, nameList = 'files') => {
  let arquivos = [];

  //Caso não existam arquivos
  if (request.file(nameList)) {
    //Caso múltiplos arquivos
    arquivos = request.file(nameList).files;
    //Caso único arquivo
    if (!arquivos) {
      arquivos = [request.file(nameList)];
    }
    return arquivos;
  }

  if (request.files(nameList)) {
    let arquivosTemp = request.files(nameList);
    for (let chave in arquivosTemp) {
      arquivos.push(arquivosTemp[chave]);
    }
    return arquivos;
  }

  return arquivos;
}

/**
 * Gerar o FileJar que é usado em conjunto com o método salvaArquivoPublicoNoDiretorio
 * @param {Object} request a requisição que chega no backend e que contém os anexos
 * @param {String} nameList o nome escolhido no FormData para o conjunto de anexos.
 * @param {Object} validacao objeto com os parametros que se deseja validar (provavelmente só {size: '10mb', types: ["image", "pdf"]} por exemplo)
 * @returns {Object} tipo FileJar para ser usado com o método moveAll que permite escrever todos os anexos de uma vez no servidor
 */
const getFilesJarFromRequest = (request, nameList, validacao = null) => {
  let arquivos = request.file(nameList, validacao);
  return arquivos;
}

/**
 *   Converte um arquivo para BASE64
 */
const arquivoParaBase64 = (caminhoArquivo) => {
  //Lê o arquivo a partir da sua localização temporária
  var novoArquivo = fs.readFileSync(caminhoArquivo);
  // convert binary data to base64 encoded string
  let base64 = new Buffer.from(novoArquivo).toString("base64");
  return base64;
}

/**
 * Gravar o(s) arquivo(s) no diretório de uploads do servidor
 * para erros consulte o link (https://adonisjs.com/docs/4.1/file-uploads#_multiple_file_uploads)
 * @param {Array} arquivos = lista dos anexos a serem gravados
 * @param {String} tmpPath = o caminho a ser gravado
 * @param {Function} callback = instrução para renomear os arquivos, ou outros ajustes na gravação
 * @return {Array} Retorna um array de objetos com a identificação dos arquivos que não foram salvos, se não houver erros retorna um array vazio (para manter o padrão no retorno)
 */

const salvaArquivoPublicoNoDiretorio = async (arquivos, tmpPath, callback = null) => {
  const publicPath = 'public/uploads/';
  let errosNaGravacao = [];
  fs.mkdirSync(Helpers.appRoot(publicPath + tmpPath), { recursive: true })

  // executa a gravação dos arquivos no servidor
  await arquivos.moveAll(Helpers.appRoot(publicPath + tmpPath), callback);

  if (!arquivos.movedAll()) {
    errosNaGravacao = arquivos.errors();
  }

  return errosNaGravacao;
}

const salvaArquivosDiretorioPrivado = async (arquivos, path, overwrite) => {

  // cria diretório no endereço especificado (no caso o path passado)
  fs.mkdirSync(Helpers.appRoot(path), { recursive: true })

  for (const arquivo of arquivos) {
    const nome = arquivo.clientName;

    await arquivo.move(Helpers.appRoot(path), {
      name: nome,
      overwrite: overwrite,
    });

    if (!arquivo.moved()) {
      return arquivo.error()
    }
  }

  return {
    message: "Arquivo(s) salvo(s) com sucesso",
    type: "success"
  }
}

module.exports = {
  getFilesFromRequest,
  arquivoParaBase64,
  salvaArquivoPublicoNoDiretorio,
  getFilesJarFromRequest,
  salvaArquivosDiretorioPrivado
}