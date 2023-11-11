const Helpers = use("Helpers");
const { v4: uuidv4 } = require('uuid');


async function salvarUploadProcuracao(ctx) {
  const arquivoProcuracao = ctx.request.file('arquivoProcuracao');

  if (!arquivoProcuracao) {
    return null;
  }

  const filePath = Helpers.appRoot(
    "/storage/procuracoes/arquivo_procuracoes"
  );

  if (arquivoProcuracao.extname !== 'pdf') {
    throw new Error('Arquivo precisa ser um PDF.');
  }

  const fileName = `${uuidv4()}.${arquivoProcuracao.extname}`;

  await arquivoProcuracao.move(filePath, {
    name: fileName,
    overwrite: false,
  });

  if (!arquivoProcuracao.moved()) {
    throw new Error(JSON.stringify(arquivoProcuracao.error()));
  }

  return fileName;
}

module.exports = salvarUploadProcuracao;