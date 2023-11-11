'use strict'

const _ = require('lodash');

const Gedip = use("App/Models/Mysql/CtrlDisciplinar/Gedip");
const MailLog = use("App/Models/Mysql/CtrlDisciplinar/MailLog");
const FunciRespController = use("App/Controllers/Http/CtrlDisciplinar/FunciRespController");
const AcoesGestores = use("App/Models/Mysql/CtrlDisciplinar/AcoesGestores");

const Drive = use('Drive');
const Helpers = use('Helpers');
const md5 = use('md5');

const { GedipShow, GedipGestor, GedipPerm, AddAcao, InativarGedip, GetBulkGedips, SetBulkGedips } = use('App/Commons/CtrlDisciplinar/Gedip');

const exception = use("App/Exceptions/Handler");

const moment = require('moment');
const getPrimGestor = use('App/Commons/Designacao/getPrimGestor');

const PrefDipes = "8559";
const PrefGepesPR = "8931";
const PrefSuperADM = "9009";

const {
  isFeriadoNacional,
  isFeriadoPrefixo,
  isFinalSemana
} = use("App/Commons/DateUtils");


// Classe Controller da tabela GEDIP, no schema app_ctrl_disciplinar
class GedipController {

  /**
 * Lista todos os registros do Gedip.
 * GET gedips
 *
 * @param {object} ctx
 */

  async index({ session, request, response }) {

    const dadosUsuario = session.get('currentUserAccount')

    try {

      let all;
      let params = {user: dadosUsuario};

      if (!_.isEmpty(dadosUsuario.prefixo) && (request.isPrefsPessoas || request.temPermissaoAtualizar || request.temPermissaoVisualizar)) {
        if ( [PrefDipes, PrefGepesPR].includes(dadosUsuario.prefixo) || dadosUsuario.prefixo === PrefSuperADM) {
          params.tipo = 1;
          params.isGestor = true;
        } else if (request.temPermissao) {
          params.tipo = 2;
          params.isGestor = false;
        }
      } else {
        params.tipo = 3;
        params.isGestor = true;
      }

      all = await GedipShow({ params });

      return response.ok(all);
    } catch (err) {
      throw new exception("Falha ao acessar a lista de Gedips", 400);
    }

  }

  /**
* Create/save um novo registro Gedip.
* POST gedips
*
* @param {object} ctx
* @param {Request} ctx.request
*/

  async store({ session, request }) {

    const dadosUsuario = session.get('currentUserAccount');
    try {

      const funciRespController = new FunciRespController();

      let { dadosGedip } = request.allParams();

      dadosGedip.funci_inclusao_gedip = dadosUsuario.chave;
      dadosGedip.prefixo_inclusao_gedip = dadosUsuario.prefixo;

      dadosGedip.forca_real && delete dados.forca_real;
      dadosGedip.desc_ocorrencia && delete dados.desc_ocorrencia;
      dadosGedip.dp_funci_gedip && delete dados.dp_funci_gedip;
      dadosGedip.info_adicional && delete dados.info_adicional;
      dadosGedip.norm_descumpridos && delete dados.norm_descumpridos;
      dadosGedip.nmComite && delete dadosGedip.nmComite;
      dadosGedip.nmMedida && delete dadosGedip.nmMedida;

      dadosGedip.gestor_envolvido ? dadosGedip.status_gedip = 2 : dadosGedip.status_gedip = 1;

      let result = await Gedip.create(dadosGedip);
      result = result.toJSON();

      request.body.id_gedip = result.id_gedip;
      request.dadosGedip = result;

      // após inserir os dados da GEDIP no banco de dados, o sistema deve:
      // * calcula o gestor e preenche toda a linha da tabela funci_resps
      // * Calcular os documentos de acordo com os dados recebidos


      if (dadosGedip.gestor_envolvido || dadosGedip.id_medida === 6) {

        await AddAcao({ dadosGedip: result, id_acao: 2, dadosUsuario: dadosUsuario });

      } else {
        request.newGedip = true;
        await funciRespController.store({ session: session, request: request });
      }


      return result;

    } catch (err) {
      throw new exception("Falha ao cadastrar novo Gedips", 400);
    }
  }

  /**
   * Lista um registro Gedip
   *
   * @param {params} object
   */

  async show({ params }) {

    try {
      const gedip = await GedipShow({ params: params });

      return gedip;
    } catch (err) {
      throw new exception("Falha ao consultar um registro!!!");
    }
  }

  /**
   * Atualiza um registro Gedip
   *
   * @param {params} object
   * @param {Request} ctx.request
   */
  async update({ params, request, response }) {
    try {
      const gedip = await Gedip.findByOrFail('id_gedip', params.id_gedip);
      const data = request.only(['valor_gedip', 'comite_gedip', 'funcionario_gedip', 'id_medida', 'dt_julgamento_gedip', 'dt_limite_execucao', 'funci_alteracao_gedip']);

      Object.keys(data).filter(key => {
        if (data[key] === null) {
          delete data[key];
          return true;
        }
      });

      gedip.merge(data);

      await gedip.save();

      response.ok(gedip);
    } catch(error) {
      throw new exception("Problema ao atualizar a Gedip", 400);
    }
  }

  /**
   *
   * Função não implementada
   *
   * @param {''}
   */
  async hide({ request, response }) {

  }

  /**
   * Soft Delete do registro Gedip. Muda flag Ativo para 0
   *
   * @param {params} object
   */
  async destroy({ params }) {
    return InativarGedip({ params: params });
  }

  /**
   * ? Calcula uma data futura a partir de informações como prefixo do funci, data inicial e
   * ? quantidades de dias úteis
   * @param {*} param0
   */
  async getDataLimite({ request, session, response }) {
    // usar Commons/DateUtils.js
    const dadosUsuario = session.get('currentUserAccount');

    const { dataInicial } = request.allParams();

    try {
      let dtInic = moment(dataInicial).startOf('day');
      // let dtInic = moment().startOf('day').add(1, 'days'); // teste para o Insomnia

      let dataLimite;
      const diasUteis = 6;
      let contDias = 0;

      while (contDias < diasUteis) {

        dtInic = dtInic.toISOString();

        const ferNac = await isFeriadoNacional(dtInic);
        const ferPref = await isFeriadoPrefixo(dtInic, dadosUsuario.prefixo);
        const fimSem = await isFinalSemana(dtInic);

        if (!ferNac || !ferPref || !fimSem) {
          contDias += 1;
        }

        dtInic = moment(dtInic).startOf('day').add(1, 'days');

      };

      response.send(dtInic.toISOString());
    } catch (error) {
      throw new exception("Falha ao calcular a data limite", 400);
    }

  }

  /**
  * Lista todos os registros do Gedip.
  * GET gedips
  *
  * @param {object} ctx
  */

  async gedipsConcluidos({ session, request, response }) {

    const dadosUsuario = session.get('currentUserAccount')

    try {

      let all, params;

      if (request.isPrefsPessoas || request.temPermissaoAtualizar) {
        if (dadosUsuario.prefixo === PrefDipes || dadosUsuario.prefixo === PrefGepesPR || dadosUsuario.prefixo === PrefSuperADM) {
          params = { isGestor: false };
        } else if (request.temPermissao) {
          params = { isGestor: false, tipo: 3 };
        }

        all = await GedipShow({ params });
      }

      return response.ok(all);
    } catch (err) {
      throw new exception("Falha ao acessar a lista de Gedips", 400);
    }

  }

  // Método para testes
  async teste({ request, response }) {

    try {
      let mail = new MailLog();

      mail.id_gedip = 1;
      mail.campo_de = "17641473569183475619375619875469128475619487569487562389475629384756298745629";
      mail.campo_para = "asidjfoirugfor987nklnurigfvhwiurghiugrvhlklsbkurvygskluhysvirtueysvt";

      await mail.save();

      if (!mail) {
        response.notFound('Teste error!');
      }

      response.ok(mail);
    } catch (err) {
      throw new exception("Falha ao enviar email de teste", 400);
    }

  }

  async getBulkGedip({ request, response, session }) {

    try {
      const { acao } = request.allParams();

      const gedips = await GetBulkGedips(acao);

      return response.ok(gedips)

    } catch (err) {
      throw new exception("Falha ao acessar a lista de Gedips", 400);
    }
  }

  async setBulkGedip({ request, response, session }) {
    try {
      let { gedips, acao } = request.allParams();

      gedips = gedips.map(a => parseInt(a));

      let result = await SetBulkGedips(gedips, acao);

      result = Array.from(new Set(result.map(elem => elem)));

      return { gedips: result, acao };
    } catch (error) {
      throw new exception("Falha ao executar a ação nos Gedips informados", 400);
    }
  }

  async migraGedips({ request, response }) {
    try {
      const CTRLPATH = 'uploads/CtrlDisciplinar';

      let gedips = await Gedip.ids();
      // let gedips = [1];

      let migra = gedips.map(async (id_gedip) => {

        let gedip = await Gedip.find(id_gedip);

        const filePath = `${gedip.nm_gedip}_${gedip.funcionario_gedip}`;
        const newFilePath = md5(`${gedip.id_gedip}_${gedip.nm_gedip}_${gedip.funcionario_gedip}`);
        let exists = false;

        for (const ext of ['pdf', 'PDF', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG']) {
          exists = await Drive.exists(Helpers.appRoot(`${CTRLPATH}/${filePath}.${ext}`));

          if (exists) {
            let moved = false;

            await Drive.copy(Helpers.appRoot(`${CTRLPATH}/${filePath}.${ext}`), Helpers.appRoot(`${CTRLPATH}/${filePath}_${moment().valueOf()}.${ext}`));

            if (await Drive.exists(Helpers.appRoot(`${CTRLPATH}/${newFilePath}.${ext}`))) {
              await Drive.move(Helpers.appRoot(`${CTRLPATH}/${newFilePath}.${ext}`), Helpers.appRoot(`${CTRLPATH}/${newFilePath}_${moment().valueOf()}.${ext}`));
            }

            moved = await Drive.move(Helpers.appRoot(`${CTRLPATH}/${filePath}.${ext}`), Helpers.appRoot(`${CTRLPATH}/${newFilePath}.${ext}`));

            if (moved) {
              gedip.documento = `${newFilePath}.${ext}`;
              await gedip.save();
              return gedip.id_gedip;
            }
          }
        }

        return id_gedip;
      })

      migra = await Promise.all(migra);

      response.ok(migra);
    } catch (error) {
      throw new exception('Falha ao migrar os arquivos!');
    }
  }

  async criaArquivos({ request, response }) {
    try {
      const CTRLPATH = 'uploads/CtrlDisciplinar';

      let gedips = await Gedip.ids();
      // let gedips = [1];

      let migra = gedips.map(async (id_gedip) => {

        let gedip = await Gedip.find(id_gedip);

        const filePath = `${gedip.nm_gedip}_${gedip.funcionario_gedip}`;
        let exists = false;

        const ext = 'pdf';
        exists = await Drive.exists(Helpers.appRoot(`${CTRLPATH}/${filePath}.${ext}`));

        if (!exists) {
          await Drive.put(Helpers.appRoot(`${CTRLPATH}/${filePath}.${ext}`), Buffer.from(`${filePath}`));
        }

        return gedip.id_gedip;
      })

      migra = await Promise.all(migra);

      response.ok(migra);

    } catch (error) {
      throw new exception('Falha ao salvar os arquivos!', 400);
    }
  }

  async getPrimGest({request, response}) {
    try {
      const {prefixo} = request.allParams();

      const funci = await getPrimGestor(prefixo);

      response.ok(funci);
    } catch( error ) {
      throw new exception('Falha ao recuperar os dados do primeiro gestor!', 400);
    }
  }

  async getAlineas({response}) {

    const opcoes = [
      {
        alinea: 'a',
        texto: 'Ato de improbidade'
      },
      {
        alinea: 'b',
        texto: 'Incontinência de conduta ou mau procedimento'
      },
      {
        alinea: 'c',
        texto: 'Negociação habitual por conta própria ou alheia sem permissão do empregador, e quando constituir ato de concorrência à empresa para a qual trabalha o empregado, ou for prejudicial ao serviço'
      },
      {
        alinea: 'd',
        texto: 'Condenação criminal do empregado, passada em julgado, caso não tenha havido suspensão da execução da pena'
      },
      {
        alinea: 'e',
        texto: 'Desídia no desempenho das respectivas funções'
      },
      {
        alinea: 'f',
        texto: 'Embriaguez habitual ou em serviço'
      },
      {
        alinea: 'g',
        texto: 'Violação de segredo da empresa'
      },
      {
        alinea: 'h',
        texto: 'Ato de indisciplina ou de insubordinação'
      },
      {
        alinea: 'i',
        texto: 'Abandono de emprego'
      },
      {
        alinea: 'j',
        texto: 'Ato lesivo da honra ou da boa fama praticado no serviço contra qualquer pessoa, ou ofensas físicas, nas mesmas condições, salvo em caso de legítima defesa, própria ou de outrem'
      },
      {
        alinea: 'k',
        texto: 'Ato lesivo da honra ou da boa fama ou ofensas físicas praticadas contra o empregador e superiores hierárquicos, salvo em caso de legítima defesa, própria ou de outrem'
      },
      {
        alinea: 'l',
        texto: 'Prática constante de jogos de azar'
      },
      {
        alinea: 'm',
        texto: 'Perda da habilitação ou dos requisitos estabelecidos em lei para o exercício da profissão, em decorrência de conduta dolosa do empregado. (Incluído pela Lei nº 13.467, de 2017)'
      }
    ];

    response.ok(opcoes);
  }

}

module.exports = GedipController
