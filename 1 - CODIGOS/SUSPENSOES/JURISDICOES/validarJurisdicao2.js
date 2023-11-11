/**
 * Certifique-se de que `getTiposJurisdicoes` seja uma função que retorna os dados das jurisdições corretos, e não apenas 
 * o nome da função. Se continuar enfrentando problemas, verifique se os dados retornados por `getTiposJurisdicoes` são os 
 * esperados e se as chaves estão corretas.
 * 
 * O problema parece estar relacionado à maneira como você está obtendo os tipos válidos da jurisdição. Você está tentando 
 * filtrar `getTiposJurisdicoes`, que parece ser uma função, em vez de chamar a função para obter os dados reais. 
 * 
 * Vamos corrigir isso. Altere a linha onde você está definindo `validaJurisdicao` no `handleTipoChange` para chamar a função 
 * `getTiposJurisdicoes` e, em seguida, filtrar os tipos válidos com base na opção selecionada. Além disso, certifique-se de 
 * ajustar a verificação de tipos válidos na regra de validação do campo "tipo". Aqui está a parte do código que você precisa 
 * ajustar:
 */

const handleTipoChange = (/** @type {{ target: { value: any; }; }} */ e) => {
  const valorSelecionado = e.target.value;

  if (!tipoJurisdicoesMap[valorSelecionado]) {
    message.error('Opção de tipo selecionada inválida!');
    return;
  }

  const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];
  setTipoSelecionado(valorRadioGroup);

  let formatoInput = '';
  switch (valorRadioGroup) {
    // ... Resto do código ...
  }

  // Chamando a função getTiposJurisdicoes() para obter os dados reais das jurisdições
  const dadosJurisdicoes = getTiposJurisdicoes();

  setValidaJurisdicao(
    Object.keys(dadosJurisdicoes).filter(
      (tipo) => tipo === tipoJurisdicoesMap[valorSelecionado],
    ),
  );

  form.setFieldsValue({ tipo: '' });
  form.setFields([{ name: 'tipo', value: '' }]);
  setTipoInputValue(formatoInput);
};

// E, na regra de validação do campo "tipo":

<Form.Item
  name="tipo"
  label="Tipo"
  rules={[
    {
      required: true,
      message: 'Por favor, selecione um tipo!',
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || validaJurisdicao.includes(value)) {
          return Promise.resolve();
        }
        return Promise.reject(
          'O tipo selecionado não é válido para esta opção.',
        );
      },
    }),
  ]}
>
