/**
 * No código acima, a função `handleTipoChange` verifica o valor selecionado do "Radio.Group" e define o 
 * formato apropriado para o campo "tipo" usando `form.setFields`. A linha `form.setFieldsValue({ tipo: '' })` 
 * redefine o valor do campo "tipo", e `form.setFields([{ name: 'tipo', value: '', format: formatoInput }])` 
 * define o formato do campo "tipo".
 * 
 * Agora, quando um usuário selecionar uma opção no "Radio.Group", o campo "tipo" será preparado para aceitar 
 * o formato correspondente. Por exemplo, se o usuário selecionar "matricula", o campo "tipo" será configurado 
 * para aceitar valores no formato "F0000000", e se o usuário selecionar "prefixo", ele será configurado para 
 * aceitar valores no formato "0000". Para outras opções, o campo "tipo" será um campo de entrada regular, sem 
 * requisitos específicos de formato.
 * 
 * Para preparar o campo "Input" com o formato apropriado com base na opção selecionada no "Radio.Group", você 
 * pode modificar a função `handleTipoChange` para definir o formato do campo com base na opção selecionada. 
 * Veja como fazer:
 */

import React, { useState, useEffect } from 'react';
// ... (outras importações)

function FormParamSuspensao({ location }) {
  // ... (outros estados e funções)

  const handleTipoChange = (e) => {
    const valorSelecionado = e.target.value;
    setTipoSelecionado(valorSelecionado);

    // Defina o formato para o campo "tipo" com base na opção selecionada
    let formatoInput = '';
    switch (valorSelecionado) {
      case 'matricula':
        formatoInput = 'F0000000';
        break;
      case 'prefixo':
        formatoInput = '0000';
        break;
      // Adicione casos para outras opções, se necessário
      default:
        formatoInput = ''; // Para qualquer outra opção, não há um formato específico
        break;
    }

    // Reinicia o valor e o formato do campo "tipo"
    form.setFieldsValue({ tipo: '' });
    form.setFields([{ name: 'tipo', value: '', format: formatoInput }]);
  };

  // ... (restante do código)
}
