'use strict'
const Database = use('Database');
const exception = use('App/Exceptions/Handler');

/**
 * Controller generico para obter imagens de qualquer banco de dados
 * que tenha uma tabela chamada imagens e pelo menos os campos base64 e etag (md5 do campo base64).
 * Sugestao: criar um database que contenha apenas a tabela imagens e
 * criar uma conexao para ele. Desta forma serviria de repositorio para
 * todas as imagens de todas as ferramentas.
 */
class ImagemController {

  async findImage({request, response}) {
    const { imageHash, connection } = request.allParams();

    if (!imageHash) {
      //imagemHash é o conteudo do campo etag
      throw new exception("Identificador da imagem não informado!", 400);
    }

    if (!connection) {
      throw new exception("Connection not informed!", 400);
    }

    //verifica se o etag foi informado na solicitacao, caso seja, basta informar
    //ao navegador para usar o cache, pois o etag é unico por imagem.
    const lastETag = request.request.headers['if-none-match'];

    if (lastETag === imageHash) {
      return response
        .header('ETag', lastETag)
        .header('Cache-Control', 'max-age=86400, public')
        .notModified();
    }

    const register = await Database.connection(connection).table('imagens')
      .select('base64', 'etag')
      .where('etag', imageHash)
      .first();

    if (!register) {
      return response.header('Cache-Control', 'no-cache, max-age=0')
      .notFound();
    }

    let b64Parts = register.base64.split(",");
    let b64String = b64Parts[1];

    const buf = Buffer.from(
      b64String,
      "base64"
    );

    let imageType = b64Parts[0].split(";")[0].split(":")[1];

    response
      .header("Content-Type", imageType)
      .header("Content-length", `${buf.length}`)
      .header('ETag', imageHash)
      .header('Cache-Control', 'max-age=86400, public')
      .send(buf);    
  }
}

module.exports = ImagemController
