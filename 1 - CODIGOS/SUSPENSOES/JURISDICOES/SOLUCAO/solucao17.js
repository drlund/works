/**
 * Parece que ainda há alguns ajustes necessários. Vou esclarecer a abordagem correta:

1. Certifique-se de que a variável `dadosJurisdicoes` esteja contendo os arrays com os nomes corretos, como mencionado anteriormente.

const dadosJurisdicoes = {
  diretorJuris: [{"cd_diretor_juris": "valor1"}, {"cd_diretor_juris": "valor2"}, ...],
  gerevJuris: [{"cd_gerev_juris": "valor3"}, {"cd_gerev_juris": "valor4"}, ...],
  prefixoJuris: [{"cd_redeage_juris": "valor5"}, {"cd_redeage_juris": "valor6"}, ...],
  superJuris: [{"cd_super_juris": "valor7"}, {"cd_super_juris": "valor8"}, ...],
  vicePresiJuris: [{"cd_vicepres_juris": "valor9"}, {"cd_vicepres_juris": "valor10"}, ...],
};


2. Ajuste o `validator` do campo "tipo" para usar o nome da jurisdição selecionada no `tipoSelecionado` para acessar os dados corretos em `dadosJurisdicoes`:

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
        const dadosDaJurisdicao = dadosJurisdicoes[jurisdicaoSelecionada] || [];
        const chaveJurisdicao = Object.keys(dadosDaJurisdicao[0])[0];

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


Certifique-se de que o nome da jurisdição no `tipoSelecionado` esteja mapeado corretamente no objeto `tipoJurisdicoesMap`. Isso deve permitir que a validação funcione corretamente, verificando se o valor digitado está contido nos dados da jurisdição correspondente.