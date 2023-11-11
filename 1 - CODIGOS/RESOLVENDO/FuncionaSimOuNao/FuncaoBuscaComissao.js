function buscarComissaoDestino(prefixo) {
    if (prefixo) {
      getCargosComissoesFot09(prefixo)
        .then((result) => {
          setComissaoDestinoOptions(result);
        })
        .catch(() => {
          setComissaoDestinoOptions([]);
          message.error('Falha ao buscar comissão destino!');
        });
    } else {
      setComissaoDestinoOptions([]);
    }
  }