const exception = use("App/Exceptions/Handler");
const Database = use("Database");
const Funci = use('App/Models/Mysql/Arh/Funci');
const Prefixo = use('App/Models/Mysql/Prefixo');
const Constants = use("App/Commons/HorasExtras/Constants");
const getDadosAdesaoHE = use("App/Commons/HorasExtras/getDadosAdesaoHE");
const podeRealizarDespacho = use("App/Commons/HorasExtras/podeRealizarDespacho");
const isSuper = use("App/Commons/HorasExtras/isSuper");
const moment = require("moment");
const Compensacao = use("App/Models/Mysql/HorasExtras/Compensacao");
const Solicitacoes = use("App/Models/Mysql/HorasExtras/Solicitacoes");
const getDotacaoDependencia = use("App/Commons/Designacao/getDotacaoDependencia");

async function addSolicitacao(dados) {

  let new_id;
  try {

    const trx = await Database.connection("horasExtras").beginTransaction();

    new_id = await newId();

    let funcionario = await Funci.query()
      .where('matricula', dados.funci)
      .first();

    funcionario = funcionario.toJSON();

    let prefixo = await Prefixo.query()
      .with('dadosDiretoria')
      .with('dadosSuper')
      .with('dadosGerev')
      .where('prefixo', dados.prefixo)
      .first();

    prefixo = prefixo.toJSON();

    const {dadosAdesao, ddComissao} = await getDadosAdesaoHE(dados.funci);

    let solicitacao = new Solicitacoes();

    // const dadosSolicitacao = {
    solicitacao.protocolo = new_id;
    solicitacao.data_evento = moment().format('YYYY-MM-DD HH:mm:ss');
    solicitacao.pref_dep = dados.prefixo;
    solicitacao.nome_dep = prefixo.nome;
    solicitacao.pref_sup = prefixo.dadosSuper.prefixo;
    solicitacao.nome_sup = prefixo.dadosSuper.nome;
    solicitacao.regional = prefixo.dadosGerev.nome;
    solicitacao.pref_regional = prefixo.dadosGerev.prefixo;
    solicitacao.mat_solic = dados.user.chave;
    solicitacao.nome_solic = dados.user.nome_guerra;
    solicitacao.comissao_solic = dados.user.nome_funcao;
    solicitacao.mat_dest = funcionario.matricula;
    solicitacao.nome_dest = funcionario.nome;
    solicitacao.comissao_dest = `${ddComissao.cod_funcao} - ${ddComissao.nome_funcao}`.substring(0,50);
    solicitacao.qtd_horas_sol = dados.qtdeHoras;
    solicitacao.adesao_banco_horas = dadosAdesao.aderiu;
    solicitacao.saldo_banco_horas = dadosAdesao.saldoTotal;
    solicitacao.justificativa_sol = dados.justifSolicitHE;
    solicitacao.justificativa_n_bh = dados.justifNaoAdesaoBH || null;
    solicitacao.status = Constants.AGUARDANDO_SUPER_ESTADUAL;
    // };

    const superNeg = await isSuper('regional', dados.user) || await isSuper('estadual', dados.user);

    if (superNeg && await podeRealizarDespacho(dados.user, dados.user.pref_super, '1')) {

      solicitacao.parecer_1_desp = "DE ACORDO";
      solicitacao.status = Constants.AGUARDANDO_SUPER_ADM;
      solicitacao.data_1_desp = moment().format(Constants.DATABASE_DATETIME_INPUT);
      solicitacao.mat_aut_1_desp = dados.user.chave;
      solicitacao.nome_aut_1_desp = dados.user.nome_usuario.toUpperCase();
      solicitacao.comissao_aut_1_desp = dados.user.cod_funcao;
      solicitacao.justif_1_desp	= 'SOLICITAÇÃO LIBERADA AUTOMATICAMENTE. FUNCIONÁRIO AUTORIZADO DA PRÓPRIA SUPER';
      solicitacao.qtd_hrs_aut_1_desp = dados.qtdeHoras;

      solicitacao.foto_resumo_geral = JSON.stringify(dados.foto_resumo_geral);

      const dotacao = await getDotacaoDependencia(dados.prefixo, false, false);
      solicitacao.foto_dotacao = JSON.stringify(dotacao);
    }

    await solicitacao.save(trx);

    !dados.compensacaoHoras && (dados.compensacaoHoras = []);

    await Compensacao
      .create({
        id_solicitacao: new_id,
        compensacao: JSON.stringify(dados.compensacaoHoras)
      }, trx);

    await trx.commit();

    return new_id;

  } catch (err) {
    await trx.rollback();

    throw new exception(err, 400);
  }
}

async function newId() {
  try {
    const compare = 'HE' + moment().year();

    const ultimoId = await Solicitacoes.query()
      .max('protocolo as id')
      .where('protocolo', 'like', `${compare}%`)
      .first();

    if (!ultimoId.id) {
      return compare + "00001";
    }

    let valor = ultimoId.id.substr(6);
    valor++;
    valor = String(valor).padStart(5, '0');

    return compare + valor;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = addSolicitacao;