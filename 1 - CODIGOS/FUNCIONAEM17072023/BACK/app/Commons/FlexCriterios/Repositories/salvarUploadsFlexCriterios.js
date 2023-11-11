const Helpers = use("Helpers");
const { v4: uuidv4 } = require("uuid");

async function salvarUploadFlexCriterios(ctx) {
  const fileFlex = ctx.request.file("file");

  console.log(ctx.request);

  if (!fileFlex) {
    return null;
  }

  const filePath = Helpers.appRoot("/storage/flexibilizacao");

  const fileName = `${uuidv4()}.${fileFlex.extname}`;

  await fileFlex.move(filePath, {
    name: fileName,
    overwrite: false,
  });

  if (!fileFlex.moved()) {
    throw new Error(JSON.stringify(fileFlex.error()));
  }

  return { url: fileName };
}

module.exports = salvarUploadFlexCriterios;
