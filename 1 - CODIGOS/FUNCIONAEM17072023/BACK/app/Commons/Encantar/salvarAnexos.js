const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;

const md5 = require("md5");
const moment = use("moment");
const { arquivoParaBase64 } = use("App/Commons/FileUtils");

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getCapacitacaoVideos')} */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const anexoModel = use(`${CAMINHO_MODELS}/Anexos`);


/**
 *  Função que salva anexos no banco de dados de acordo com o seu respectivo model
 *
 * @param {Object} model Model ao qual o anexo é referente. Este método deve ter o relacionamento anexos().
 * @param {File[]} arquivos Array de instâncias da classe File
 * @param {String} tipo Tipo do anexo que será incluído. Ex.: Solicitação, aprovação e etc...
 * @param {String} incluiroPor Matrícula do funcionário responsável por incluir o anexo
 * @param {Object} trx Transaction que será utilizara para tornar a operação de salvar os anexos atomica
 */

const salvarAnexos = async (model, arquivos, tipo, incluidoPor, trx, nomeRelacionamentoAnexo = "anexos") => {
  const arquivosModels = [];
  for (let arquivo of arquivos) {
    const dadosArquivo = {
      nomeArquivo: `${md5(arquivo.clientName + moment().toString())}.${
        arquivo.extname
      }`,
      extensao: arquivo.extname,
      mimeType: `${arquivo.type}/${arquivo.subtype}`,
      nomeOriginal: arquivo.clientName,
      tipo,
      incluidoPor,
    };
    dadosArquivo.base64 = arquivoParaBase64(arquivo.tmpPath);
    const novoAnexo = await anexoModel.create(dadosArquivo, trx);
    arquivosModels.push(novoAnexo);
  }
  if (arquivosModels.length > 0) {
    await model[nomeRelacionamentoAnexo]().attach(
      arquivosModels.map((arquivo) => arquivo.id),
      null,
      trx
    );
  }
};

module.exports = salvarAnexos;
