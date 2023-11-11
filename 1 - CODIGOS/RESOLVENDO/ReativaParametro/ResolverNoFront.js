/**
 * Se você deseja atualizar o status do parâmetro de "inativo" ("0") para "ativo" ("1") no backend, no caso de o parâmetro 
 * já existir, você precisará modificar o código correspondente. 
 * 
 * No trecho do código fornecido, a função `gravarParametro` é chamada para salvar o parâmetro no backend. Você pode fazer 
 * uma verificação adicional antes de salvar o parâmetro para determinar se ele já existe no banco de dados. Se existir, 
 * você pode chamar uma função separada para atualizar o status do parâmetro para "ativo" em vez de criar um novo parâmetro. 
 * 
 * Aqui está um exemplo de como você pode fazer isso:
*/

function gravaParametros() {
  // ...
  gravarParametro({ ...dadosParametro, idParametro })
    .then((dadosParametroForm) => {
      setDadosParametroForm(dadosParametroForm);
      history.goBack();
    })
    .catch((error) => {
      if (error.response && error.response.status === 409) {
        // Parâmetro já existe, atualize o status para "ativo" em vez de criar um novo
        atualizarStatusParametro(idParametro, "1")
          .then(() => {
            message.success("Parâmetro atualizado com sucesso");
            history.goBack();
          })
          .catch(() => {
            message.error("Falha ao atualizar o status do parâmetro");
          });
      } else {
        message.error("Falha ao gravar parâmetro! Parâmetro já gravado para o prefixo. Verifique!");
      }
    });
  // ...
}

/** No exemplo acima, é feita uma verificação adicional na função `catch` para identificar o código de resposta 409 (conflito). 
 * Se ocorrer um erro com esse código, isso indica que o parâmetro já existe. Em seguida, a função `atualizarStatusParametro` 
 * é chamada para atualizar o status do parâmetro para "ativo" no backend.
 * 
 * Certifique-se de implementar a função `atualizarStatusParametro` no backend para realizar a atualização do status do parâmetro 
 * com base no seu banco de dados e estrutura do código existente.
*/