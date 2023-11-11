/**
 * Neste código, quando o campo `parametroExistente.ativo` é igual a "1", a função `construirObservacao` é chamada para 
 * atualizar a observação do parâmetro existente. Isso adicionará a informação de matrícula do usuário, data atual, ação 
 * (que é "Reinclusão") e a observação original do parâmetro. A observação atualizada é então salva junto com o parâmetro 
 * existente.
 * 
 * Para utilizar o método `async construirObservacao(parametro, session)` dentro do método `async gravarParametro(novoParametro, 
 * parametro)`, você pode fazer algumas alterações no código. 
 * 
 * Vamos assumir que você está usando o Node.js e que o módulo Moment.js está instalado para manipulação de datas. 
 * 
 * Aqui está o código atualizado:
*/


const moment = require("moment"); // Certifique-se de ter o Moment.js instalado

// ...

async gravarParametro(novoParametro, parametro) {
  const parametroExistente = await ParamAlcadas.query()
    .where("prefixoDestino", novoParametro.prefixoDestino)
    .where("comissaoDestino", novoParametro.comissaoDestino)
    .first();

  if (parametroExistente) {
    if (parametroExistente.ativo === "1") {
      throw new Error("Parâmetros já existem e estão ativos.");
    } else {
      parametroExistente.ativo = '1';

      // Utilize o método construirObservacao para atualizar a observação
      parametroExistente.observacao = await this.construirObservacao(
        parametroExistente,
        session
      );

      await parametroExistente.save();
      return parametroExistente;
    }
  } else {
    await novoParametro.save();
    return novoParametro;
  }
}

async construirObservacao(parametro, session) {
  const usuario = session.get("currentUserAccount");
  const acao = "Reinclusão";
  const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
  return `Matrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - ${parametro.observacao}`;
}
