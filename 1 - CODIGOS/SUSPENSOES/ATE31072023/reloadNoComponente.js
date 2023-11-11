/**
 * É possível atualizar apenas o componente específico sem recarregar toda a página. Você pode fazer isso através do 
 * estado do componente.
 * 
 * Dessa forma, ao adicionar a nova mensagem com sucesso, o estado do componente será atualizado com as informações 
 * atualizadas e, como resultado, o componente será renderizado novamente com a nova mensagem de suspensão adicionada, 
 * sem a necessidade de recarregar toda a página.
 * 
 * A ideia é que, ao adicionar uma nova mensagem de suspensão com sucesso, você atualize o estado do componente com 
 * os novos dados recebidos do servidor, e o componente será renderizado novamente com as informações atualizadas.
 * 
 * Aqui está como você pode fazer isso no código:
 * 
 * 1. Primeiro, defina um estado no componente para armazenar as mensagens de suspensão:
*/


// ...
function FormParamSuspensao({ location }) {
  // ...
  const [tiposSuspensao, setTiposSuspensao] = useState([]);
  // ...
}
// ...


/**
 * 2. Em seguida, após adicionar a nova mensagem de suspensão com sucesso, atualize o estado do componente chamando 
 * a função `setTiposSuspensao` com os novos dados obtidos do servidor:
 */

const handleSalvaNovoTipoDeSuspensao = async () => {
  try {
    // ... código para gravar o novo tipo de suspensão ...

    // Atualiza o estado do componente com os novos dados do servidor
    setTiposSuspensao([...tiposSuspensao, { id: 'novo_id', mensagem: novoTipoDeSuspensao }]);

    message.success('Nova mensagem de suspensão adicionada com sucesso!');
  } catch (error) {
    message.error('Erro ao adicionar nova mensagem de suspensão:', error.message);
  }
};
