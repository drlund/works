import { useState, useEffect } from "react";
import { fetchPermRegistroReacao } from "services/ducks/Encantar.ducks";

export default function usePermRegistroReacao() {
  const [permRegistroReacao, setPermRegistroReacao] = useState(null);

  useEffect(() => {
    if (permRegistroReacao === null) {
      fetchPermRegistroReacao().then((podePermitirReacao) => {
        setPermRegistroReacao(podePermitirReacao);
      });
    }
  }, [permRegistroReacao]);

  return permRegistroReacao;
}
