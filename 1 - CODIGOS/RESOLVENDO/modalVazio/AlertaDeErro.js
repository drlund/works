/**
 * É possível exibir uma mensagem de erro ao invés de usar o `alert`. Você pode criar um estado adicional para 
 * armazenar a mensagem de erro e exibi-la no componente `Modal`. Aqui está um exemplo de como você pode fazer isso:
 */


import React, { useState } from 'react';

// Resto do código...

const [errorMessage, setErrorMessage] = useState('');

<Modal
  className="custom-modal"
  title="Justificar exclusão"
  open={showModal}
  onCancel={() => {
    setShowModal(false);
    setErrorMessage('');
  }}
  onOk={() => {
    if (!observacao) {
      setErrorMessage('Preencha o campo obrigatório.');
      return;
    }

    setShowModal(false);
    setErrorMessage('');

    if (selectedRecord) {
      confirmarExclusao(
        selectedRecord.id,
        removerParametro,
        'Confirmar exclusão do parâmetro?',
        observacao,
      );
    }
  }}
>
  <Input.TextArea
    className="text-area"
    rows={4}
    value={observacao}
    onChange={(e) => setObservacao(e.target.value)}
  />
  {errorMessage && <p className="error-message">{errorMessage}</p>}
</Modal>


/** Neste exemplo, adicionamos um estado `errorMessage` para armazenar a mensagem de erro. Quando o campo `observacao` 
 * estiver vazio, definimos a mensagem de erro usando `setErrorMessage`. Se houver uma mensagem de erro, ela será 
 * exibida no componente `Modal` dentro de um elemento `p` com a classe CSS `error-message`. Quando o modal for 
 * cancelado, o estado `errorMessage` é redefinido para uma string vazia.
 * 
 * Certifique-se de ajustar o estilo da mensagem de erro de acordo com sua aplicação, ou você pode adicionar uma 
 * classe CSS personalizada para estilizar a mensagem de erro conforme necessário.
 */