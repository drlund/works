const exception = use('App/Exceptions/Handler');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');
const getDepESubord = use('App/Commons/Designacao/getDepESubord');

async function getProtocolos(protocolo, user) {
  try {
    let prefixos = await getDepESubord(user);

    let solicitacao = await Solicitacao.query()
      .select("id", "protocolo")
      .where("protocolo", 'like', `%${protocolo}%`)
      .where((builder) => {
        builder.where((bld1) => {
          bld1.whereIn('pref_orig', [user.prefixo, ...prefixos])
              .orWhereIn('pref_dest', [user.prefixo, ...prefixos])
          })
      })
      .fetch();

    let protocolos = solicitacao.toJSON();

    return protocolos;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getProtocolos;