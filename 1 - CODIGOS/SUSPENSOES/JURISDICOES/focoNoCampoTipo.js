/**
 * Para dar foco ao campo "tipo" automaticamente quando houver seleção no "Radio.Group", você pode utilizar a propriedade 
 * `ref` no `Input` correspondente e uma combinação de `useRef` e `useEffect` no componente.
 * 
 * Primeiro, adicione uma referência (ref) ao campo "tipo" usando `useRef`:
 */


import React, { useState, useEffect, useRef } from 'react';
// ...

function FormParamSuspensao({ location }) {
  // ...
  const tipoInputRef = useRef(null); // Cria uma referência para o campo "tipo"
  // ...

// Em seguida, no `Input` do campo "tipo", adicione a propriedade `ref` para associar a referência que criamos:


// ...
<Form.Item
  name="tipo"
  label="Tipo"
  rules={[
    {
      required: true,
      message: 'Por favor, selecione o prefixo!',
    },
  ]}
>
  <Input placeholder="Tipo" value={tipoSelecionado} ref={tipoInputRef} />
</Form.Item>
// ...

/**
 * Agora, quando um valor é selecionado no `Radio.Group`, podemos usar o `useEffect` para dar foco ao campo "tipo" 
 * usando a referência que criamos. No `useEffect`, verificamos se há um valor selecionado no `Radio.Group`, e caso 
 * haja, chamamos o método `focus()` na referência do campo "tipo":
 */


// ...
function FormParamSuspensao({ location }) {
  // ...
  const handleTipoChange = (e) => {
    const valorSelecionado = e.target.value;
    setTipoSelecionado(valorSelecionado);
    // ...
  };

  useEffect(() => {
    // Dá foco ao campo "tipo" quando um valor é selecionado no Radio.Group
    if (tipoSelecionado && tipoInputRef.current) {
      tipoInputRef.current.focus();
    }
  }, [tipoSelecionado]);
  
  // ...
