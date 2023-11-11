/**
 * Para utilizar o arquivo de constantes `Acao` em sua controller e definir o valor para a variável `acao`, você pode 
 * importar o arquivo `Acao` no início do seu arquivo de controller. Aqui está como você pode fazer isso:
 */

/**
 * Neste exemplo, importamos a constante `Acao` do arquivo de constantes e usamos `Acao.REINCLUSAO` e `Acao.INCLUSAO` 
 * em vez de strings diretamente para definir o valor da variável `acao`. Isso torna o código mais legível e menos 
 * propenso a erros, pois você está utilizando as constantes definidas em seu arquivo de constantes. Certifique-se de 
 * substituir `'./caminho-do-arquivo-de-constantes'` pelo caminho real do seu arquivo de constantes.
 */

import { Acao } from './caminho-do-arquivo-de-constantes'; // Substitua 'caminho-do-arquivo-de-constantes' pelo caminho real do seu arquivo de constantes

// ... (outros imports e código da controller) ...

async gravarSuspensao({ request, response, session }) {
  const dadosDasSuspensoes = request.allParams();
  const usuario = session.get('currentUserAccount');
  const parametroSuspensaoRepository = new ParametroSuspensaoRepository();
  const suspensaoExistente =
    await parametroSuspensaoRepository.buscarSuspensaoExistente(
      dadosDasSuspensoes,
    );

  const acao =
    suspensaoExistente && !suspensaoExistente.ativo
      ? Acao.REINCLUSAO // Usando a constante do arquivo Acao
      : Acao.INCLUSAO; // Usando a constante do arquivo Acao

  const dataAtual = moment().format('YYYY-MM-DD HH:mm:ss');
  dadosDasSuspensoes.observacao = `Matrícula: ${usuario.matricula} - Data: ${dataAtual} - Ação: ${acao} - ${dadosDasSuspensoes.observacao}`;

  const ucGravarSuspensao = new UcGravarSuspensao(
    new ParametroSuspensaoRepository(),
    new ParamSuspensoesIncluirFactory(),
  );
  await ucGravarSuspensao.validate(usuario, dadosDasSuspensoes);
  const suspensaoGravada = await ucGravarSuspensao.run();

  response.ok(suspensaoGravada);
}

// ... (outro código da controller) ...
