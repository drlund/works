const getSolicitacao = use("./getSolicitacao");
const getPermissao = use("./getPermissao");

const exception = use('App/Exceptions/Handler');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');
const Analise = use('App/Models/Mysql/Designacao/Analise');
const Situacao = use('App/Models/Mysql/Designacao/Situacao');
const Status = use('App/Models/Mysql/Designacao/Status');
const setDocumento = use('./setDocumento');
const sendMailDesig = use('./sendMailDesig');
const { getDotacaoDependencia } = use('App/Commons/Arh');

async function setConcluir(parecer, arquivos, user) {

  try {

    let solicitacao = await Solicitacao.find(parecer.id_solicitacao);

    const analise = await Analise.findBy('id_solicitacao', parecer.id_solicitacao);

    if (parecer.id_historico === '26') {
      solicitacao.id_situacao = 5;
      solicitacao.id_status = 2
    }

    if (parecer.id_historico === '27') {
      solicitacao.id_situacao = 5;
      solicitacao.id_status = 3;
    }

    if (parecer.id_historico === '28') {
      solicitacao.id_situacao = 6;
      solicitacao.id_status = 3;
    }

    if (parecer.id_historico === '30') {
      solicitacao.id_status = 4;
      parecer.texto = ' ';
      const origem = await getDotacaoDependencia(solicitacao.pref_orig, false, false);
      const destino = await getDotacaoDependencia(solicitacao.pref_dest, false, false);
      analise.dotacoes = JSON.stringify({ origem: { ...origem }, destino: { ...destino } });

      await analise.save();
    }

    await solicitacao.save();

    const document = await setDocumento({ id_solicitacao: parecer.id_solicitacao, id_historico: parecer.id_historico, texto: parecer.texto || ' ', id_negativa: null, tipo: null }, arquivos, user);

    if (!['28','30'].includes(parecer.id_historico)) {
      await sendMailDesig(3, document);
    }
    if (parecer.id_historico === '28') {
      await sendMailDesig(4, document);
    }

    return document;

  } catch (err) {
    throw new exception(err, 400);
  }

}

module.exports = setConcluir;