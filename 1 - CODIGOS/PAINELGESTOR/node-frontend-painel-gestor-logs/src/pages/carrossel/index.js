import React, { useState } from 'react';
import {
  Card, PageHeader, Button
} from 'antd';
import InstrucoesHome from './components/CarrosselInstrucoesHome';
import InclusaoVideo from './components/CarrosselInclusaoVideo';
import ListaVideos from './components/CarrosselListaVideosProgramacao';

const opcoesConteudos = {
  home: {
    title: 'Gestão do Carrossel de Notícias',
    label: 'Principal',
    conteudo: <InstrucoesHome />,
    type: 'secondary',
  },
  lista: {
    title: 'Listar Programação',
    conteudo: <ListaVideos />,
    type: 'secondary',
  },
  video: {
    title: 'Incluir Vídeo',
    conteudo: <InclusaoVideo />,
    type: 'primary',
  }
}

function Home() {
  const [opcoes, setOpcoes] = useState('home');

  return (
    <Card>
      <PageHeader
        className="site-page-header"
        title={<h3>{opcoesConteudos[opcoes].title}</h3>}
        extra={
          Object.entries(opcoesConteudos)
            .map(([key, value]) =>
              <Button key={key} type={value.type} disabled={key === opcoes} onClick={() => setOpcoes(key)}>
                {value.label || value.title}
              </Button>)
        }
      >
        {opcoesConteudos[opcoes].conteudo}
      </PageHeader>
    </Card>
  );
}

export default Home;
