import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Timeline, Empty } from 'antd';
import _ from 'lodash';
import styles from './mtnTimeline.module.scss';

const mapTipoIcons = {
  CRIACAO: { icon: 'edit', color: 'green', waiting: 'Aguardando análise' },
  SOLICITA_ESCLARECIMENTO: {
    icon: 'question-circle',
    waiting: 'Pendente esclarecimento do envolvido',
  },
  ESCLARECIMENTO_INICIAL: {
    icon: 'question-circle',
    waiting: 'Pendente esclarecimento do envolvido',
  },
  RESPONDE_ESCLARECIMENTO: {
    icon: 'check-circle',
    color: 'green',
    waiting: 'Aguardando análise',
  },
  DEVOLVER_PARA_ANALISE: { 
    icon: 'redo', 
    color: 'red',
    waiting: 'Aguardando análise' 
  },
  FINALIZAR_ANALISE: { icon: 'check', color: 'green' },
  SALVAR_PARECER: {
    icon: 'edit',
    waiting: 'Aguardando finalização da análise',
  },
  SALVAR_PARECER_RECURSO: {
    icon: 'edit',
    color: 'green',
    waiting: 'Aguardando Recurso.',
  },
  APROVAR_MEDIDA: {
    icon: 'edit',
    color: 'green',
  },
  ENVIOU_PARA_APROVACAO: {
    icon: 'edit',
    color: 'green',
    waiting: 'Aguardando Aprovação.',
  },
  VERSIONAR_OCORRENCIA: {
    icon: 'history',
    color: 'red',
  },
  CRIACAO_NOVA_VERSAO: {
    icon: 'edit',
    color: 'green',
    waiting: "Aguardando análise"
  },
  REVELIA_ESCLARECIMENTO: {
    icon: 'close',
    color: 'red',
    waiting: 'Aguardando finalização da análise',
  },
  REVELIA_RECURSO: {
    icon: 'close',
    color: 'red',
    waiting: 'Aguardando finalização da análise',
  },
  RESPONDER_RECURSO: {
    icon: 'edit',
    waiting: 'Aguardando parecer final da Super ADM',
  },
  RESPONDE_QUESTIONARIO: {
    icon: 'edit',
    waiting: 'Respondeu Questionário',
  },

  AGUARDANDO: { icon: 'clock-circle', color: 'red' },
  FINALIZADO: { icon: 'check-circle', color: 'green' },
  ALTEROU_MEDIDA: { icon: 'reload', color: 'blue' },

  SOLICITA_ALTERACAO_MEDIDA: { icon: 'redo', color: 'red' },
  CONFIRMA_ALTERACAO_MEDIDA: { icon: 'redo', color: 'red' },
  
};

export default function MtnTimeline({ timeline }) {
  if (timeline.length === 0) {
    return (
      <Empty
        description="Nenhuma ação para esta ocorrência"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const arrayTimeline = timeline.map((elem) => (
    <Timeline.Item
      key={elem.id}
      dot={
        <LegacyIcon
          type={mapTipoIcons[elem.acao].icon}
          style={{ color: mapTipoIcons[elem.acao].color, fontSize: '16px' }}
        />
      }
    >
      {elem.responsavel} - {elem.acaoDisplay} em {elem.data}
    </Timeline.Item>
  ));

  const lastElement = _.last(timeline);
  const lastItem = mapTipoIcons[lastElement.acao];
  const tipoFinalizacao = lastItem.waiting ? 'AGUARDANDO' : 'FINALIZADO';

  const { icon, color } = mapTipoIcons[tipoFinalizacao];

  arrayTimeline.push(
    <Timeline.Item
      key={lastItem.id}
      dot={<LegacyIcon type={icon} style={{ color, fontSize: '16px' }} />}
    >
      {lastItem.waiting ? lastItem.waiting : 'Finalizado'}
    </Timeline.Item>,
  );

  return (
    <div className={styles.timelineWrapper}>
      <Timeline>{arrayTimeline}</Timeline>
    </div>
  );
}
