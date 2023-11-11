'use strict'

const exception = use('App/Exceptions/Handler');
const Documento = use("App/Models/Mysql/CtrlDisciplinar/Documento")
const { GedipShow } = use('App/Commons/CtrlDisciplinar/Gedip');
const { FunciRespMail } = use('App/Commons/CtrlDisciplinar/Mail');

const { tiposEmailsCtrlDiscp } = use("Constants");
const { ENVIO_NORMAL, ENVIO_COBRANCA, ENVIO_DOCUMENTO } = tiposEmailsCtrlDiscp;

class DocumentoController {


    /**
   * Lista todos tipos de documentos.
   * GET docs
   *
   * @param {object} ctx
   */

    async index () {
      try{
        const all = Documento.all();

        return all;
      } catch (error) {
        throw new exception("Erro ao localizar os documentos!", 400);
      }
    }

    async cobranca ({request, response}) {
      try {
        const { id_gedip } = request.allParams();

        const gedip = await GedipShow({ params: {id: id_gedip} });

        const email = await FunciRespMail({ gedip: gedip, tipoEmail: ENVIO_COBRANCA });

        if (email) {
            response.ok(email);
        } else {
            response.status(500).send('Erro ao enviar email');
        }
      } catch(error) {
        throw new exception("Erro ao enviar e-mail", 400);
      }
    }
}

module.exports = DocumentoController
