/**
 * Para forçar a atualização da página após a exclusão de um elemento do `dataTable`, você pode incluir um intervalo que execute uma função para recarregar 
 * a página após um determinado período de tempo. Você pode fazer isso adicionando `window.location.reload()` dentro de um `setTimeout`. Aqui está como você 
 * pode fazer isso:
 * 
 * 1. No seu código, após a exclusão bem-sucedida, você pode adicionar o seguinte código para recarregar a página após um intervalo de tempo específico (por 
 * exemplo, 2 segundos):
 */

const removerSuspensao = (/** @type {number} */ id) => {
  deleteSuspensao({ id, observacao })
    .then(() => {
      setShowModal(false);
      setObservacao('');
     
      // Agendar a recarga da página após 2 segundos
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2000 milissegundos = 2 segundos
    })
    .catch(() => message.error('Falha ao excluir suspensão!'));
};

// Isso fará com que a página seja recarregada automaticamente após 2 segundos, dando a impressão de que a exclusão foi refletida instantaneamente na interface do usuário. Você pode ajustar o tempo do intervalo (2 segundos neste exemplo) conforme necessário para atender às suas preferências.

// Lembre-se de que essa abordagem fará com que a página seja recarregada inteiramente, o que pode causar perda de dados não salvos em outros campos se houver algum. Portanto, use essa técnica com cuidado e com base nos requisitos do seu aplicativo.