/**
 * Essas alterações devem permitir que você lide com a validação para "matriculas" quando o usuário selecionar essa 
 * opção no Radio.Group e inserir um valor no formato especificado. A lógica de validação existente para outras opções 
 * deve continuar funcionando como antes.
 * 
 * Para lidar com a validação da opção "matriculas" no Radio.Group, você precisará fazer algumas modificações no seu 
 * código existente. As principais mudanças ocorrerão na função `handleTipoChange` e na lógica de validação dentro do 
 * `Form.Item` para o campo "tipo".
 * 
 * Aqui estão as alterações que você pode fazer no seu código:
 * 
 * 1. Atualize a função `handleTipoChange` para lidar com o caso "matriculas" e definir o formato apropriado para a entrada:
 */

const handleTipoChange = (/** @type {{ target: { value: any; }; }} */ e) => {
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
    // ... (outros casos)

    case 'matriculas':
      formatoInput = 'F0000000'; // formato para "matriculas"
      break;

    default:
      formatoInput = 'Escolha um tipo de entrada!';
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

// 2. Modifique o `Form.Item` para o campo "tipo" para incluir a nova lógica de validação para "matricula/

<Form.Item
  name="tipo"
  label="Tipo"
  rules={[
    {
      required: true,
      message: 'Por favor, selecione um tipo!',
    },
    () => ({
      validator(_, value) {
        const tipoSelecionado = tipoSelecionadoTemp;
        if (!value || validaJurisdicao.includes(value)) {
          return Promise.resolve();
        }

        if (!tipoSelecionado) {
          return Promise.resolve();
        }

        if (tipoSelecionado === 'matriculas') {
          // Valide o formato das matriculas (por exemplo, F0000000)
          if (/^F\d{7}$/.test(value)) {
            return Promise.resolve();
          } else {
            return Promise.reject('Formato de matrícula inválido!');
          }
        }

        const chaveJurisdicao = tipoSelecionado;
        const isValid = validarTipo(value, chaveJurisdicao);

        if (isValid) {
          return Promise.resolve();
        }

        return Promise.reject(
          'O tipo selecionado não é válido para esta opção.',
        );
      },
    }),
  ]}
>
  <InputPrefixoAlcada
    placeholder="Tipo"
    value={tipoInputValue}
    ref={tipoInputRef}
  />
</Form.Item>
