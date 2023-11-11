const exception = use('App/Exceptions/Handler');
const hasPermission = use('App/Commons/HasPermission');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');
const Situacao = use('App/Models/Mysql/Designacao/Situacao');
const setDocumento = use('./setDocumento');
const getSolicitacao = use('./getSolicitacao');
const sendMailDesig = use('./sendMailDesig');

const _PERFIL = (profile, prefixo, gerev) => {
  const perf = {
    17: {
      prefixo: prefixo,
      novaSituacao: 7
    },
    1: {
      prefixo: gerev,
      novaSituacao: 7
    },
    20: {
      prefixo: "9009",
      novaSituacao: 2
    },
    21: {
      prefixo: "8559",
      novaSituacao: 3
    },
    22: {
      prefixo: "8592",
      novaSituacao: 4
    },
    23: {
      prefixo: "8929",
      novaSituacao: 8
    },
    24: {
      prefixo: "9270",
      novaSituacao: 9
    },
    25: {
      prefixo: "9220",
      novaSituacao: 10
    }
  }

  return perf[profile];
}

async function setEncaminhar(parecer, arquivos, user) {

  try {
    const solicitacao = await Solicitacao
      .query()
      .with('prefixo_dest')
      .where('id', parecer.id_solicitacao)
      .first();

    if (solicitacao.responsavel !== user.chave) {
      const temPermissaoRegistro = await hasPermission({
        nomeFerramenta: 'Designação Interina',
        dadosUsuario: user,
        permissoesRequeridas: ['REGISTRO']
      });
    }

    const profile = _PERFIL(parecer.id_historico, solicitacao.pref_dest, solicitacao.prefixo_dest.gerev);

    solicitacao.encaminhado_de = solicitacao.encaminhado_para;

    solicitacao.encaminhado_para = profile.prefixo;

    solicitacao.id_status = 1;

    solicitacao.id_situacao = profile.novaSituacao;

    solicitacao.responsavel = null;

    await solicitacao.save();

    const document = await setDocumento({ id_solicitacao: parecer.id_solicitacao, id_historico: parecer.id_historico, texto: parecer.texto || ' ', id_negativa: null, tipo: null }, arquivos, user);

    await sendMailDesig(2, document);

    return document;

  } catch (err) {
    throw new exception(err, 400);
  }

}

module.exports = setEncaminhar;