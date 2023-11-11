function FormParamAlcadas({ location }) {
  // ...

  const [prefixoData, setPrefixoData] = useState({
    comissao: "",
    nomeComissao: "",
  });

  useEffect(() => {
    if (prefixoDestino) {
      buscarDadosPrefixo(prefixoDestino)
        .then((result) => {
          if (result.length > 0) {
            const { comissao, nomeComissao } = result[0];
            setPrefixoData({ comissao, nomeComissao });
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar dados do prefixo:", error);
        });
    }
  }, [prefixoDestino]);

  // ...
  <>
    <Form.Item name="comissaoDestino" label="Comissão Destino" required>
      <Input
        type="text"
        required
        placeholder="Comissão"
        defaultValue={prefixoData.comissao}
      />
    </Form.Item>

    <Form.Item
      name="nomeComissaoDestino"
      label="Nome da Comissão"
      higth="150px"
      required
    >
      <Input
        type="text"
        required
        placeholder="Nome da comissão"
        defaultValue={prefixoData.nomeComissao}
      />
    </Form.Item>
  </>;
}
