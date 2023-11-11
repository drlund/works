/**
 * Se você deseja que o campo `Radio.Group` seja atualizado automaticamente quando o usuário selecionar uma opção 
 * diferente, você pode adicionar um estado para controlar a seleção atual e usá-lo para definir o valor do `Radio.Group`. 
 * Aqui está como você pode fazer isso:
 * 
 * 1. Adicione um estado para controlar a seleção atual:
 */

const [opcaoSelecionada, setOpcaoSelecionada] = useState('');

// 2. Atualize a função `handleTipoChange` para atualizar o estado da opção selecionada:

const handleTipoChange = (e) => {
  const valorSelecionado = e.target.value;

  if (!tipoJurisdicoesMap[valorSelecionado]) {
    message.error('Opção de tipo selecionada inválida!');
    return;
  }

  const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];
  setTipoSelecionado(valorRadioGroup);
  setTipoSelecionadoTemp(valorRadioGroup);

  // ... o restante do seu código ...

  // Atualize o estado da opção selecionada
  setOpcaoSelecionada(valorSelecionado);
};

// 3. No componente `Radio.Group`, defina o valor com base no estado `opcaoSelecionada`:

<Radio.Group
  onChange={(e) => {
    handleTipoChange(e);
    setTipoSelecionadoValidator(e.target.value);
  }}
  value={opcaoSelecionada} // Defina o valor do Radio.Group
>
  {/* Seus Radio Buttons */}
</Radio.Group>
