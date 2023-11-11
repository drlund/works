import React, { useEffect, useState } from 'react';
import { TimelineBody } from './TimelineBody';

const mockHistorico = [
  {
    tipo: 'cadastro',
    data: '01/01/2020',
    funci: {
      chave: 'F3456789',
      nome: 'João da Silva',
      cargo: 'Advogado'
    }
  },
  {
    tipo: 'alteracao',
    data: '01/01/2021',
    funci: {
      chave: 'F3456789',
      nome: 'João da Silva',
      cargo: 'Advogado'
    }
  },
  {
    tipo: 'alteracao',
    data: '01/01/2022',
    funci: {
      chave: 'F3456789',
      nome: 'João da Silva',
      cargo: 'Advogado'
    }
  },
  {
    tipo: 'alteracao',
    data: '01/01/2023',
    funci: {
      chave: 'F3456789',
      nome: 'João da Silva',
      cargo: 'Advogado'
    }
  },
  {
    tipo: 'alteracao',
    data: '01/01/2024',
    funci: {
      chave: 'F3456789',
      nome: 'João da Silva',
      cargo: 'Advogado'
    }
  },
  {
    tipo: 'alteracao',
    data: '01/01/2025',
    funci: {
      chave: 'F3456789',
      nome: 'João da Silva',
      cargo: 'Advogado'
    }
  },
  {
    tipo: 'alteracao',
    data: '01/01/2026',
    funci: {
      chave: 'F3456789',
      nome: 'João da Silva',
      cargo: 'Advogado'
    }
  },
  {
    tipo: 'alteracao',
    data: '01/01/2027',
    funci: {
      chave: 'F3456789',
      nome: 'João da Silva',
      cargo: 'Advogado'
    }
  },
  {
    tipo: 'alteracao',
    data: '01/01/2028',
    funci: {
      chave: 'F3456789',
      nome: 'João da Silva',
      cargo: 'Advogado'
    }
  },
  {
    tipo: 'alteracao',
    data: '01/01/2029',
    funci: {
      chave: 'F3456789',
      nome: 'João da Silva',
      cargo: 'Advogado'
    }
  },
];

export function TimelineWrapper({ procuracao, historico, onData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!historico) {
      setLoading(true);
      setTimeout(() => {
        onData(mockHistorico);
        // setError(true);
        setLoading(false);
      }, 500);
      // fetch(`/procuracoes/historico/${procuracao.id}`, FETCH_METHODS.GET)
      //   .then(setHistorico)
      //   .catch((err) => {
      //     console.error(err);
      //     setError(true);
      //   })
      //   .finally(() => setLoading(false));
    }
  }, [procuracao, historico]);

  return (
    <TimelineBody
      loading={loading}
      error={error}
      historico={historico}
    />
  );
}
