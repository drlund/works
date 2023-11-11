/** No trecho de código fornecido, a captura dos valores de "comite" e "nomeComite" está ocorrendo corretamente na 
 * função `buscarComites(comite)`. No entanto, na função `gravaParametros`, você precisa ajustar a atribuição dos 
 * valores para essas variáveis. Veja a versão corrigida da função `gravaParametros`:
*/

function gravaParametros() {
  const dadosForm = form.getFieldsValue();
  const { prefixoDestino } = dadosForm;

  const dadosParametro = {
    ...dadosForm,
    prefixoDestino: dadosForm.prefixoDestino?.value,
    nomePrefixo: prefixoDestino?.label?.slice(2).toString(),
    comite: dadosForm.comite?.value,
    nomeComite: dadosForm.comite?.label?.slice(2).toString(),
  };

  if (
    permissao.includes('PARAM_ALCADAS_ADMIN') ||
    (permissao.includes('PARAM_ALCADAS_USUARIO') &&
      prefixoUsuario === prefixoDestino?.value)
  ) {
    form
      .validateFields()
      .then(() => {
        const prefixoDestino = dadosForm.prefixoDestino?.value;
        const comite = dadosForm.comite?.value;

        if (prefixoDestino && !prefixosSubordinados.includes(prefixoDestino)) {
          message.error('Prefixo de destino não vinculado à jurisdição.');
          return;
        }

        if (comite && !temComite.includes(comite)) {
          message.error('Prefixo não possui comitê!');
          return;
        }

        gravarParametro({ ...dadosParametro, idParametro })
          .then((dadosParametroForm) => {
            setDadosParametroForm(dadosParametroForm);
            history.goBack();
          })
          .catch(() => message.error('Falha ao gravar parâmetro!'));
      })
      .catch((error) => {
        console.log('Erro de validação:', error);
      });
  } else {
    message.error('Prefixo de destino não vinculado à jurisdição.');
  }
}

/**Certifique-se de que a função `buscarComites(comite)` esteja sendo chamada corretamente, com os valores 
 * apropriados sendo passados para ela. Depois disso, os valores de "comite" e "nomeComite" devem ser capturados 
 * corretamente em `dadosForm.comite?.value` e `dadosForm.comite?.label?.slice(2).toString()`, respectivamente.
 */