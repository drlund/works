const exception = use("App/Exceptions/Handler");
const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");
const Database = use("Database");
const Analise = use("App/Models/Mysql/Designacao/Analise");
const { isAdmin, getDadosComissaoCompleto, isPrefixoUN } = use(
  "App/Commons/Arh"
);
const _ = require("lodash");
// const moment = use("App/Commons/MomentZone");
const moment = require("moment");
const rollbackInclusao = use("App/Commons/Designacao/rollbackInclusao");
const getPrefixoMadrinha = use("App/Commons/Designacao/getPrefixoMadrinha");
const setDocumento = use("App/Commons/Designacao/setDocumento");
const setCadeia = use("App/Commons/Designacao/setCadeia");
const setDeAcordo = use("App/Commons/Designacao/setDeAcordo");
const sendMailDesig = use("App/Commons/Designacao/sendMailDesig");

async function postSolicitacao(dados, user) {
  const trx = await Database.connection("designacao").beginTransaction();

  let err,
  isUnidNeg,
  agMadrinha,
  administrador = false;

  [err, isUnidNeg] = await promiseHandler(isPrefixoUN(user.prefixo));

  if (dados.destino.prefixo === user.prefixo) {
    [err, administrador] = await promiseHandler(isAdmin(user.chave));
  } else {
    [err, agMadrinha] = await promiseHandler(getPrefixoMadrinha(dados.destino.prefixo));
    if (isUnidNeg) {
      if (agMadrinha.prefixo === user.prefixo) {
        [err, administrador] = await promiseHandler(isAdmin(user.chave));
      }
    }
  }


  const solicitacao = new Solicitacao();
  const analise = new Analise();

  solicitacao.tipo = dados.tipo;
  solicitacao.pref_orig = dados.origem.prefixo;
  solicitacao.pref_dest = dados.destino.prefixo;
  solicitacao.funcao_orig = dados.origem.funcao_lotacao;
  solicitacao.funcao_dest = dados.destino.cod_comissao;
  solicitacao.matr_orig = dados.origem.matricula;
  dados.destino.funci && (solicitacao.matr_dest = dados.destino.funci);

  dados.tipo === 1 && (solicitacao.id_optbasica = dados.destino.optbasica.id);


  solicitacao.id_situacao = 1;
  solicitacao.id_status = 1;
  solicitacao.matr_solicit = user.chave;
  solicitacao.dt_ini = moment(dados.dt_ini)
    .hour(5)
    .minute(0)
    .second(0)
    .format("YYYY-MM-DD HH:mm:ss");
  solicitacao.dt_fim = moment(dados.dt_fim)
    .hour(5)
    .minute(0)
    .second(0)
    .format("YYYY-MM-DD HH:mm:ss");
  solicitacao.dt_solicitacao = moment()
    .hour(5)
    .minute(0)
    .second(0)
    .format("YYYY-MM-DD HH:mm:ss");
  solicitacao.dias_totais = dados.dias_totais;
  solicitacao.dias_uteis = dados.dias_uteis;

  // se limitrofes, registre 1
  solicitacao.limitrofes = dados.limitrofes.limitrofes ? 0: 1;

  // Se a movimentação é para Superintendente Estadual ou Superadm
  solicitacao.super = dados.nivelGer && dados.nivelGer.ref_org === "1GUT" ? 1 : 0;

  // se a movimentação é para GG ou para Superintendente Regional,
  // a informação gg_ou_super informa a necessidade de autorização de superior hierárquico
  solicitacao.gg_ou_super = dados.nivelGer && ["1GUN", "2GUT"].includes(dados.nivelGer.ref_org) ? 1 : 0;
  analise.gg_ou_super = solicitacao.gg_ou_super;

  // Se a solicitação cumpriu todos os requisitos, exceto limitrofes
  dados.negativasArr = _.isEmpty(dados.negativas) ? dados.negativas.filter((elem) => elem !== "limitrofes") : [];

  solicitacao.requisitos = _.isEmpty(dados.negativasArr) ? 1 : 0;

  const motivosDeAcordoSuperDestino = [
    (dados.tipo === 1 && dados.nivelGer &&  dados.nivelGer.ref_org === "3GUN" && !dados.limitrofes.limitrofes),
    (dados.tipo === 1 && dados.nivelGer &&  (dados.nivelGer.ref_org === "1GUN" || dados.nivelGer.ref_org === "2GUT")),
    (dados.tipo === 2 && !dados.limitrofes.limitrofes)
  ];

  analise.deacordo_super_destino = motivosDeAcordoSuperDestino.includes(true) ? 1 : 0;

  dados.requisitos = solicitacao.requisitos;

  solicitacao.ativo = 1;

  [err] = await promiseHandler(solicitacao.save(trx));

  solicitacao.protocolo =
  moment(solicitacao.dt_solicitacao).year() +
  "-" +
  String(solicitacao.id).padStart(8, "0");

  [err] = await promiseHandler(solicitacao.save(trx));

  // ? gravar analise e retornar para o *gravar*

  analise.id_solicitacao = solicitacao.id;
  analise.analise = JSON.stringify(dados.analise);
  analise.negativas = JSON.stringify(dados.negativas);
  analise.ausencias = JSON.stringify({
    ausencias: dados.destino.ausencias,
    total_ausencia: dados.destino.total_ausencias,
  });

  [err] = await promiseHandler(analise.save(trx));

  [err] = await promiseHandler(trx.commit());

  try {
    // ? gravar historico de nova solicitação
    let docInicio = await setDocumento(
      { id_solicitacao: solicitacao.id, id_historico: 1 },
      null,
      user
      );

      await setDeAcordo(solicitacao.id, user);

      dados.protocolo && await setCadeia(dados.protocolo, solicitacao.protocolo, user);

      await sendMailDesig(1, docInicio);

      return { id_solicitacao: solicitacao.id, protocolo: solicitacao.protocolo };
    } catch (err) {
        await rollbackInclusao(solicitacao.id);
        throw new exception(err);
    }

}

function promiseHandler(fn) {
  return fn.then(data => [null, data]).catch(err => [err]);
}

module.exports = postSolicitacao;
