import React from 'react';
import { Typography } from 'antd';
import ImgManutencao from "./imgManutencao.svg";
import styles from "./ferramentaEmManutencao.module.scss"

export default function FerramentaEmManutencao() {
  return <div className={styles.container}>
    <img src={ImgManutencao} />
    <Typography.Title level={2}>Esta ferramenta está em manutenção</Typography.Title>
    <Typography.Paragraph strong>Estamos trabalhando para resolver o problema o mais rápido possível!</Typography.Paragraph>
  </div>
}