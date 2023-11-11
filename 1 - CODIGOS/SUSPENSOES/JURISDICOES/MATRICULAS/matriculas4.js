/**
 * Certifique-se de substituir `'./CaminhoParaSeuComponente/InputFunciSuspensao'` pelo caminho correto para o componente 
 * `InputFunciSuspensao` dentro do seu projeto. Com essas modificações, o componente `InputFunciSuspensao` será renderizado 
 * quando o usuário selecionar "Matrícula" no `Radio.Group`, e o componente `InputPrefixoAlcada` será renderizado para as 
 * outras opções. Certifique-se de ajustar as propriedades e funções conforme necessário no componente `InputFunciSuspensao` 
 * para que ele funcione corretamente com a lógica do seu formulário.
 * 
 * Aqui estão as modificações sugeridas no seu código para utilizar o componente `InputFunciSuspensao` quando o usuário 
 * selecionar "Matrícula" no `Radio.Group`:
 */

// ... (código existente)

import InputFunciSuspensao from './CaminhoParaSeuComponente/InputFunciSuspensao'; // Importe o componente InputFunciSuspensao

// ... (código existente)

function FormParamSuspensao({ location }) {
  // ... (código existente)

  const [selectedTipo, setSelectedTipo] = useState(''); // Estado para controlar o tipo selecionado

  // ... (código existente)

  // Função para renderizar o componente apropriado com base no tipo selecionado
  const renderInputComponent = () => {
    if (selectedTipo === 'matricula') {
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

  // ... (código existente)

  return (
    <>
      {/* ... (código existente) */}
      <Form
        form={form}
        {...layout}
        name="control-ref"
        onFinish={gravaSuspensao}
      >
        {/* ... (código existente) */}
        <Form.Item
          name="tipo"
          label="Tipo"
          rules={[
            {
              required: true,
              message: 'Por favor, selecione um tipo!',
            },
            // ... (regras de validação existentes)
          ]}
        >
          {/* Renderiza o componente apropriado com base no tipo selecionado */}
          {renderInputComponent()}
        </Form.Item>
        {/* ... (código existente) */}
      </Form>
      {/* ... (código existente) */}
    </>
  );
}

export default FormParamSuspensao;
