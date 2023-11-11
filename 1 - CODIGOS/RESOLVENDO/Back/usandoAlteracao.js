// 14/07/2023

/**
 * É possível inferir a variável `observacaoAtualizada` para ser utilizada no caso do `parametroExistente` no momento 
 * de chamar a função `gravarParametro` na sua repository. Com essas modificações, a variável `observacaoAtualizada` 
 * será passada da controller para a use case, e então será passada para a repository para ser utilizada no caso do 
 * `parametroExistente` no momento da gravação do parâmetro.
 * 
 * Aqui está uma sugestão de como você pode fazer isso: 
 * 
 * 1. Na função `gravarParametro` da sua repository, modifique a assinatura da função para incluir a variável 
 * `observacaoAtualizada`:
*/

async gravarParametro(novoParametro, usuario, observacaoAtualizada) {
  // Restante do código
}


/** 
 * 2. Na função `patchParametros` da sua controller, após criar a instância da classe `UcAlterarParametros` e validar
 * os dados, você pode utilizar a variável `observacaoAtualizada` para passar para a função `gravarParametro` da sua 
 * repository no caso do `parametroExistente`.
 */


// Restante do código
const ucAlterarParametros = new UcAlterarParametros(new ParametrosAlcadasRepository());

await ucAlterarParametros.validate({
  id,
  comite,
  nomeComite,
  observacao: observacaoAtualizada,
});

const parametroGravado = await ucAlterarParametros.run(observacaoAtualizada);
// Restante do código


/**
 * 3. Na classe `UcAlterarParametros`, na função `run()`, você precisa modificar a assinatura da função `run()` para 
 * incluir a variável `observacaoAtualizada` e, em seguida, passar a variável para a função `gravarParametro` na 
 * sua repository:
 */


async run(observacaoAtualizada) {
  // Restante do código

  if (this.parametroExistente) {
    // Restante do código
    const parametroGravado = await this.ParametrosAlcadasRepository.gravarParametro(
      dadosPreparados,
      observacaoAtualizada
    );
    return parametroGravado;
  }

  // Restante do código
}


/**
 * 4. Por fim, na função `gravarParametro` da sua repository, utilize a variável `observacaoAtualizada` para definir o 
 * valor do campo `observacao` do parâmetro existente:
 */


async gravarParametro(novoParametro, usuario, observacaoAtualizada) {
  // Restante do código

  if (parametroExistente.rows.length > 0) {
    const registroExiste = parametroExistente.rows[0];
    // Restante do código
    registroExiste.observacao = observacaoAtualizada;
    // Restante do código
  }

  // Restante do código
}

