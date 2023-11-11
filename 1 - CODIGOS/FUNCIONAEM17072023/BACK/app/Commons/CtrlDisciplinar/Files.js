"use strict";

const Drive = use("Drive");
const Helpers = use("Helpers");
const exception = use("App/Exceptions/Handler");
const Gedip = use("App/Models/Mysql/CtrlDisciplinar/Gedip");

const CTRLPATH = "uploads/CtrlDisciplinar";

module.exports = {
  FileNew: async ({ docFile, filePath, nome }) => {
    try {
      await docFile.move(Helpers.appRoot(filePath), {
        name: nome,
        overwrite: true,
      });

      return true;
    } catch (err) {
      throw new exception(err);
    }
  },

  FileUploaded: async ({ filePath, nome }) => {
    return await Helpers.appRoot(filePath + nome);
  },

  DeleteFile: async (id_gedip) => {
    try {
      let gedip = await Gedip.find(id_gedip);

      const filePath = `${CTRLPATH}/${gedip.documento}`;

      const exists = await Drive.exists(Helpers.appRoot(filePath));

      if (exists) {
        await Drive.delete(filePath);
      }
      //file removed

      gedip.ativo = 1;
      gedip.dt_conclusao = null;
      gedip.documento = "";
      await gedip.save();

      return true;
    } catch (err) {
      throw new exception(err);
    }
  },
};
