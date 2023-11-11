const exception = use("App/Exceptions/Handler");
const moment = require("moment");
const _ = require("lodash");
const { isPrefixoUT, isPrefixoUN } = use("App/Commons/Arh");
const Superadm = use("App/Models/Mysql/Superadm");
const Solicitacoes = use("App/Models/Mysql/HorasExtras/Solicitacoes");
const Status = use("App/Models/Mysql/HorasExtras/Status");
const Constants = use("App/Commons/HorasExtras/Constants");
const inicioFimMes = use("App/Commons/HorasExtras/funcoesHora");
const isPrefixoSuperAdm = use("App/Commons/HorasExtras/isPrefixoSuperAdm");

async function getDadosSolicitacao(status = null, periodo, regional = null, user) {
  try {

    const tipoFunci = [
      { tipo: 'UN', valor: await isPrefixoUN(user.prefixo) },
      { tipo: 'UT', valor: await isPrefixoUT(user.prefixo) }
    ];

    const [UNeg] = tipoFunci.filter(el => el.tipo === 'UN').map(el => el.valor);
    const SAdm = await isPrefixoSuperAdm(user.prefixo);
    const [UTat] = SAdm || UNeg ? [false] : tipoFunci.filter(el => el.tipo === 'UT').map(el => el.valor);

    const [tipoUnidade] = tipoFunci.filter(elem => elem.valor);

    if (!UNeg && _.isNil(regional)) {
      return [];
    }

    !_.isNil(status) && (status = parseInt(status));
    let estados = await Status.all();

    estados = estados.toJSON();

    estados = estados.map(estado => {
      const nomeRed = estado.nome_status.split(' ');

      return ({
        key: estado.id_status,
        id: estado.id_status,
        idStatus: estado.id_status,
        nomeStatus: estado.nome_status,
        nomeRedStatus: nomeRed[nomeRed.length - 1].substring(0, 3)
      })
    })

    const { inicioMes, fimMes } = inicioFimMes(periodo);

    const data = Solicitacoes.query()
      .with('compensacao')
      .with("estado")
      .where('data_evento', '>=', inicioMes)
      .where('data_evento', '<=', fimMes);

    if (status && status !== Constants.TODOS) {
      data.where((builderQry) => {
        builderQry.where('status', status);
      })
    }

    if (UNeg) {
      data.where((builderQry) => {
        builderQry.where('pref_dep', user.prefixo);
      });
      !status && data.where((builderQry) => {
        builderQry.whereIn('status', [Constants.AUTORIZADO]);
      });
      !status && (status = Constants.AUTORIZADO);
    }

    if (UTat) {
      !SAdm && data.where((builderQry) => {
        builderQry.where('pref_sup', user.pref_super);
      })

      !status && data.where((builderQry) => {
        builderQry.where('status', Constants.AGUARDANDO_SUPER_ESTADUAL);
      });
      !status && (status = Constants.AGUARDANDO_SUPER_ESTADUAL);
    }

    if (SAdm) {
      !status && data.where((builderQry) => {
        builderQry.where('status', Constants.AGUARDANDO_SUPER_ADM);
      });
      !status && (status = Constants.AGUARDANDO_SUPER_ADM);
    }

    if (regional && regional !== '0000') {
      data.where('pref_regional', regional);
    }

    const dados = await data.fetch();

    const results = dados.toJSON();

    // Consultando dados por prefixo
    let returnableData = results.map(solic => ({ ...solic, prefixo: solic.pref_dep, funcionario: solic.mat_dest, horasSol: solic.qtd_horas_sol || 0, horasAut: solic.qtd_horas_aut || 0 }));

    let somaHorasPrefixo = obterSomaHoras(returnableData, 'prefixo');
    let somaHorasFunci = obterSomaHoras(returnableData, 'funcionario');

    // metodo para inserir os dados do prefixoResult e do funciResult no returnableData
    returnableData = results.map(linha => {
      const [horasPref] = somaHorasPrefixo.filter(elem => elem.indice === linha.pref_dep);
      const [horasFunci] = somaHorasFunci.filter(elem => elem.indice === linha.mat_dest);
      const [statusLinha] = estados.filter(elem => elem.idStatus === linha.status);

      linha.compensacao = JSON.parse(linha.compensacao.compensacao);

      let dtAtualiz = moment(linha.data_evento).format("DD/MM/YYYY HH:mm");
      let mtvAtualiz = "Data da Solicitação";

      if (moment(linha.data_1_desp).valueOf()) {
        dtAtualiz = moment(linha.data_1_desp).format("DD/MM/YYYY HH:mm");
        mtvAtualiz = "1o. Despacho";
      }

      if (moment(linha.data_2_desp).valueOf()) {
        dtAtualiz = moment(linha.data_2_desp).format("DD/MM/YYYY HH:mm");
        mtvAtualiz = "2o. Despacho";
      }

      let horasACompensar = 0;
      if (!_.isEmpty(linha.compensacao)) {
        horasACompensar = linha.compensacao.map(item => item.qtdeHoras).reduce((prev, acc) => prev + acc, 0);
      }

      const compensacao = linha.compensacao.map(item => {
        let dataCompensacao = JSON.parse(JSON.stringify(item.dataCompensacao));

        if (dataCompensacao.length > 1) {
          const ultimo = moment(dataCompensacao.pop()).format("DD/MM/YYYY");
          dataCompensacao = dataCompensacao.map(item => moment(item).format("DD"));
          dataCompensacao = dataCompensacao.join(', ').concat(` e ${ultimo}`);
        } else {
          dataCompensacao = dataCompensacao.map(item => moment(item).format("DD/MM/YYYY")).toString();
        }

        return {
          ...item,
          dataCompensacao
        }
      })

      return ({
        ...linha,
        compensacao: compensacao,
        horasACompensar: horasACompensar,
        adesaoBHInt: linha.adesao_banco_horas.toLocaleLowerCase() === "sim" ? 1 : 0,
        tipoUnidade: tipoUnidade.tipo,
        statusReduzido: statusLinha.nomeRedStatus,
        statusNome: statusLinha.nomeStatus,
        horasAutFunci: horasFunci.qtdeHorasAutorizadas,
        horasAutPref: horasPref.qtdeHorasAutorizadas,
        horasSolFunci: horasFunci.qtdeHorasSolicitadas,
        horasSolPref: horasPref.qtdeHorasSolicitadas,
        dtAtualiz: dtAtualiz,
        mtvAtualiz: mtvAtualiz,
      });
    })

    return returnableData;
  } catch (err) {
    throw new exception(err, 404);
  }
}

function obterSomaHoras(colecao, indice) {
  const valores = _.groupBy(colecao, indice);

  let result = [];
  _.forEach(valores, (value, key) => {
    const qtdeHorasSolicitadas = value
      .map(linha => linha.horasSol).reduce((acc, nxt) => acc + nxt, 0);

    const qtdeHorasAutorizadas = value
      .map(linha => linha.horasAut).reduce((acc, nxt) => acc + nxt, 0);

    result.push({ indice: key, qtdeHorasAutorizadas, qtdeHorasSolicitadas });
  })

  return result;
}

module.exports = getDadosSolicitacao;
