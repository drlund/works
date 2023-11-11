/**
 * O erro está acontecendo porque a variável "value" não está definida no escopo do componente "FormParamSuspensao". 
 * Ela pertence ao estado do componente "InputPrefixo". Para corrigir esse problema, podemos passar o valor correto 
 * como prop para o componente "InputPrefixo".
 * 
 * Vamos fazer as seguintes alterações no componente "FormParamSuspensao":
 * 
 * 1. Importe o componente "InputPrefixo" no início do arquivo:
 */

import InputPrefixo from 'caminho/do/componente/InputPrefixo'; // Substitua 'caminho/do/componente' pelo caminho correto do componente InputPrefixo

// 2. Defina um estado para guardar o valor do campo "tipo" no componente "FormParamSuspensao":

const [tipoInputValue, setTipoInputValue] = useState('');

// 3. No método "handleTipoChange", atualize o valor do estado "tipoInputValue" com o valor selecionado:

const handleTipoChange = (e) => {
  const valorSelecionado = e.target.value;
  setTipoSelecionado(valorSelecionado);

  let formatoInput = '';
  switch (valorSelecionado) {
    case 'vicePresi':
      formatoInput = '0000';
      break;
    case 'diretoria':
      formatoInput = '0000';
      break;
    case 'super':
      formatoInput = '0000';
      break;
    case 'gerev':
      formatoInput = '0000';
      break;
    case 'prefixo':
      formatoInput = '0000';
      break;
    case 'matricula':
      formatoInput = 'F0000000';
      break;
    default:
      formatoInput = 'Escolha um tipo de entrada!';
      break;
  }

  form.setFieldsValue({ tipo: '' });
  form.setFields([{ name: 'tipo', value: '' }]);
  setTipoInputValue(formatoInput); // Adicione esta linha para atualizar o valor do campo "tipo" no estado
};

// 4. No componente "FormParamSuspensao", passe o valor correto para o componente "InputPrefixo":

<Form.Item
  name="tipo"
  label="Tipo"
  rules={[
    {
      required: true,
      message: 'Por favor, selecione um tipo!',
    },
  ]}
>
  <InputPrefixo
    placeholder="Tipo"
    value={tipoInputValue}
    ref={tipoInputRef}
  />
</Form.Item>
