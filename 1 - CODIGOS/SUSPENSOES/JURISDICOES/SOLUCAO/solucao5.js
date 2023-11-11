/**
 * Dessa forma, o campo específico no objeto "dadosSuspensao" será preenchido com o valor do campo "tipo" selecionado no 
 * "Radio.Group". Isso permitirá que os valores como "vicePresi", "diretoria", "supers", "gerev", "prefixo" ou "matricula" 
 * sejam gravados corretamente no banco de dados.
 * 
 * Se o seu banco de dados não grava "tipo", mas sim os valores específicos como "vicePresi", "diretoria", "supers", "gerev", 
 * "prefixo" ou "matricula", você deve atribuir diretamente o valor do "tipoSelecionado" ao campo correspondente na constante 
 * "dadosSuspensao". Veja como ajustar:
 */

function gravaSuspensao() {
  const dadosForm = form.getFieldsValue();

  const dadosSuspensao = {
    ...dadosForm,
    [tipoSelecionado]: dadosForm.tipo, // Aqui atribuímos o valor de "tipo" diretamente ao campo específico no banco
    vicePresi: dadosForm.vicePresi?.value,
    diretoria: dadosForm.diretoria?.value,
    supers: dadosForm.supers?.value,
    gerev: dadosForm.gerev?.value,
    prefixo: dadosForm.prefixo?.value,
  };

  // Restante do código...
}
