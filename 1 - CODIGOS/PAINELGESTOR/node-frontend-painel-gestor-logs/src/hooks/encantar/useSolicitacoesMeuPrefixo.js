import { useState, useEffect } from "react";
import { message } from "antd";
import { fetchSolicitacoesMeusPrefixos } from "services/ducks/Encantar.ducks";

export default function usePermRegistroReacao() {
  const [solicitacoesMeuPrefixo, setSolicitacoesMeuPrefixo] = useState(null);

  useEffect(() => {
    if (solicitacoesMeuPrefixo === null) {
      fetchSolicitacoesMeusPrefixos()
        .then((solicitacoes) => {
          setSolicitacoesMeuPrefixo(solicitacoes);
        })
        .catch((error) => message.error(error));
    }
  }, [solicitacoesMeuPrefixo]);

  return solicitacoesMeuPrefixo;
}
