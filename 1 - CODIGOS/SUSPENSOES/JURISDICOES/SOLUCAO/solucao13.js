/**
 * Parece que estamos enfrentando alguns problemas na obtenção dos dados da jurisdição. Vamos ajustar o código para garantir que 
 * estamos acessando os dados corretamente. Se os dados em "dadosJurisdicoes" estão estruturados como no exemplo que você forneceu 
 * ("superJuris: [{"cd_super_juris": "9553"}, ...]"), siga as etapas abaixo:

1. Certifique-se de que os dados em "dadosJurisdicoes" estão sendo buscados e estruturados corretamente em um objeto.

2. Atualize o `useEffect` para mapear os dados da jurisdição corretamente, usando o nome da jurisdição como chave:

useEffect(() => {
  const fetchTiposSuspensao = async () => {
    try {
      const data = await getTipoSuspensao();
      const dadosJurisdicoes = await getTiposJurisdicoes();

      setTiposSuspensao(data);

      // Estruturar os dados da jurisdição corretamente
      const dadosJurisdicoesFormatados = {
        diretorJuris: dadosJurisdicoes.diretorJuris.map(item => item.cd_diretor_juris),
        gerevJuris: dadosJurisdicoes.gerevJuris.map(item => item.cd_gerev_juris),
        prefixoJuris: dadosJurisdicoes.prefixoJuris.map(item => item.cd_redeage_juris),
        superJuris: dadosJurisdicoes.superJuris.map(item => item.cd_super_juris),
        vicePresiJuris: dadosJurisdicoes.vicePresiJuris.map(item => item.cd_vicepres_juris),
      };

      setDadosJurisdicoes(dadosJurisdicoesFormatados);
    } catch (error) {
      message.error('Erro ao buscar os tipos de suspensão:', error);
    }
  };

  fetchTiposSuspensao();
}, []);

3. Modifique a função de validação no `rules` do campo "tipo" para verificar se o valor digitado está contido nos dados da jurisdição correspondente:

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

        if (dadosDaJurisdicao.includes(value)) {
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

Certifique-se de que a estrutura dos dados da jurisdição esteja correta e que os valores estejam sendo buscados e comparados corretamente. Se os dados estiverem sendo mapeados corretamente no `useEffect`, a variável `dadosDaJurisdicao` deverá conter o array correspondente à jurisdição selecionada.