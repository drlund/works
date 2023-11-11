import React from 'react';
import { Popover, Tag } from 'antd';
import { InfoCircleTwoTone } from '@ant-design/icons';

const VerVotosPopOver = (props) => {  
  const { votos, votacaoEmAndamento } = props;
  
  if (votos.length || votacaoEmAndamento) {
    const votosContent = (
      <div>
        {votos.map(voto => {
          const tipoVoto = {
            label: (voto.deferido) ? 'DEFERIDO' : 'INDEFERIDO',
            color: (voto.deferido) ? 'green' : 'red'
          };
  
          return (
            <p key={voto.id} style={{ fontSize: '0.8rem'}}>
              {voto.matriculaVotante} {voto.nomeVotante.toUpperCase()} ({voto.nomeFuncaoVotante}) - {voto.dtVoto} -
              <span style={{ color: tipoVoto.color }}> {tipoVoto.label}</span>
            </p>
          );
        })}
      </div>
    );
  
    let colorTag = 'geekblue';
    let labelTag = votos.length;
  
    if (votacaoEmAndamento) {  
      colorTag = 'purple';
      labelTag = `Em votação (${votos.length} ${(votos.length > 1) ? 'votos' : 'voto'})`;
    }
  
    return (votos.length) 
      ? <Popover placement="topLeft" title='Votos Efetuados' content={votosContent}>
          <Tag color={colorTag} className="link-cursor">
            {labelTag} <InfoCircleTwoTone style={{ marginLeft: 3 }} />
          </Tag>
        </Popover>
      : <Tag color={colorTag}>{labelTag}</Tag>;
  }
    
  return 0;
};

export default VerVotosPopOver;
