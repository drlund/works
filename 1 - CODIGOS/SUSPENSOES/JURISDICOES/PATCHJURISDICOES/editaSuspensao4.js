/**
 * Se a função `handleEdit` está em um arquivo diferente do `DataTable`, você precisará passar essa função como prop para 
 * o componente `ParamSuspensaoTable`. Vou guiá-lo através desse processo:

1. Primeiro, certifique-se de ter a função `handleEdit` definida no componente que contém o formulário. Vou chamá-lo de 
`FormParamSuspensaoPatch`.
*/

// FormParamSuspensaoPatch.js

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function FormParamSuspensaoPatch(props) {
  const history = useHistory();

  const handleEdit = (id) => {
    // Implemente a lógica de edição aqui, usando o ID para buscar os dados do registro
    // e preencher o formulário de edição.
    // Por exemplo, você pode chamar uma API para buscar os dados e preencher o estado do formulário.
    // props.setFormState(dadosDoRegistro);
    history.push(`/movimentacoes/editar-suspensao/${id}`);
  };

  // Resto do seu código do formulário
}

export default FormParamSuspensaoPatch;

/**
 * 2. Agora, no arquivo onde você renderiza o componente `ParamSuspensaoTable`, você precisará passar a função `handleEdit` 
 * como prop.
 */

// Arquivo onde você renderiza ParamSuspensaoTable.js

import React from 'react';
import ParamSuspensaoTable from './ParamSuspensaoTable';
import FormParamSuspensaoPatch from './FormParamSuspensaoPatch';

function RenderComponent() {
  const handleEdit = (id) => {
    // Implemente a lógica de edição aqui, se necessário, ou simplesmente redirecione para a página de edição.
    // Você pode chamar uma função de edição no seu estado global ou fazer qualquer outra ação necessária.
  };

  return (
    <div>
      {/* Renderize o componente FormParamSuspensaoPatch e passe a função handleEdit como prop */}
      <FormParamSuspensaoPatch handleEdit={handleEdit} />
      {/* Renderize o componente ParamSuspensaoTable e passe a função handleEdit como prop */}
      <ParamSuspensaoTable handleEdit={handleEdit} />
    </div>
  );
}

export default RenderComponent;

/**
 * 3. Por fim, no componente `ParamSuspensaoTable`, você pode usar a função `handleEdit` que foi passada como prop para 
 * implementar a lógica de edição.
 */

// ParamSuspensaoTable.js

import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

function ParamSuspensaoTable(props) {
  // Resto do seu código

  const columns = [
    // ... outras colunas ...
    {
      title: 'Ações',
      width: '10%',
      align: 'center',
      render: (record) => (
        <span>
          <Tooltip title="Editar">
            <EditOutlined
              className="link-color link-cursor"
              onClick={() => props.handleEdit(record.id)}
            />
          </Tooltip>
          {/* ... restante do código ... */}
        </span>
      ),
    },
  ];

  // Resto do seu código
}

export default ParamSuspensaoTable;

/**
 * Agora você deve ter a função `handleEdit` passada como prop para o componente `ParamSuspensaoTable` e, quando o ícone 
 * de edição for clicado, a função `handleEdit` será chamada, permitindo que você implemente a lógica de edição onde for 
 * necessário. Certifique-se de ajustar a implementação da função `handleEdit` de acordo com a sua necessidade.
 */