import { useState, useEffect } from "react";
import { fetchPermIncluirSolicitacao } from "services/ducks/Encantar.ducks";

export default function usePermIncluirSolicitacao() {
  const [permIncluirSolicitacao, setPermIncluirSolicitacao] = useState(null);

  useEffect(() => {
    if (permIncluirSolicitacao === null) {
      fetchPermIncluirSolicitacao().then((podeIncluirSolicitacao) => {
        setPermIncluirSolicitacao(podeIncluirSolicitacao);
      });
    }
  }, [permIncluirSolicitacao]);

  return permIncluirSolicitacao;
}
