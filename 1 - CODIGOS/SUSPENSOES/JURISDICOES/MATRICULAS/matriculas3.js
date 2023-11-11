/**
 * Para substituir o componente `InputPrefixoAlcada` pelo `InputFunciSuspensao` quando o usuário selecionar "Matrícula" 
 * no `Radio.Group`, você precisará fazer algumas modificações em seu código.
 * 
 * Primeiro, importe o componente `InputFunciSuspensao` e as demais dependências necessárias:
 */

import React, { useState, useEffect } from 'react';
import { Select, message, Spin } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchMatchedPrefixos } from 'services/ducks/Arh.ducks';
import InputFunciSuspensao from './CaminhoParaSeuComponente/InputFunciSuspensao'; // Importe o componente InputFunciSuspensao

/**
 * Em seguida, dentro da função `FormParamSuspensao`, você precisará adicionar um estado para controlar qual componente 
 * será renderizado com base na seleção do `Radio.Group`. Além disso, você pode criar uma função para renderizar o 
 * componente apropriado com base na seleção:
 */

function FormParamSuspensao({ location }) {
  // ... (código existente)

  const [selecionaTipo, setSelecionaTipo] = useState(''); // Estado para controlar o tipo selecionado

  // Função para renderizar o componente apropriado com base no tipo selecionado
  const renderInputComponent = () => {
    if (selecionaTipo === 'matricula') {
      return (
        <InputFunciSuspensao
          value={tipoInputValue}
          onChange={handleChange} // Substitua pelo nome da sua função de manipulação
          tipoSelecionado={tipoSelecionado}
          // Outras props necessárias para InputFunciSuspensao
        />
      );
    } else {
      return (
        <InputPrefixoAlcada
          value={tipoInputValue}
          onChange={handleChange} // Substitua pelo nome da sua função de manipulação
          tipoSelecionado={tipoSelecionado}
          // Outras props necessárias para InputPrefixoAlcada
        />
      );
    }
  };

  // ... (restante do código)
}

/**
 * Agora, você precisará atualizar a função `handleTipoChange` para atualizar o estado `selecionaTipo` com base na 
 * seleção do `Radio.Group`:
 */

const handleTipoChange = (e) => {
  const valorSelecionado = e.target.value;

  if (!tipoJurisdicoesMap[valorSelecionado]) {
    message.error('Opção de tipo selecionada inválida!');
    return;
  }

  const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];
  setTipoSelecionado(valorRadioGroup);
  setTipoSelecionadoTemp(valorRadioGroup);

  let formatoInput = '';
  switch (valorRadioGroup) {
    // ... (restante do código)

    case 'matriculas':
      formatoInput = 'F0000000';
      setSelecionaTipo('matricula'); // Atualiza o tipo selecionado para 'matricula'
      break;

    default:
      formatoInput = 'Escolha um tipo de entrada!';
      setSelecionaTipo(''); // Limpa o tipo selecionado
      break;
  }

  const dadosJurisdicoes = getTiposJurisdicoes();
  const jurisdicaoSelecionada = tipoJurisdicoesMap[valorSelecionado];

  setValidaJurisdicao(
    Object.values(dadosJurisdicoes).filter(
      (prefixoTipo) => prefixoTipo === jurisdicaoSelecionada,
    ),
  );

  form.setFieldsValue({ tipo: '' });
  form.setFields([{ name: 'tipo', value: '' }]);
  setTipoInputValue(formatoInput);
};

/**
 * Agora, ao selecionar "Matrícula" no `Radio.Group`, o estado `selecionaTipo` será atualizado para `'matricula'`, e 
 * o componente `InputFunciSuspensao` será renderizado. Para as outras opções, o estado `selecionaTipo` permanecerá 
 * vazio e o componente `InputPrefixoAlcada` será renderizado.
 * 
 * Certifique-se de ajustar as propriedades e funções conforme necessário no componente `InputFunciSuspensao` para 
 * que ele funcione corretamente com a lógica do seu formulário.
 */