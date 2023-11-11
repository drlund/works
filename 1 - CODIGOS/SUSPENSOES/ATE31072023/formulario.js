/**
 * Para atualizar dinamicamente o campo "Input" com o valor selecionado em "Radio.Group", pode-se usar o evento
 * onChange de "Radio.Group" para atualizar o estado com o valor selecionado e, em seguida, usar este valor de
 * estado para preencher o campo "Input".
 * 
 * Com essas alterações, o campo "Input" será atualizado automaticamente com o valor selecionado no "Radio.Group". 
 * A função `handleTipoChange` é acionada quando o usuário seleciona um botão de rádio diferente e atualiza o estado 
 * `selectedTipo` com o novo valor. O campo "Input" é então configurado para exibir esse valor atualizado usando 
 * a prop `value={selectedTipo}`.
 * 
 * 
 * 1. Primeiro, adicione uma variável de estado para armazenar o valor selecionado do "Radio.Group":
 */


import React, { useState } from 'react';
// ... outras importações

function FormParamSuspensao({ location }) {
  // ... código existente

  // Passo 1: Adicione uma variável de estado para armazenar o valor do rádio selecionado
  const [selectedTipo, setSelectedTipo] = useState('');

  // Passo 2: Defina uma função para lidar com a mudança no Radio.Group
  const handleTipoChange = (e) => {
    setSelectedTipo(e.target.value);
  };

  // ... código existente

  return (
    <>
      <Card>
        <Row>
          {/* ... código existente ... */}
        </Row>
      </Card>
      <Card>
        <Form
          form={form}
          {...layout}
          name="control-ref"
          onFinish={gravaSuspensao}
        >
          <Form.Item label="Tipo">
            {/* Passo 3: Adicione o evento onChange ao Radio.Group */}
            <Radio.Group onChange={handleTipoChange} value={selectedTipo}>
              <Radio value="vicePresi"> Vice Presidência </Radio>
              <Radio value="unidEstrat"> Unid. Estratégica </Radio>
              <Radio value="unidTat"> Unid. Tática </Radio>
              <Radio value="comercial"> Comercial </Radio>
              <Radio value="prefixo"> Prefixo </Radio>
              <Radio value="matricula"> Matrícula </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="tipo"
            label="Tipo"
            rules={[
              {
                required: true,
                message: 'Por favor, selecione o tipo!',
              },
            ]}
          >
            {/* Passo 4: Defina o valor do campo de entrada (Input) como o estado selectedTipo */}
            <Input placeholder="Tipo" value={selectedTipo} />
          </Form.Item>
          {/* ... outros itens do formulário ... */}
          <Form.Item {...tailLayout}>
            <Button
              style={{ marginRight: 10, borderRadius: 3 }}
              type="primary"
              htmlType="submit"
            >
              Salvar
            </Button>
            <Button
              style={{ borderRadius: 3 }}
              type="danger"
              onClick={() => history.goBack()}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default FormParamSuspensao;
