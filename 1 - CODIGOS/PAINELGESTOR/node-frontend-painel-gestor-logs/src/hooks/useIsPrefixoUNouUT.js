import { useState, useEffect } from "react";
import { acessoPermitido } from 'services/ducks/HoraExtra.ducks';

export default function useIsPrefixoUNouUT() {
  const [isPrefixoUNouUT, setIsPrefixoUNouUT] = useState(null);

  useEffect(() => {
    if (isPrefixoUNouUT === null) {
      acessoPermitido().then((permissao) => {
        setIsPrefixoUNouUT(permissao);
      });
    }
  }, [isPrefixoUNouUT]);

  return isPrefixoUNouUT;
}
