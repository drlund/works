'use strict'

const { unshift } = require("pdfkit");
const { DeleteFile } = require("../../../Commons/CtrlDisciplinar/Files");
const { SetDocEnviado } = require("../../../Commons/CtrlDisciplinar/Gedip");

const DocumentoGedip = use("App/Models/Mysql/CtrlDisciplinar/DocumentoGedip");
const AcoesGestores = use("App/Models/Mysql/CtrlDisciplinar/AcoesGestores");

const GedipController = use("App/Controllers/Http/CtrlDisciplinar/GedipController");
const Helpers = use('Helpers')
const { GedipShow, AddAcao, InativarGedip } = use('App/Commons/CtrlDisciplinar/Gedip');
const { FileNew, FileUploaded } = use('App/Commons/CtrlDisciplinar/Files');

const { FunciRespMail } = use('App/Commons/CtrlDisciplinar/Mail');

const { tiposEmailsCtrlDiscp } = use("Constants");
const { ENVIO_NORMAL, ENVIO_COBRANCA, ENVIO_DOCUMENTO } = tiposEmailsCtrlDiscp;

const exception = use("App/Exceptions/Handler");
const md5 = require('md5');

const jsonExport = use('App/Commons/JsonExport');

const { PdfAdvertencia, PdfDestituicao, PdfSuspensao, PdfTermoCiencia, PdfRespPecuniaria, PdfRespPecuniariaCiencia, PdfRespPecuniariaAdvertencia, PdfDemissao, PdfEncerrado, PdfCasoAbrangido, PdfCancelado, PdfAlertaEticoNegocial, DownloadPdf, DownloadUpPdf } = use('App/Templates/CtrlDisciplinar/PdfMedidasDocs');

const { Advertencia, Destituicao, Suspensao, TermoDeCiencia, RespPecuniaria, RespPecuniariaCiencia, RespPecuniariaAdvertencia, Demissao, Encerrado, CasoAbrangido, Cancelamento, AlertaEticoNegocial} = use('App/Templates/CtrlDisciplinar/MedidasDocs');

const CTRLPATH = 'uploads/CtrlDisciplinar';


class DocumentoGedipController {


  /**
 * Lista todos os documentos de gedips.
 * GET docsgedips
 *
 * @param {object} ctx
 */

  async index() {
    try {

      const all = DocumentoGedip.all();

      return all;
    } catch (error) {
      throw new exception('Falha ao receber os documentos gedips!', 400);
    }
  }

  async store({ request, session, response }) {

    try {
      const dadosUsuario = session.get('currentUserAccount');

      const parGedIndex = { id: request.body.id_gedip };

      let ged = await GedipShow({ params: parGedIndex });

      const docFile = request.file('file', {
        size: '20mb'
      });

      const name = `${ged.id_gedip}_${ged.nm_gedip}_${ged.funcionario_gedip}`;
      const namr = md5(`${name}`);
      const filename = `${namr}.${docFile.extname}`;

      // enviando arquivo para a pasta correta
      const fileNew = await FileNew({ docFile: docFile, filePath: CTRLPATH, nome: `${filename}` });

      if (fileNew) {
        const docGedip = await DocumentoGedip.query()
          .insert({ id_gedip: ged.id_gedip, })
      }

      const anexo = {   // file on disk as an attachment
        filename,
        path: CTRLPATH + '/' + filename // stream this file
      }

      const email = await FunciRespMail({ gedip: ged, tipoEmail: ENVIO_DOCUMENTO, anexo });

      const acoesGestores = await AddAcao({ dadosGedip: ged, id_acao: 5, dadosUsuario: dadosUsuario });

      if (acoesGestores) {
        await SetDocEnviado(ged.id_gedip, filename);
      }

    } catch (err) {
      throw new exception('Falha ao receber o arquivo!', 400);
    }

  }

  /**
 * Lista um documento de gedip.
 * GET docsgedips/:id
 *
 * @param {object} ctx
 */

  async show({ params, response, session }) {

    try {

      const dadosUsuario = session.get('currentUserAccount');
      let gedip, doc;

      gedip = await GedipShow({ params: params });
      //doc = await DocumentoGedip.findBy('id_gedip', params.id);

      // const documento = JSON.parse(doc.texto_doc);
      let filePdf;
      switch (gedip.id_medida) {
        case 1:
          filePdf = PdfTermoCiencia({ docGedip: await TermoDeCiencia({ gedip: gedip }) });
          break;
        case 2:
          filePdf = PdfRespPecuniariaCiencia({ docGedip: await RespPecuniariaCiencia({ gedip: gedip }) });
          break;
        case 3:
          filePdf = PdfAdvertencia({ docGedip: await Advertencia({ gedip: gedip }) });
          break;
        case 4:
          filePdf = PdfSuspensao({ docGedip: await Suspensao({ gedip: gedip }) });
          break;
        case 5:
          filePdf = PdfDestituicao({ docGedip: await Destituicao({ gedip: gedip }) });
          break;
        case 6:
          filePdf = PdfDemissao({ docGedip: await Demissao({ gedip: gedip }) });
          break;
        case 7:
          filePdf = PdfEncerrado({ docGedip: await Encerrado({ gedip: gedip }) });
          break;
        case 8:
          filePdf = PdfCasoAbrangido({ docGedip: await CasoAbrangido({ gedip: gedip }) });
          break;
        case 9:
          filePdf = PdfCancelado({ docGedip: await Cancelamento({ gedip: gedip }) });
          break;
        case 10:
          filePdf = PdfRespPecuniariaAdvertencia({ docGedip: await RespPecuniariaAdvertencia({ gedip: gedip }) });
          break;
        case 11:
          filePdf = PdfAlertaEticoNegocial({ docGedip: await AlertaEticoNegocial({ gedip: gedip }) });
          break;
        default:
          throw new exception("Erro ao receber os dados do Documento");
      }

      AddAcao({ dadosGedip: gedip, id_acao: 4, dadosUsuario: dadosUsuario });

      return filePdf;

    } catch (error) {
      throw new exception("Problema ao acessar sistema!", 400);
    }
  }

  async showDown({ request, response }) {

    try {

      let params = request.allParams();

      const filePdf = params.filePdf;
      await DownloadPdf(response, filePdf);

    } catch (error) {
      throw new exception("Problema ao localizar arquivo. Por favor, tente novamente mais tarde!", 400);
    }
  }

  async showUp({ request, response }) {

    try {
      let params = request.allParams();
      let gedip;

      gedip = await GedipShow({ params: params });
      const filePdf = `${CTRLPATH}/${gedip.documento}`;
      await DownloadUpPdf(response, filePdf);

    } catch (err) {
      throw new exception("Erro no acesso ao documento", 400);
    }
  }

  async removeDoc({ request, response }) {
    try {
      let { id_gedip } = request.allParams();

      const remover = DeleteFile(id_gedip);

      return request.ok(remover);

    } catch (error) {
      throw new exception("Erro no acesso ao documento", 400);
    }
  }


}

module.exports = DocumentoGedipController
