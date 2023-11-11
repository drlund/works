const exception = use("App/Exceptions/Handler");
const Solicitacao = use("App/Models/Mysql/Designacao/Solicitacao");
const { getDadosComissaoCompleto } = use("App/Commons/Arh");
const getDepESubord = use("App/Commons/Designacao/getDepESubord");
const _ = require("lodash");
const getPerfilFunci = use("App/Commons/Designacao/getPerfilFunci");
const getListaSolicitacoes = use("App/Commons/Designacao/getListaSolicitacoes");
const getDadosConsulta = use("App/Commons/Designacao/getDadosConsulta");

async function getConsultas(dados, usuario) {
  try {

    // let {funciAdm, user, prefixos, nivelGer} = await getDadosConsulta(usuario);
    let {user, funciLogado, comiteAdm, dadosComissaoFunciLogado, funciIsAdmin, subordinadas} = await getPerfilFunci(usuario);

    let consulta = await getListaSolicitacoes(
      null,
      { ...dados },
      user,
      { tipo: "consultas" },
      subordinadas,
      {funciLogado, comiteAdm, dadosComissaoFunciLogado, funciIsAdmin}
    );

    return consulta;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getConsultas;
