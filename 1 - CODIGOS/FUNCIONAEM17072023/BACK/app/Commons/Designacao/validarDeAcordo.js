/**
 * Método para validar as possíveis situações da solicitação
 *  EM ANÁLISE:
 *    SUPERADM
 *    DIPES/GEPES
 *    OUTRA UNIDADE
 *  CONCLUIDO
 *  CANCELADO
 *  DE ACORDO PENDENTE
 */

const _ = require('lodash');

const exception = use('App/Exceptions/Handler');

const { TIPOS } = use('App/Commons/Designacao/Constants');
const { getDadosComissaoCompleto } = use("App/Commons/Arh");

const validarSituacao = use("./validarSituacao");
const getAnalise = use("./getAnalise");
const getSolicitacao = use("./getSolicitacao");


async function validarDeAcordo(id, user) {
  try {

    const analise = await getAnalise(id);
    const solicitacao = await getSolicitacao(id);

    let completo = false;

    const gg_dest = analise.parecer_destino;
    const gg_orig = analise.parecer_origem;

    completo = gg_dest && gg_orig;

    const limitrofes = solicitacao.limitrofes;

    if (solicitacao.tipo === TIPOS.DESIGNACAO) {
      const nivelGer = await getDadosComissaoCompleto(solicitacao.funcao_dest);

      if ((solicitacao.tipo === 1 && (nivelGer.ref_org === '1GUN' || nivelGer.ref_org === '2GUT')) || limitrofes) {
        let super_dest = analise.parecer_super_destino;
        completo = completo && super_dest;
      }

      if (solicitacao.tipo === 1 && nivelGer.ref_org === '1GUT') {
        let diretoria = analise.parecer_diretoria;
        completo = completo && diretoria;
      }
    }

    if (completo) {
      await validarSituacao(id, user, 2, null)
    }

    return solicitacao.id

  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = validarDeAcordo;