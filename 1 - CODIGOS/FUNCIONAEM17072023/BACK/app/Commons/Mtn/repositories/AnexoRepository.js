"use strict";

/** @type {typeof import('../../Commons/Constants')} */
const { mtnConsts } = use("Constants");
const { tiposAnexo } = mtnConsts;
const md5 = require("md5");
const Helpers = use("Helpers");

class AnexoRepository {

  async salvarAnexos({ arquivos, tipoAnexo, idVinculo, dadosUsuario }, trx) {
    const idAnexosCriados = [];

    for (let arquivo of arquivos) {
      const dadosArquivo = {
        filePath: Helpers.appRoot("/storage/mtn"),
        fileName: `${md5(arquivo.clientName + moment().toString())}.${
          arquivo.extname
        }`,
        fileSize: arquivo.size,
        fileExtension: arquivo.extname,
        originalName: arquivo.clientName,
        mimeType: `${arquivo.type}/${arquivo.subtype}`,
      };

      var novoAnexo = fs.readFileSync(arquivo.tmpPath);

      // Converte o arquivo para base64
      let base64 = new Buffer.from(novoAnexo).toString("base64");

      //Criação do Model
      const newAnexo = new anexoModel();
      newAnexo.nome_arquivo = dadosArquivo.fileName;
      newAnexo.tipo = tipoAnexo;
      newAnexo.incluido_por = dadosUsuario.chave;
      newAnexo.base64 = base64;
      newAnexo.extensao = dadosArquivo.fileExtension;
      newAnexo.mime_type = dadosArquivo.mimeType;
      newAnexo.nome_original = dadosArquivo.originalName;

      await newAnexo.save(trx);
      idAnexosCriados.push(newAnexo.id);

      switch (tipoAnexo) {
        case tiposAnexo.PARECER:
          const newEnvolvidoAnexo = new envolvidoAnexoModel();
          newEnvolvidoAnexo.id_envolvido = idVinculo;
          newEnvolvidoAnexo.id_anexo = newAnexo.id;
          await newEnvolvidoAnexo.save(trx);
          break;

        case tiposAnexo.ESCLARECIMENTO:
          const newEsclarecimentoAnexo = new esclarecimentosAnexoModel();
          newEsclarecimentoAnexo.id_esclarecimento = idVinculo;
          newEsclarecimentoAnexo.id_anexo = newAnexo.id;
          await newEsclarecimentoAnexo.save(trx);
          break;

        case tiposAnexo.PARECER_RECURSO:
          //Criar o vínculo do parecer_recurso com o anexos
          const newParecerRecursoAnexo = new parecerRecursoAnexoModel();
          newParecerRecursoAnexo.id_anexo = newAnexo.id;
          newParecerRecursoAnexo.id_recurso = idVinculo;
          await newParecerRecursoAnexo.save(trx);
          break;

        case tiposAnexo.RECURSO:
          //Criar o vínculo do parecer_recurso com o anexos
          const newRecursoAnexo = new recursoAnexoModel();
          newRecursoAnexo.id_anexo = newAnexo.id;
          newRecursoAnexo.id_recurso = idVinculo;
          await newRecursoAnexo.save(trx);
          break;

        case tiposAnexo.ALTERACAO_MEDIDA:
          //Criar o vínculo do pareceres_revertidos com os anexos
          const newAlterarMedida = new alterarMedidaAnexo();
          newAlterarMedida.id_anexo = newAnexo.id;
          newAlterarMedida.id_alteracao_medida = idVinculo;
          await newAlterarMedida.save(trx);
          break;

        case tiposAnexo.MTN_FECHADO_SEM_ENVOLVIDOS:
          const mtnFechadosSemEnvolvidosAnexos =
            new mtnFechadosSemEnvolvidosAnexosModel();
          mtnFechadosSemEnvolvidosAnexos.id_anexo = newAnexo.id;
          mtnFechadosSemEnvolvidosAnexos.id_mtn_fechado_sem_envolvido =
            idVinculo;
          await mtnFechadosSemEnvolvidosAnexos.save(trx);
          break;

        case null:
          break;

        default:
          throw new exception(
            "Os tipos de anexo devem ser definidos no arquivo app/Commons/Constants informar o tipo de MTN",
            500
          );
          break;
      }
    }

    return idAnexosCriados;
  }
}
 module.exports = AnexoRepository;
