/**
 * Para resolver esse problema no frontend, você precisa fazer o mapeamento correto entre os valores retornados pela tabela 
 * e os valores que são utilizados no "Radio.Group". Uma maneira de fazer isso é criar um objeto que relaciona os valores 
 * retornados pela tabela aos valores utilizados no "Radio.Group". Dessa forma, você pode usar esse objeto para obter o 
 * valor correto quando o usuário selecionar uma opção no "Radio.Group".
 * 
 * Dessa forma, quando o usuário selecionar uma opção no "Radio.Group", o valor será mapeado corretamente para o valor utilizado 
 * no estado "tipoSelecionado". Além disso, você pode continuar usando esse valor mapeado para definir o "formatoInput" e outras 
 * ações necessárias no restante do código.
 * 
 * Lembre-se de que você também precisará atualizar o campo "value" em cada opção do componente "Radio" para que corresponda aos 
 * valores retornados pela tabela (por exemplo, "cd_vicepres_juris", "cd_diretor_juris", etc.) e não aos valores mapeados no 
 * objeto "tipoJurisdicoesMap".
 * 
 * Aqui está um exemplo de como você pode fazer isso:
 */

// Mapeamento entre os valores da tabela e os valores do Radio.Group
const tipoJurisdicoesMap = {
  cd_vicepres_juris: 'vicePresi',
  cd_diretor_juris: 'diretoria',
  cd_super_juris: 'super',
  cd_gerev_juris: 'gerev',
  cd_redeage_juris: 'prefixo',
};

function FormParamSuspensao() {
  // ... outros estados e código ...

  const handleTipoChange = (/** @type {{ target: { value: any; }; }} */ e) => {
    const valorSelecionado = e.target.value;

    // Verifica se o valor selecionado existe no mapeamento
    if (!tipoJurisdicoesMap[valorSelecionado]) {
      // Mostra uma mensagem de erro ou trata o caso de valor inválido aqui
      message.error('Valor selecionado não é válido!');
      return;
    }

    // Obtém o valor utilizado no Radio.Group a partir do mapeamento
    const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];

    setTipoSelecionado(valorRadioGroup);

    let formatoInput = '';
    switch (valorRadioGroup) {
      // ... restante do seu código ...
    }

    // Restante do código igual ao anterior
    setTipoSelecionado(valorRadioGroup);

    // ... o restante do seu código aqui
  };

  // ... restante do seu código ...
}
