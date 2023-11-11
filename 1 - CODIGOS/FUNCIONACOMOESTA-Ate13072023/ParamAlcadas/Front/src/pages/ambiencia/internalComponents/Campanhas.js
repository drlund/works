import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';

const Campanha = ({ capaUrl, idCampanha }) => {
  return (
    <Link to={`/ambiencia/registrar-avaliacao/${idCampanha}`}>
      <img src={capaUrl} width={287} height={174} />
    </Link>
  );
};

const Campanhas = ({ campanhas, title }) => {
  return (
    <Card title={title}>
      {campanhas.map((campanha) => {
        return (
          <Campanha
            titulo={campanha.titulo}
            capaUrl={campanha.capaUrl}
            idCampanha={campanha.idCampanha}
          />
        );
      })}
    </Card>
  );
};

export default Campanhas;
