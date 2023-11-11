"use strict";
const { atividadePausaFactory } = use("../CatalogoMetodosModelFactory");

const setPausaNova = (pausa) => {
  const pausaData = await atividadePausaFactory(pausa);
  await pausaData.save(trx);
  if (pausaData.isNew) {
    throw new exception("Falha ao gravar a(s) pausa(s) do projeto.", 400);
  }

  return pausaData;
}

module.exports = {
  setPausaNova,
}