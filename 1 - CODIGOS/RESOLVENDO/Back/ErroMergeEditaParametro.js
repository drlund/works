/**
 * O erro "TypeError: editaParametro.merge is not a function" ocorre porque o objeto `editaParametro` não possui um método `merge()`. 
 * Pelo código fornecido, parece que você está tentando usar o método `merge()` em um objeto chamado `editaParametro`, que é uma 
 * instância da classe `ParamAlcadas`. No entanto, o método `merge()` não é um método padrão dessa classe. Para corrigir esse erro, 
 * você precisa verificar se a classe `ParamAlcadas` tem um método chamado `merge()`. Se esse método não existe na classe, você 
 * precisará encontrar uma maneira alternativa de atualizar os atributos do objeto `editaParametro` com os valores de `novoParametro`. 
 * Você pode fazer isso manualmente, atribuindo os valores de `novoParametro` aos atributos correspondentes em `editaParametro`. 
 * 
 * Por exemplo:
*/

async patchParametros(idParametro, novoParametro) {
  const editaParametro = ParamAlcadas.find(idParametro);

  if (!editaParametro) {
    throw new Error("Parâmetro não encontrado");
  }

  editaParametro.comite = novoParametro.comite;
  editaParametro.nomeComite = novoParametro.nomeComite;

  editaParametro.save(idParametro);
}


