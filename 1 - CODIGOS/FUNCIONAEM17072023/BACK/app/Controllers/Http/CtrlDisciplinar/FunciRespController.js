'use strict'

const FunciResp = use("App/Models/Mysql/CtrlDisciplinar/FunciResp");
const AcoesGestores = use("App/Models/Mysql/CtrlDisciplinar/AcoesGestores");
const DocumentoGedip = use("App/Models/Mysql/CtrlDisciplinar/DocumentoGedip");
const { getOneFunci, getOneDependencia, getManyFuncis, getManyDependencias } = use("App/Commons/Arh");

const { GedipShow, FunciRespNew, AddAcao, CompGedip } = use('App/Commons/CtrlDisciplinar/Gedip');
const { FunciRespMail } = use('App/Commons/CtrlDisciplinar/Mail');

const { tiposEmailsCtrlDiscp } = use("Constants");
const { ENVIO_NORMAL, ENVIO_COBRANCA, ENVIO_DOCUMENTO } = tiposEmailsCtrlDiscp;

const exception = use("App/Exceptions/Handler");

const {
  Advertencia, Destituicao, Suspensao,
  TermoDeCiencia, RespPecuniariaCiencia, Demissao,
  Encerrado, CasoAbrangido, Cancelamento,
  RespPecuniariaAdvertencia, AlertaEticoNegocial
} = use('App/Templates/CtrlDisciplinar/MedidasDocs');

const _ = require('lodash');

class FunciRespController {

  /**
   * Lista todos os funcis responsabilizados cadastrados na ferramenta.
   * GET funcisresps
   *
   * @param {object} ctx
   */

  async index() {
    try {
      const all = FunciResp.all();

      return all;
    } catch (error) {
      throw new exception("Problema ao recuperar todas as ações!", 400);
    }
  }

  async findResp({ request, response }) {
    try {
      let { matricula } = request.allParams();

      const funciEnv = await getOneFunci(matricula);

      const resp = await FunciRespNew({ funciEnv });

      response.send(resp);
    } catch {
      throw exception("Não foi possível verificar o Responsável!", 400);
    }
  }

  async store({ session, request, response }) {

    try {
      const dadosUsuario = session.get('currentUserAccount');
      let { funciResp, id_gedip, id_funci_resp, chave_funci_resp } = request.allParams();

      !funciResp && (funciResp = request.body.funciResp);
      !id_gedip && (id_gedip = request.body.id_gedip);

      let dadosGedip, result, funciEnv;

      dadosGedip = await GedipShow({ params: { id: id_gedip } });
      (!funciResp && chave_funci_resp) && (funciResp = await getOneFunci(chave_funci_resp));

      if (_.isNil(request.newGedip)) {

        if (dadosUsuario.chave === dadosGedip.chave_funci_resp) {
          throw exception("Funcionário não pode delegar para si mesmo!");
        }

        let funci = {
          id_gedip: dadosGedip.id_gedip,
          chave_funci_resp: funciResp.matricula,
          prefixo_resp: funciResp.prefixoLotacao,
          desc_cargo: funciResp.descCargo,
          funci_registro: dadosUsuario.chave,
        };

        funciEnv = await getOneFunci(dadosGedip.funcionario_gedip);

        if (_.isNil(dadosGedip.id_funci_resp)) {
          result = await FunciResp.create(funci);
        } else {
          result = await FunciResp.query()
            .where('id_funci_resp', dadosGedip.id_funci_resp)
            .update(funci);
        }

      } else {
        /**
         * ! para próxima iteração, montar novo método no commons Gedip para
         * ! salvar todos os dados do novo formulário, a ser preenchido pela
         * ! SuperAdm, contendo a complementação dos dados da Demissão, como
         * ! as datas do Exame Demissional, data de apresentação na agência,
         * ! entre outras informações necessárias para gerar o termo de demissão.
         */

        funciEnv = await getOneFunci(dadosGedip.funcionario_gedip);

        result = await FunciRespNew({ funciEnv: funciEnv, id_gedip: dadosGedip.id_gedip });

      }

      // criacao do documento da  Gedip e inserção na tabela
      let docGedip;



      const gedip = await GedipShow({ params: dadosGedip });

      switch (gedip.id_medida) {
        case 1:
          docGedip = TermoDeCiencia({ gedip: gedip });
          break;
        case 2:
          docGedip = RespPecuniariaCiencia({ gedip: gedip });
          break;
        case 3:
          docGedip = Advertencia({ gedip: gedip });
          break;
        case 4:
          docGedip = Suspensao({ gedip: gedip });
          break;
        case 5:
          docGedip = Destituicao({ gedip: gedip });
          break;
        case 6:
          docGedip = Demissao({ gedip: gedip });
          break;
        case 7:
          docGedip = Encerrado({ gedip: gedip });
          break;
        case 8:
          docGedip = CasoAbrangido({ gedip: gedip });
          break;
        case 9:
          docGedip = Cancelamento({ gedip: gedip });
          break;
        case 10:
          docGedip = RespPecuniariaAdvertencia({ gedip: gedip });
          break;
        case 11:
          docGedip = AlertaEticoNegocial({ gedip: gedip });
          break;
        default:
          throw new exception("Erro ao receber os dados da Gedip", 400);
      }

      let doc = await DocumentoGedip.findBy('id_gedip', gedip.id_gedip);

      if (_.isNil(doc)) {
        doc = await DocumentoGedip.create({
          id_gedip: gedip.id_gedip,
          texto_doc: JSON.stringify(docGedip),
        });
      } else {
        const data = { texto_doc: JSON.stringify(docGedip) };
        doc.merge(data);

        await doc.save();
      }
      // fim da criação do documento

      // envio de email para o Funcionário Responsável
      await FunciRespMail({ gedip: gedip, tipoEmail: ENVIO_NORMAL });

      await AddAcao({ dadosGedip: gedip, id_acao: 1, dadosUsuario: dadosUsuario });

      return result;

    } catch (err) {
      throw new exception("Erro no acesso aos dados FunciResp", 400);
    }
  }

  async complementaGedip({ session, request, response }) {
    try {
      const { dados } = request.allParams();

      const funci = await CompGedip(dados);

      let complemento = null;

      const funciResp = await getOneFunci(dados.funci_resp);

      request.body.funciResp = funciResp;
      request.body.id_gedip = dados.id_gedip;

      if (funci) {
        complemento = await this.store({ session, request, response });
      }

      response.ok(complemento);
    } catch (error) {
      throw new exception("Falha ao recuperar os dados do primeiro gestor!", 400);
    }
  }
}

module.exports = FunciRespController
