import { useState, useEffect } from "react";
import { fetchDadosMonitoramento } from "services/ducks/MtnComite.ducks";
export default function useDadosMonitoramento() {
  
  const [dadosMonitoramento, setDadosMonitoramento] = useState(null);

  useEffect(() => {
    if (dadosMonitoramento === null) {
      onFetchDadosMonitoramento();
    }
  }, [dadosMonitoramento]);

  return dadosMonitoramento;
}
