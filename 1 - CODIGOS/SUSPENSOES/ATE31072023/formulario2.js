/**
 * Para configurar os dados que chegam da função `getTipoSuspensao` no campo "tipoSuspensao" do formulário, você pode utilizar 
 * o hook `useEffect` para buscar os dados ao carregar o componente e, em seguida, definir o valor do campo "tipoSuspensao" com 
 * os dados obtidos. O `useEffect` é uma função do React que é executada após cada renderização do componente, permitindo que 
 * você realize efeitos colaterais, como chamadas a APIs.
 * 
 * Aqui está como você pode fazer isso:
 * 
 * 1. Importe o hook `useEffect` e a função `getTipoSuspensao`:
*/


import React, { useState, useEffect } from 'react';
import { getTipoSuspensao } from '../../apiCalls/apiParamSuspensao';
// ... outras importações

// 2. No componente `FormParamSuspensao`, crie um estado para armazenar os dados do tipo de suspensão:

function FormParamSuspensao({ location }) {
  // ... código existente

  // Passo 1: Adicione um estado para armazenar os dados do tipo de suspensão
  const [tiposSuspensao, setTiposSuspensao] = useState([]);

  // ... código existente

  return (
    // ... código existente
  );
}

export default FormParamSuspensao;


// 3. Use o `useEffect` para buscar os dados dos tipos de suspensão ao carregar o componente:


function FormParamSuspensao({ location }) {
  // ... código existente

  const [tiposSuspensao, setTiposSuspensao] = useState([]);

  // Passo 2: Use o useEffect para buscar os dados dos tipos de suspensão ao carregar o componente
  useEffect(() => {
    const fetchTiposSuspensao = async () => {
      try {
        const data = await getTipoSuspensao();
        setTiposSuspensao(data);
      } catch (error) {
        console.error('Erro ao buscar os tipos de suspensão:', error);
      }
    };

    fetchTiposSuspensao();
  }, []);

  // ... código existente

  return (
    // ... código existente
  );
}

export default FormParamSuspensao;

// 4. Agora, defina as opções do campo "tipoSuspensao" usando os dados obtidos:

function FormParamSuspensao({ location }) {
  // ... código existente

  const [tiposSuspensao, setTiposSuspensao] = useState([]);

  useEffect(() => {
    const fetchTiposSuspensao = async () => {
      try {
        const data = await getTipoSuspensao();
        setTiposSuspensao(data);
      } catch (error) {
        console.error('Erro ao buscar os tipos de suspensão:', error);
      }
    };

    fetchTiposSuspensao();
  }, []);

  // ... código existente

  return (
    <>
      {/* ... código existente ... */}

      <Form.Item name="tipoSuspensao" label="Tipo de Suspensão" required>
        <Select
          placeholder="Selecione o tipo de suspensão"
        >
          {/* Passo 3: Defina as opções do Select com os dados obtidos */}
          {tiposSuspensao.map((tipo) => (
            <Select.Option key={tipo.id} value={tipo.id}>
              {tipo.nome}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* ... código existente ... */}
    </>
  );
}

export default FormParamSuspensao;
