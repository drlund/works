const exception = use('App/Exceptions/Handler');
const Solicitacao = use('App/Models/Mysql/Designacao/Solicitacao');
const Analise = use('App/Models/Mysql/Designacao/Analise');
const setDocumento = require('./setDocumento');
const _ = require('lodash');

async function setCadeia(protocoloAnterior, protocoloAtual, user) {

  try {

    const solicitAnterior = await Solicitacao.findBy('protocolo', protocoloAnterior);
    const solicitAtual = await Solicitacao.findBy('protocolo', protocoloAtual);

    const analiseAnterior = await Analise.findBy('id_solicitacao', solicitAnterior.id);
    const analiseAtual = await Analise.findBy('id_solicitacao', solicitAtual.id);

    let cadeia = []

    analiseAnterior.cadeia && (cadeia = JSON.parse(analiseAnterior.cadeia));

    if (_.isEmpty(cadeia)) {
      const cadeia = [solicitAnterior.protocolo, solicitAtual.protocolo];
      analiseAnterior.cadeia = JSON.stringify(cadeia);
      analiseAtual.cadeia = JSON.stringify(cadeia);

      await analiseAnterior.save();
      await analiseAtual.save();

      const texto = `Nova cadeia formada: ${JSON.stringify(cadeia)}`;

      await setDocumento({ id_solicitacao: analiseAnterior.id_solicitacao, id_historico: 31, texto, id_negativa: null, tipo: null }, null, user);
      await setDocumento({ id_solicitacao: analiseAtual.id_solicitacao, id_historico: 31, texto, id_negativa: null, tipo: null }, null, user);
    } else {
      cadeia.push(solicitAtual.protocolo);

      let cadeiaProt = [];

      for (const x in cadeia) {
        const analise = await Analise.findBy('id_solicitacao', x)
        analise.cadeia = JSON.stringify(cadeia);
        await analise.save();

        cadeiaProt.push(analise.id_solicitacao)
      }

      for (const x in cadeiaProt) {
        const texto = `Cadeia atualizada: ${JSON.stringify(cadeia)}`;

        await setDocumento({ id_solicitacao: cadeiaProt[x], id_historico: 31, texto, id_negativa: null, tipo: null }, null, user);
      }
    }

    return true;

  } catch (err) {
    throw new exception(err, 400);
  }

}

module.exports = setCadeia;
