/**
 * Vamos repensar a abordagem.
 * 
 * Aparentemente, os dados em "dadosJurisdicoes" estão estruturados de forma diferente do que eu estava entendendo. Vamos adaptar a abordagem para 
 * se adequar à estrutura real dos dados. Supondo que os dados estejam estruturados assim:

const dadosJurisdicoes = {
  diretorJuris: [{"cd_diretor_juris": "valor1"}, {"cd_diretor_juris": "valor2"}, ...],
  gerevJuris: [{"cd_gerev_juris": "valor3"}, {"cd_gerev_juris": "valor4"}, ...],
  prefixoJuris: [{"cd_redeage_juris": "valor5"}, {"cd_redeage_juris": "valor6"}, ...],
  superJuris: [{"cd_super_juris": "valor7"}, {"cd_super_juris": "valor8"}, ...],
  vicePresiJuris: [{"cd_vicepres_juris": "valor9"}, {"cd_vicepres_juris": "valor10"}, ...],
};

Vamos ajustar o código para refletir essa estrutura:

1. Modifique a função de validação no `rules` do campo "tipo" para verificar se o valor digitado está contido nos dados da jurisdição correspondente:

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
        if (!value || validaJurisdicao.includes(value)) {
          return Promise.resolve();
        }

        const jurisdicaoSelecionada = tipoJurisdicoesMap[tipoSelecionado];
        const chaveJurisdicao = Object.keys(dadosJurisdicoes[jurisdicaoSelecionada][0])[0];

        const dadosDaJurisdicao = dadosJurisdicoes[jurisdicaoSelecionada] || [];
        const valoresDaJurisdicao = dadosDaJurisdicao.map(item => item[chaveJurisdicao]);

        if (valoresDaJurisdicao.includes(value)) {
          return Promise.resolve();
        }

        return Promise.reject(
          'O tipo selecionado não é válido para esta opção.'
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

Certifique-se de que os dados em "dadosJurisdicoes" correspondam a essa estrutura e que as chaves das jurisdições estejam sendo obtidas corretamente. Se os dados estiverem corretos, isso deve permitir a validação correta do campo "tipo" com base nos dados da jurisdição correspondente.