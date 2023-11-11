/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const LogsEnvolvidosModel = use("App/Models/Postgres/MtnLogsEnvolvidos");
const typeDefs = require("../../Types/TypeUsuarioLogado");

/**
 *
 * @param {import('../../Types/TypeUsuarioLogado').UsuarioLogado} dadosUsuario
 * @param {*} trx
 */

async function registrarLogEnvolvidos(dadosUsuario, acao, idEnvolvido, trx) {
  const newLog = new LogsEnvolvidosModel();

  newLog.matriculaFunci = dadosUsuario.chave;
  newLog.nomeFunci = dadosUsuario.nome_usuario;
  newLog.prefixoDep = dadosUsuario.prefixo;
  newLog.nomeDep = dadosUsuario.dependencia;
  newLog.codFuncaoFunci = dadosUsuario.cod_funcao;
  newLog.nomeFuncaoFunci = dadosUsuario.nome_funcao;
  newLog.acao = acao;
  newLog.id_envolvido = idEnvolvido;

  await newLog.save(trx);
}

module.exports = registrarLogEnvolvidos;
