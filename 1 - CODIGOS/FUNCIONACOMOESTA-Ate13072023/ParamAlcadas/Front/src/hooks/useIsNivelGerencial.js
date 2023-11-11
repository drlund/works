import { useState, useEffect } from "react";
import { fetchIsNivelGerencial } from "services/ducks/Arh.ducks";

export default function useIsNivelGerencial() {
  const [isNivelGerencial, setIsNivelGerencial] = useState(null);

  useEffect(() => {
    if (isNivelGerencial === null) {
      fetchIsNivelGerencial().then((permissao) => {
        setIsNivelGerencial(permissao);
      });
    }
  }, [isNivelGerencial]);

  return isNivelGerencial;
}
