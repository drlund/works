"use strict";
const { anexoFactory } = use("../CatalogoMetodosModelFactory");
const { getAnexo } = use("../CatalogoMetodosGetters");

const setAnexoExistente = async ( anexo, trx = null ) => {
  const anexoData = await getAnexo.getAnexoFind(anexo.id);
  anexoData.nome = anexo.nome;
  anexoData.nomeOriginal = anexo.nomeOriginal;
  anexoData.extensao = anexo.extensao;
  anexoData.path = anexo.path;
  anexoData.ativo = anexo.ativo;

  return await _setAnexo(anexoData, trx);
}

const setAnexoNovo = async ( projetoData, filesPath, trx = null ) => {
  const anexoData = await anexoFactory(
    {
      nome: temp.name,
      nomeOriginal: anexo.clientName,
      extensao: anexo.extname,
      path: "uploads/" + filesPath,
      ativo: "true",
    },
    projetoData
  );
  return await _setAnexo(anexoData, trx);
}

const _setAnexo = async (anexoData, trx = null) => {
  let gravarAnexo;
  if (trx) {
    gravarAnexo = await anexoData.save(trx);
  } else {
    gravarAnexo = await anexoData.save();
  }
  if (gravarAnexo.isNew) {
    throw new exception(
      "Falha ao gravar os dados dos anexos do projeto.",
      400
    );
  }
  return gravarAnexo;
}

module.exports = {
  setAnexoExistente,
  setAnexoNovo,
};
