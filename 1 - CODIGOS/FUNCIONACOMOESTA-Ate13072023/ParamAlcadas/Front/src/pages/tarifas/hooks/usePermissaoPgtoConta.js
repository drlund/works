import { useState, useEffect } from "react";
import { fetchPermPgtoConta } from "services/ducks/Tarifas.ducks";

export default function usePermissaoPgtoConta() {
  const [permPgtoConta, setPermPgtoConta] = useState(null);

  useEffect(() => {
    if (permPgtoConta === null) {
      fetchPermPgtoConta().then((permissao) => {
        setPermPgtoConta(permissao);
      });
    }
  }, [permPgtoConta]);

  return permPgtoConta;
}
