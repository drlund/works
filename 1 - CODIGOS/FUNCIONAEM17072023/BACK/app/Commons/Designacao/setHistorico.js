const exception = use('App/Exceptions/Handler');
const Historico = use('App/Models/Mysql/Designacao/Historico');

async function setHistorico(dados) {
  try {
    const novoHistorico = new Historico();

    novoHistorico.matricula = dados.user.chave;
    novoHistorico.nome = dados.user.nome_usuario.toUpperCase();
    novoHistorico.funcao = dados.user.cod_funcao;
    novoHistorico.nome_funcao = dados.user.nome_funcao;
    novoHistorico.prefixo = dados.user.prefixo;
    novoHistorico.nome_prefixo = dados.user.dependencia;
    novoHistorico.id_solicitacao = dados.parecer.id_solicitacao;
    novoHistorico.id_historico = dados.parecer.id_historico;

    dados.parecer.tipo && (novoHistorico.tipo = dados.parecer.tipo);
    dados.parecer.id_documento && (novoHistorico.id_documento = dados.parecer.id_documento);

    await novoHistorico.save();

    return novoHistorico.id;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = setHistorico;