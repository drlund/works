/**
 * Se você deseja incluir a chamada da função `handleEdit` no evento de clique do ícone de edição e também manter os demais 
 * parâmetros (`history.push` e `record`) que já estão sendo usados, você pode fazer o seguinte:
 * 

1. Importe a função `handleEdit` no início do seu componente, caso ela não esteja definida no escopo do componente.

2. No evento de clique do ícone de edição (`onClick` do `EditOutlined`), chame a função `handleEdit` e passe o `id` 
do registro como parâmetro, conforme discutido anteriormente. Além disso, mantenha o código existente para navegar 
para a página de edição:
*/

import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tooltip, Modal, Input, message, Button, Row, Col, Space, Divider, Card } from 'antd';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

// ... (código existente)

function ParamSuspensaoTable({ ...props }) {
  const history = useHistory(); // Certifique-se de ter esta linha no escopo do componente

  // ... (código existente)

  const handleEdit = (id) => {
    // Aqui você pode implementar a lógica de edição com base no ID do registro
    // Por exemplo, buscar os dados do registro e preencher o formulário de edição
  };

  const columns = [
    // ... outras colunas ...
    {
      title: 'Ações',
      width: '10%',
      align: 'center',
      render: (/** @type {any} */ record) => (
        <span>
          <Tooltip title="Editar">
            <EditOutlined
              className="link-color link-cursor"
              onClick={() => {
                handleEdit(record.id); // Chamando a função handleEdit com o id do registro
                history.push({
                  pathname: '/movimentacoes/editar-suspensao/',
                  state: record,
                });
              }}
            />
          </Tooltip>
          {/* ... restante do código ... */}
        </span>
      ),
    },
  ];

  // ... (código existente)
}

export default connect(null, { toggleSideBar })(ParamSuspensaoTable);
```

Dessa forma, você chamará a função `handleEdit` e também navegará para a página de edição ao clicar no ícone de edição. Certifique-se de implementar a lógica da função `handleEdit` para lidar com a edição dos dados de acordo com o ID do registro.