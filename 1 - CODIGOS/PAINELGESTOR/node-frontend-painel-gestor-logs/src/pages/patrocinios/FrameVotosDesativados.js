import React from 'react';
import { Card } from 'antd';

const FrameVotosDesativados = (props) => {
  const { solicitacoes } = props;

  if (solicitacoes && solicitacoes.length) {
    return solicitacoes.map(solicitacao => {
      const { idSolicitacao, prefixoVotante, nomePrefixoVotante, nomeEvento, votos } = solicitacao;

      return (
        <Card key={idSolicitacao} size="small" title={`Prefixo votante: ${prefixoVotante} - ${nomePrefixoVotante}`} style={{ marginBottom: 15 }}>
          <Card type="inner" size="small" title={`Evento: ${nomeEvento}`}>
            {votos.map(voto => {
              const { matriculaVotante, nomeVotante, nomeFuncaoVotante, dtVoto, deferido } = voto;
              const tipoVoto = {
                label: (deferido) ? 'DEFERIDO' : 'INDEFERIDO',
                color: (deferido) ? 'green' : 'red'
              };

              return (
                <p key={matriculaVotante} style={{ fontSize: '0.8rem' }}>
                  {matriculaVotante} {nomeVotante.toUpperCase()} ({nomeFuncaoVotante}) - {dtVoto} - <span style={{ color: tipoVoto.color }}> {tipoVoto.label}</span>
                </p>
              );
            })}
          </Card>
        </Card>
      );
    });
  }

  return null;
}

export default FrameVotosDesativados;