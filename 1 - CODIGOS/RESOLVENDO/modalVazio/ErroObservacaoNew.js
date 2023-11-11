/** 
 * No caso do componente `Form.Item` do Ant Design, para personalizar a mensagem de erro exibida quando o campo é 
 * obrigatório, é necessário utilizar a prop `rules` em conjunto com a função `validator`.
 * 
 * Aqui está um exemplo de como aplicar essa personalização:
*/

import React, { useState } from 'react';
import { Form, Input } from 'antd';

// Resto do código...

const [observacaoError, setObservacaoError] = useState('');

const handleObservacaoChange = (e) => {
  setObservacaoValue(e.target.value);
  setObservacaoError('');
};

const handleObservacaoValidate = (_, value) => {
  if (!value) {
    setObservacaoError('Preencha o campo obrigatório.');
    return Promise.reject('Preencha o campo obrigatório.');
  }
  return Promise.resolve();
};

<Form.Item
  name="observacao"
  label="Observação"
  rules={[
    {
      required: true,
      validator: handleObservacaoValidate,
    },
  ]}
  validateStatus={observacaoError ? 'error' : ''}
  help={observacaoError}
>
  <Input.TextArea
    rows={4}
    type="text"
    placeholder="Observação!"
    allowClear
    value={observacaoValue}
    onChange={handleObservacaoChange}
  />
</Form.Item>

/** 
 * Neste exemplo, definimos a função `handleObservacaoValidate` como validador personalizado para o campo `observacao`. 
 * Se o campo estiver vazio, definimos a mensagem de erro utilizando `setObservacaoError` e rejeitamos a Promise 
 * retornada pelo validador.
 * 
 * Ao utilizar a prop `rules` com o objeto `{ required: true, validator: handleObservacaoValidate }`, garantimos que 
 * o campo `observacao` seja validado como obrigatório e chamamos o validador personalizado `handleObservacaoValidate` 
 * para verificar se o campo foi preenchido corretamente. 
 * 
 * Certifique-se de ajustar o restante do código para lidar com as alterações. Essa solução deve permitir que você 
 * personalize a mensagem de erro exibida quando o campo `observacao` estiver vazio.
*/