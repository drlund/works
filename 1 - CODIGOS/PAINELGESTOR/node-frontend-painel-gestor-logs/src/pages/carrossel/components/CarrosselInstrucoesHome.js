import {
  Typography
} from 'antd';
import React from 'react';

export default function InstrucoesHome() {
  return (
    <Typography.Paragraph>
      Nesta ferramenta você poderá incluir e programar os vídeos que são
      disponibilizados através das televisões da Sede da Super ADM.
      Saiba mais sobre as opções disponíveis ou navegue através dos botões à direita.
      <ul>
        <li>&quot;Incluir vídeo&quot;: envie um novo vídeo e o inclua na programação</li>
        <li>&quot;Listar Programação&quot;: consulte ou altere a programação já agendada</li>
      </ul>
    </Typography.Paragraph>

  );
}
