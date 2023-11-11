/**
 * Dessa forma, ao selecionar "Vice Presidência," "Unid. Estratégica," "Unid. Tática" ou "Comercial," o campo `tipo` será definido como vazio, e você 
 * não receberá mais a mensagem de erro relacionada ao valor no campo. Certifique-se de que os valores correspondentes para essas opções sejam os 
 * apropriados para o seu aplicativo.
 * 
 * Para evitar que o campo seja preenchido com "cd_vicepres_juris", "cd_diretor_juris", "cd_super_juris" ou "cd_gerev_juris" automaticamente, você 
 * pode fazer o seguinte:
 * 
 * 1. No componente `<Radio.Group>`, atribua um valor diferente para cada opção que seja mais apropriado para o campo `tipo` correspondente. Por exemplo:
 */

<Radio.Group
  onChange={(e) => {
    handleTipoChange(e);
    form.setFieldsValue({ tipo: e.target.value }); // Aqui, defina o valor apropriado para o campo 'tipo'
  }}
  value={opcaoSelecionada}
>
  <Radio value="vicePresi"> Vice Presidência </Radio>
  <Radio value="diretoria"> Unid. Estratégica </Radio>
  <Radio value="supers"> Unid. Tática </Radio>
  <Radio value="gerev"> Comercial </Radio>
  <Radio value="prefixo"> Prefixo </Radio>
  <Radio value="matricula"> Matrícula </Radio>
</Radio.Group>

/**
 * 2. No método `handleTipoChange`, ajuste o código para que, ao selecionar uma opção que não seja "Matrícula," o campo `tipo` seja definido como vazio 
 * ('') para evitar que o valor anterior seja mantido:
 */

const handleTipoChange = (/** @type {{ target: { value: any; }; }} */ e) => {
  const valorSelecionado = e.target.value;

  if (valorSelecionado !== 'matricula') {
    form.setFieldsValue({ tipo: '' });
  }

  const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];
  setTipoSelecionado(valorRadioGroup);
  setTipoSelecionadoTemp(valorRadioGroup);

  const dadosJurisdicoes = getTiposJurisdicoes();
  const jurisdicaoSelecionada = tipoJurisdicoesMap[valorSelecionado];

  setValidaJurisdicao(
    Object.values(dadosJurisdicoes).filter(
      (prefixoTipo) => prefixoTipo === jurisdicaoSelecionada,
    ),
  );

  setOpcaoSelecionada(valorSelecionado);
};
