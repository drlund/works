const exception = use('App/Exceptions/Handler');
const Documento = use('App/Models/Mysql/Designacao/Documento');
const fs = use("fs");
const md5 = use("md5");
const Helpers = use('Helpers');
const setHistorico = use('App/Commons/Designacao/setHistorico');

async function setDocumento(parecer, arquivos, user) {
  try {

    const newFile = new Documento();
    newFile.id_solicitacao = parecer.id_solicitacao;
    parecer.id_negativa && (newFile.id_negativa = parecer.id_negativa);
    newFile.id_historico = parecer.id_historico;
    newFile.texto = parecer.texto || ' ';
    newFile.funci_upload = user.chave;

    const documento = [];

    if (arquivos) {

      fs.mkdirSync(Helpers.appRoot(`uploads/Designacao/${parecer.id_solicitacao}`), { recursive: true })

      for (let arquivo of arquivos) {
        const nome = md5(arquivo.tmpPath);
        await arquivo.move(Helpers.appRoot(`uploads/Designacao/${parecer.id_solicitacao}/`), {
            name: nome,
            overwrite: true,
        });

        if (!arquivo.moved()) {
          return arquivo.error()
        }

        documento.push({ documento: nome, extensao: arquivo.extname });
      }

    }

    newFile.documento = JSON.stringify(documento);

    await newFile.save();

    await setHistorico({ parecer: { ...parecer, id_documento: newFile.id }, user });

    return newFile.id;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = setDocumento;