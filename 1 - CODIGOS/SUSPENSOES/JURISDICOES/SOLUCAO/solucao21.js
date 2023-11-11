/**
 * Vamos tentar uma abordagem mais direta para resolver esse problema.

Certifique-se de que a estrutura dos dados em `dadosJurisdicoes` esteja correta e que as chaves correspondam aos nomes das jurisdições, seguidas pelo sufixo `_juris`. Aqui está um exemplo:

const dadosJurisdicoes = {
  diretor_juris: [{"cd_diretor_juris": "valor1"}, {"cd_diretor_juris": "valor2"}, ...],
  gerev_juris: [{"cd_gerev_juris": "valor3"}, {"cd_gerev_juris": "valor4"}, ...],
  prefixo_juris: [{"cd_redeage_juris": "valor5"}, {"cd_redeage_juris": "valor6"}, ...],
  super_juris: [{"cd_super_juris": "valor7"}, {"cd_super_juris": "valor8"}, ...],
  vicepresi_juris: [{"cd_vicepres_juris": "valor9"}, {"cd_vicepres_juris": "valor10"}, ...],
};

Em seguida, no `validator` do campo "tipo", use `tipoSelecionado` para criar a chave correta para acessar os dados da jurisdição:

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

        const chaveJurisdicao = `${tipoSelecionado.toLowerCase()}_juris`;

        const dadosDaJurisdicao = dadosJurisdicoes[chaveJurisdicao] || [];
        const valoresDaJurisdicao = dadosDaJurisdicao.map(item => Object.values(item)[0]);

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

Certifique-se de que o nome da jurisdição em `tipoSelecionado` esteja correspondendo exatamente aos nomes usados como chaves em `dadosJurisdicoes`. Com esta abordagem, o `validator` deve funcionar corretamente e verificar se o valor digitado está contido nos dados da jurisdição selecionada.