/**
 * Com base nas informações fornecidas, aqui está um exemplo de implementação das funções `verificarStatusParametro` 
 * e `atualizarStatusParametro` no backend:
 */

// Função para verificar o status do parâmetro existente
async function verificarStatusParametro(prefixoDestino, comissaoDestino) {
  // Aqui você deve realizar a consulta ao banco de dados para obter o status do parâmetro
  const parametroExistente = await ParamAlcadas.query()
    .where("prefixoDestino", prefixoDestino)
    .where("comissaoDestino", comissaoDestino)
    .first();

  if (parametroExistente) {
    return parametroExistente.ativo;
  }

  // Se o parâmetro não existir, retorna null ou um valor padrão, conforme necessário
  return null;
}

// Função para atualizar o status do parâmetro
async function atualizarStatusParametro(prefixoDestino, comissaoDestino, novoStatus) {
  // Aqui você deve realizar a atualização do status do parâmetro no banco de dados
  const atualizacao = await ParamAlcadas.query()
    .where("prefixoDestino", prefixoDestino)
    .where("comissaoDestino", comissaoDestino)
    .update({ ativo: novoStatus });

  // Retorna o resultado da atualização (quantidade de registros atualizados)
  return atualizacao;
}


/**
 * No código acima, as funções `verificarStatusParametro` e `atualizarStatusParametro` são implementadas usando o modelo 
 * de banco de dados `ParamAlcadas`. A função `verificarStatusParametro` realiza uma consulta no banco de dados com base 
 * no `prefixoDestino` e `comissaoDestino` para obter o status do parâmetro existente. Se o parâmetro existir, o status 
 * `ativo` é retornado; caso contrário, é retornado `null` ou um valor padrão de sua escolha. 
 * 
 * A função `atualizarStatusParametro` realiza a atualização do status do parâmetro no banco de dados com base no 
 * `prefixoDestino` e `comissaoDestino`. Ela utiliza o método `update` do modelo `ParamAlcadas` para atualizar o campo 
 * `ativo` com o novo status fornecido. O resultado da atualização é retornado. 
 * 
 * Essas funções devem ser adaptadas ao seu código e ao seu modelo de banco de dados, considerando as tabelas, colunas 
 * e métodos específicos que você está usando.
*/