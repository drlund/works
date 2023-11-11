/**
 * A função `setDadosJurisdicoes` não é necessária na abordagem que estamos seguindo. Minha sugestão anterior estava incorreta. Desculpe pelo equívoco.

Aqui está o trecho de código corrigido para o `validator` do campo "tipo":

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
        const chaveJurisdicao = `${jurisdicaoSelecionada}_juris`;

        const dadosDaJurisdicao = dadosJurisdicoes[chaveJurisdicao] || [];
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

Certifique-se de que a variável `dadosJurisdicoes` esteja contendo os arrays com os nomes corretos, como "diretorJuris", "gerevJuris", "prefixoJuris", "superJuris" e "vicePresiJuris", conforme a estrutura que você descreveu:

const dadosJurisdicoes = {
  diretorJuris: [{"cd_diretor_juris": "valor1"}, {"cd_diretor_juris": "valor2"}, ...],
  gerevJuris: [{"cd_gerev_juris": "valor3"}, {"cd_gerev_juris": "valor4"}, ...],
  prefixoJuris: [{"cd_redeage_juris": "valor5"}, {"cd_redeage_juris": "valor6"}, ...],
  superJuris: [{"cd_super_juris": "valor7"}, {"cd_super_juris": "valor8"}, ...],
  vicePresiJuris: [{"cd_vicepres_juris": "valor9"}, {"cd_vicepres_juris": "valor10"}, ...],
};

Certifique-se de que o nome da jurisdição no `tipoSelecionado` seja igual à chave do objeto em `dadosJurisdicoes`. Isso deve permitir que a validação funcione corretamente.