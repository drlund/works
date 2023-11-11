import React from 'react';
import { Typography } from 'antd';
import styles from './projetos.module.css';

function AcessoNegado() {
  return (
    <div className={styles.containerMsgAlerta}>
      <Typography.Title level={3} type="danger" strong>Você não possui acesso a esta ferramenta</Typography.Title>
    </div>
  );
}

export default AcessoNegado;
