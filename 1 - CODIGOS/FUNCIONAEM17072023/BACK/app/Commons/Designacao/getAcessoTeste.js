const _ = require("lodash");

const exception = use("App/Exceptions/Handler");

const Designacao = use("App/Models/Mysql/Designacao");

const getTipoAcesso = use("App/Commons/Designacao/getTipoAcesso");
const Constants = use("App/Commons/Designacao/Constants");
const isPrefixoAcionado = use("App/Commons/Designacao/isPrefixoAcionado");

const FERRAMENTA = "Designação Interina";
const ACESSO_TESTE = "ACESSO_TESTE";
const ACESSO_ORIGEM = "ACESSO_ORIGEM";

async function getAcessoTeste(usuario) {

  // Acesso durante período de testes - remover na aplicação final
  try {

    const permissoes = [];

    if ([
      Constants.PREFIXO_SUPERADM,
      Constants.PREFIXO_DIVAR,
      Constants.PREFIXO_DIRAV,
      Constants.PREFIXO_DIPES,
      Constants.PREFIXO_GEPES,
    ].includes(usuario.prefixo)) {
      permissoes.push(ACESSO_TESTE);
    }
    if (_.isEmpty(permissoes) && usuario.pref_super !== 0) {
      const acessoTeste = Designacao.query()
        .table("prefixos_teste")
        .where("super", usuario.pref_super)
        .whereIn("gerev", [usuario.pref_regional, 9999]);

      const acesso = await acessoTeste.first();

      acesso && permissoes.push(ACESSO_TESTE);
    }
    if (!permissoes.includes('ACESSO_TESTE')) {
      const prefixoAcionado = await isPrefixoAcionado(usuario.prefixo);

      prefixoAcionado && permissoes.push(ACESSO_TESTE, ACESSO_ORIGEM);
    }

    const acessoRegistro = await getTipoAcesso(usuario);

    if (!_.isEmpty(acessoRegistro)) permissoes.push(...acessoRegistro);

    if (!permissoes.includes('ACESSO_TESTE')) permissoes.splice(0, permissoes.length);

    return permissoes.length ? { ferramenta: FERRAMENTA, permissoes: permissoes } : null;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getAcessoTeste;