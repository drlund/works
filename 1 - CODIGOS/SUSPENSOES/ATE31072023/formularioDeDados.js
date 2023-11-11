/**
 * Agora, ao selecionar uma opção no `Radio.Group`, o valor será atualizado no estado `selectedTipo`, e esse valor 
 * será exibido no campo "Tipo" automaticamente. O campo "Tipo" não precisa ser preenchido manualmente com a opção 
 * selecionada no `Radio.Group`, pois o estado já controla essa informação.
 * 
 * Para que o campo "Tipo" seja atualizado conforme a opção selecionada no `Radio.Group`, você precisa adicionar 
 * uma função de tratamento de mudança para o `Radio.Group`. No código fornecido, essa função já existe e é 
 * chamada de `handleTipoChange`. Essa função atualiza o estado do componente `selectedTipo` com o valor selecionado 
 * no `Radio.Group`.
 * 
 * No entanto, há um erro no código fornecido. O campo "Tipo" não deve ser um `Input`, pois já está sendo atualizado 
 * através do `Radio.Group`. Você pode remover o `Form.Item` com o nome "tipo" que contém o `Input` e utilizar 
 * somente o `Radio.Group` para definir o valor do tipo selecionado.
 * 
 * Aqui está o código corrigido para realizar essa tarefa:
 */


import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Radio,
  message,
  Modal,
  DatePicker,
} from 'antd';

// Resto do código...

function FormParamSuspensao({ location }) {
  // Resto do código...

  const handleTipoChange = (e) => {
    setSelectedTipo(e.target.value);
  };

  // Resto do código...

  return (
    <>
      {/* Resto do código... */}
      <Card>
        <Form
          form={form}
          {...layout}
          name="control-ref"
          onFinish={incluirSuspensao}
        >
          <Form.Item label="Tipo">
            <Radio.Group onChange={handleTipoChange} value={selectedTipo}>
              <Radio value="vicePresi"> Vice Presidência </Radio>
              <Radio value="diretoria"> Unid. Estratégica </Radio>
              <Radio value="super"> Unid. Tática </Radio>
              <Radio value="gerev"> Comercial </Radio>
              <Radio value="prefixo"> Prefixo </Radio>
              <Radio value="matricula"> Matrícula </Radio>
            </Radio.Group>
          </Form.Item>
          {/* Remove the following Form.Item with Input */}
          {/* <Form.Item
            name="tipo"
            label="Tipo"
            rules={[
              {
                required: true,
                message: 'Por favor, selecione o prefixo!',
              },
            ]}
          >
            <Input placeholder="Tipo" value={selectedTipo} />
          </Form.Item> */}
          <Form.Item name="tipoSuspensao" label="Tipo de Suspensão" required>
            <Select
              placeholder="Selecione o tipo de suspensão"
              onChange={(value) => {
                if (value === 'novo') {
                  setModalVisible(true);
                }
              }}
            >
              {tiposSuspensao.map((tipo) => (
                <Select.Option key={tipo.id} value={tipo.id}>
                  {tipo.mensagem}
                </Select.Option>
              ))}
              <Select.Option
                key="novo"
                value="novo"
                style={{ fontWeight: 'bold', color: 'green' }}
              >
                ** INCLUIR NOVO TIPO DE SUSPENSÃO **
              </Select.Option>
            </Select>
          </Form.Item>
          {/* Resto do código... */}
        </Form>
      </Card>
    </>
  );
}

export default FormParamSuspensao;
